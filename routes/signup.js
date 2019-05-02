const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const jwtKey = require('../config/jwt.json');
const saltRounds = 10;
const Email = require("email-templates");
const crypto = require("crypto");

// sign up user
router.post('/', (req, res) => {

  if (req.body.params) {
    // extract user info from request
    var {
      firstName,
      lastName,
      email,
      password
    } = req.body.params;
  }
  else {
    var {
      firstName,
      lastName,
      email,
      password
    } = req.body;
  }

  // emails case insensitive so lowercase them to save in DB
  email = email.toLowerCase();


  // validation, checking empty inputs
  if (firstName.trim() === '' || lastName.trim() === '' || email.trim() === '' || password.trim() === '') {
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
  else if (validator.isLength(password, { min: 8, max: 20 }) === false) {
    return res.json({
      success: false,
      message: "Password must be at least 8 characters"
    });
  }

  // check to see if data object exists in user collection
  // find document by email, email viewed as unique identifer 
  const ref = db.collection('users').where('email', '==', email);

  // get documents with matching query
  ref.get()
    .then(snapshot => {
      //if user already exists, return
      if (snapshot.size > 0) {
        return res.json({
          success: false,
          message: "Email is already in use!"
        });
      }

      // no matching results, create new user
      // create object to store into database
      const newUser = {
        name: {
          firstName,
          lastName,
        },
        email,
        password,
        isAdmin: false,
        isVerified: false,
      }

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
          db.collection('users').doc(email).set(newUser);

        })
      });  // end bcrypt.genSalt

      // generate JWT
      const payload = { email };
      jwt.sign(payload, jwtKey.JWTSecret, { expiresIn: 3600 }, (err, token) => {
        res.status(200).json({
          success: true,
          message: "Signup Successful!",
          email, 
          token: 'Bearer ' + token
        });
      });

      // user has one hour to activate their account
      const token = crypto.randomBytes(20).toString("hex");
      const now = Date.now();
      const time = new Date(now + 3600000);

      console.log("Reset token is:", token);
      console.log("Time is:", time);
      db.collection('users').doc(email).set({
        emailToken: token,
        emailResetToken: time
        // testTimeNow: admin.firestore.Timestamp.now()
      }, { merge: true });

      // send email confirmation email
      const emailSubject = "ECS 193 Ecommerce Verification Email";
      const title = `Account Confirmation`
      const intro = 
        `Thanks for signing up!. Please click the following link to activate your account: \n\n`
      
      const link = 
        `http://localhost:3000/emailConfirmation/${token} \n\n`;

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
            pass: process.env.EMAIL_PASS,
          }
        }
      });

      confirmEmail
        .send({
          template: "resetPass",
          locals: {
            title,
            intro,
            link,
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
    })
    .catch(err => {  // catch for ref.get
      console.error(err);
      return res.json({
        success: false,
        message: "Error with server"
      });
    })
});

router.post('/googleSignup', (req, res) => {
  if (req.body.params) {
    var {
      email,
      firstName,
      lastName,
    } = req.body.params;

  }
  else {
    var {
      email,
      firstName,
      lastName,
    } = req.body;
  }

  if (!email || !firstName || !lastName) {
    console.log("Missing params for route.");
    return res.json({
      success: false,
      message: "Missing params for route."
    });
  }

  const userRef = db.collection('users').doc(email);

  userRef.get().then(doc => {
    if(doc.exists) {
      console.log('Email already exists');
      return res.json({
        success: false,
        message: 'Sorry, an acount with this email already exists.'
      });
    }

    // else, email does not exist, make account
    userRef.set({
      name: {
        firstName,
        lastName
      },
      email,
      isAdmin: false,
      isVerified: true,
      isOauth: true,
    }, { merge: true })  // merge just in casej
    .then(() => {
      console.log('New account successfully made: ', email);
      return res.json({
        success: true,
        message: 'Successfully made new account.',
        email
      });
    })
    .catch(err => {
      console.log('Server error for googleSignup route:', err);
      return res.json({
        success: false,
        message: 'Sorry there was a server error. Please try again later.'
      });
    })
  })
  .catch(err => {
    console.log('Server error in google signup route:', err);
    return res.json({
      success: false,
      message: 'Sorry there was a server error. Please try again later.'
    });
  });
});

module.exports = router;
