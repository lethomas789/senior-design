const express = require("express");
const router = express.Router();
const firebase = require("firebase");
const admin = require("firebase-admin");
const db = admin.firestore();
const validator = require("validator");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const jwtKey = require("../config/jwt.json");
const saltRounds = 10;
const Email = require("email-templates");
const crypto = require("crypto");
const passwordValidator = require("password-validator");

function sendEmail(email, token) {
  // send email confirmation email
  const emailSubject = "ECS 193 Ecommerce Verification Email";
  const title = `Account Confirmation`;
  const intro = `Thanks for signing up!. Please click the following link to activate your account: \n\n`;

  var host = "https://193ecommerce.com";

  const link = `${host}/emailConfirmation/${token} \n\n`;

  const confirmEmail = new Email({
    message: {
      from: process.env.EMAIL,
      // from: 'test@test.com',
      subject: emailSubject,
      to: email
    },
    send: true, // set send to true when not testing
    // preview: false, // TODO turn off preview before production

    transport: {
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      },
      // uncomment when actually sending emails
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      }
    }
  });

  confirmEmail
    .send({
      template: "resetPass",
      locals: {
        title,
        intro,
        link
      }
    })
    .then(() => {
      console.log("Finished signup email to:", email);
      /*
          return res.json({
            success: true,
            message: "Successfully sent reset password email."
          });
          */
    })
    .catch(console.log);
}

// sign up user
router.post("/", (req, res) => {
  if (req.body.params) {
    // extract user info from request
    var { firstName, lastName, email, password } = req.body.params;
  } else {
    var { firstName, lastName, email, password } = req.body;
  }

  // emails case insensitive so lowercase them to save in DB
  email = email.toLowerCase();

  var passwordSchema = new passwordValidator();

  passwordSchema
    .is()
    .min(8)
    .is()
    .max(40)
    .has()
    .digits()
    .has()
    .letters()
    .has()
    .not()
    .spaces();

  // validation, checking empty inputs
  if (
    firstName.trim() === "" ||
    lastName.trim() === "" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    return res.json({
      success: false,
      message: "One or more fields are empty!"
    });
  }

  // checking invalid email
  else if (validator.isEmail(email) === false) {
    return res.json({
      success: false,
      message: "Invalid Email"
    });
  }

  // checking password length
  else if (!passwordSchema.validate(password)) {
    return res.json({
      success: false,
      message:
        "Password must be at least 8 characters and consist only of letters and numbers."
    });
  }

  // check to see if data object exists in user collection
  // find document by email, email viewed as unique identifer
  const ref = db.collection("users").where("email", "==", email);

  // get documents with matching query
  ref
    .get()
    .then(snapshot => {
      //if user already exists, return
      if (snapshot.size > 0) {
        return res.json({
          success: false,
          message: "Email is already in use!"
        });
      }

      // user has one hour to activate their account
      const token = crypto.randomBytes(20).toString("hex");
      const now = Date.now();
      const time = new Date(now + 3600000);

      // no pre exisitng account so create new user
      // create object to store into database
      const newUser = {
        name: {
          firstName,
          lastName
        },
        email,
        password,
        isAdmin: false,
        isVerified: false,
        emailToken: token,
        emailTokenExpires: time
      };

      // password hashing
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(newUser.password, salt, null, (err, hash) => {
          if (err) {
            return res.json({
              success: false,
              message: "Server error hashing password"
            });
          }

          // store user into database
          newUser.password = hash;
          db.collection("users")
            .doc(email)
            // do a merge here so that the async set of newUser does not overwrite the email o
            .set(newUser);
        });
      }); // end bcrypt.genSalt

      // generate JWT
      const payload = { email };
      jwt.sign(payload, jwtKey.JWTSecret, { expiresIn: 3600 }, (err, token) => {
        res.status(200).json({
          success: true,
          message: "Signup Successful!",
          email,
          token: "Bearer " + token
        });
      });

      sendEmail(email, token);
    })
    .catch(err => {
      // catch for ref.get
      console.error(err);
      return res.json({
        success: false,
        message: "Error with server"
      });
    });
});

router.get("/confirmEmail", (req, res) => {
  if (req.query.params) {
    var { token } = req.query.params;
  } else {
    var { token } = req.query;
  }

  if (!token) {
    console.log("Missing params for route.");
    return res.json({
      success: false,
      message: "Missing params for route."
    });
  }

  const time = new Date();

  const emailQueryRef = db
    .collection("users")
    .where("emailToken", "==", token)
    .where("emailTokenExpires", ">", time);

  emailQueryRef
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No such token or expired:", token);
        return res.json({
          success: false,
          message: "Sorry, password reset link is invalid or has expired."
        });
      }

      let email = "";

      // should only be one doc in snapshot
      snapshot.forEach(doc => {
        email = doc.data().email;
      });

      // update isVerified bool for user
      db.collection("users")
        .doc(email)
        .update({
          isVerified: true,
          emailToken: null,
          emailTokenExpires: null
        });

      console.log("Activated account:", email);
      return res.json({
        success: true,
        message: "Sucessfully activated account."
      });
    })
    .catch(err => {
      console.log("Erro in email confimation:", err);
      return res.json({
        success: false,
        message: "Error in email confirmation: " + err
      });
    });
}); // END GET /confirmEmail

router.post("/googleSignup", (req, res) => {
  if (req.body.params) {
    var { email, firstName, lastName } = req.body.params;
  } else {
    var { email, firstName, lastName } = req.body;
  }

  if (!email || !firstName || !lastName) {
    console.log("Missing params for route.");
    return res.json({
      success: false,
      message: "Missing params for route."
    });
  }

  const userRef = db.collection("users").doc(email);

  userRef
    .get()
    .then(doc => {
      if (doc.exists) {
        console.log("Email already exists");
        return res.json({
          success: false,
          message: "Sorry, an acount with this email already exists."
        });
      }

      // else, email does not exist, make account
      const token = crypto.randomBytes(20).toString("hex");
      const now = Date.now();
      const time = new Date(now + 3600000);

      userRef
        .set(
          {
            name: {
              firstName,
              lastName
            },
            email,
            isAdmin: false,
            isVerified: false,
            isOauth: true,
            emailToken: token,
            emailTokenExpires: time
          },
          { merge: true }
        ) // merge just in casej
        .then(() => {
          console.log("New account successfully made: ", email);
          res.json({
            success: true,
            message: "Successfully made new account.",
            email
          });
          sendEmail(email, token);
        })
        .catch(err => {
          console.log("Server error for googleSignup route:", err);
          return res.json({
            success: false,
            message: "Sorry there was a server error. Please try again later."
          });
        });
    })
    .catch(err => {
      console.log("Server error in google signup route:", err);
      return res.json({
        success: false,
        message: "Sorry there was a server error. Please try again later."
      });
    });
});

module.exports = router;
