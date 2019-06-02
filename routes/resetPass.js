const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const crypto = require("crypto");
const bcrypt = require("bcrypt-nodejs");
const saltRounds = 10;
const Email = require("email-templates");
const passwordValidator = require("password-validator");
require('dotenv').config();


/**
 * POST route sends reset password email to given email.
 * 
 * @param email - email 
 * 
 * NOTE: if user forgets their password, then they wont be able to login and
 * wont be able to get a token so we dont check for tokens on these routes
 */
router.post("/", (req, res) => {
  // var host = 'http:/localhost:3000'
  var host = "https://193ecommerce.com"
  if (req.body.params) {
    var { email } = req.body.params;
  } else {
    var { email } = req.body;
  }

  if (!email) {
    console.log("Missing params for route.");
    return res.json({
      success: false,
      message: "Missing parmas for route"
    });
  }

  const userRef = db.collection("users").doc(email);
  userRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log("No such account for given email:", email);
        return res.json({
          success: false,
          message: "Sorry, no such account for given email."
        });
      }

      // if oAuth, cannot resept password
      if (doc.data().isOauth === true) {
        console.log("Account given for reset pass is Oauth:", email);
        return res.json({
          success: false,
          message: "Sorry, it seems you signed up your account through a third-party service like Google. You cannot reset the account's password through us."
        });

      }

      const token = crypto.randomBytes(20).toString("hex");
      const now = Date.now();
      const time = new Date(now + 3600000);

      console.log("Reset token is:", token);
      console.log("Time is:", time);
      userRef.update({
        resetPassToken: token,
        resetPassExpires: time
      });

      // once obtained the orders
      const emailSubject = "ECS 193 Ecommerce Reset Password";
      const title = "Password Reset";
      const intro =
        `You are receiving this email because you (or someone else) has
        requested a password reset for your account.\n` +
        `Please click on the following link within one hour of receiving it: `;
      
      const link = 
        `${host}/inputNewPassword/?token=${token} \n\n`;

      const introEnd = 
        `If you did not request this, please ignore this email and your
        password will remain unchanged.\n`;

      const resetPassEmail = new Email({
        message: {
          from: process.env.EMAIL,
          // from: 'test@test.com',
          subject: emailSubject,
          to: email
        },
        send: true,     // set send to true when not testing
        preview: false, 

        transport: {
          tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
          },
          // uncomment when actually sending emails
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
          }
        }
      });

      resetPassEmail
        .send({
          template: "resetPass",
          locals: {
            title,
            intro,
            link,
            introEnd,
          }
        })
        .then(() => {
          console.log("Finished sending reset email to:", email);
          return res.json({
            success: true,
            message: "Successfully sent reset password email."
          });
        })
        .catch(console.log);
    })
    .catch(err => {
      console.log("Error in reset pass route:", err);
      return res.json({
        success: false,
        message: "Server error: " + err
      });
    });
});

/**
 * GET route that find corresponding email in DB for given token. If token
 * exists and has not yet expired, send back corresponding email to frontend to
 * reset password.
 * 
 * @param resetPassToken - token obtained from password reset email link
 */
router.get("/checkToken", (req, res) => {
  if (req.query.params) {
    var { resetPassToken } = req.query.params;
  } else {
    var { resetPassToken } = req.query;
  }

  if (!resetPassToken) {
    console.log("Missing params for route.");
    return res.json({
      success: false,
      message: "Missing params for route"
    });
  }

  const time = new Date();
  // console.log(time);

  const queryRef = db
    .collection("users")
    .where("resetPassToken", "==", resetPassToken)
    .where("resetPassExpires", ">", time);

  queryRef
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No such token or expired:", resetPassToken);
        return res.json({
          success: false,
          message: "invalid"
        });
      }

      let email = "";

      // should only be one doc in snapshot
      snapshot.forEach(doc => {
        email = doc.data().email;
      });
      // token link found
      return res.json({
        success: true,
        email: email,
        message: "Passwork reset link is good."
      });
    })
    .catch(err => {
      console.log("Error in check token route:", err);
      return res.json({
        success: false,
        message: "Server error: " + err
      });
    });
});

/**
 * POST route that updates password for given email.
 * 
 * @param email - email for account resetting password
 * @param newPassword - new password 
 */
router.post("/updatePass", (req, res) => {
  if (req.body.params) {
    var { email, newPassword } = req.body.params;
  } else {
    var { email, newPassword } = req.body;
  }

  if (!email || !newPassword) {
    console.log("Missing params for route.");
    return res.json({
      success: false,
      message: "Missing params for route"
    });
  }

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

  if (!passwordSchema.validate(newPassword)) {
    return res.json({
      success: false,
      message:
        "Password must be at least 8 characters and consist only of letters and numbers."
    });
  }

  const userRef = db.collection("users").doc(email);
  userRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log("No such account for given email:", email);
        return res.json({
          success: false,
          message: "Sorry, no such account for given email."
        });
      }

      // password hashing
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(newPassword, salt, null, (err, hashedPassword) => {
          if (err) {
            return res.json({
              success: false,
              message: "Sorry, there was a server error."
            });
          }
          userRef
            .update({
              password: hashedPassword,
              resetPassToken: null,
              resetPassExpires: null
            })
            .then(() => {
              console.log("Successfully updated password.");
              return res.json({
                success: true,
                message: "Successfully updated password. You can now login."
              });
            })
            .catch(err => {
              console.log("Server error in updating DB:", err);
              return res.json({
                success: false,
                message: "Sorry, there was a server error."
              });
            });
        });
      }); // end bcrypt.genSalt
    })
    .catch(err => {
      console.log("Error in reset pass route:", err);
      return res.json({
        success: false,
        message: "Sorry, there was a server error."
      });
    });
});

module.exports = router;