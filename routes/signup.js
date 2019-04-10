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
        isAdmin: false
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
        return res.status(200).json({
          success: true,
          message: "Signup Successful!",
          email, 
          token: 'Bearer ' + token
        });
      });

    })
    .catch(err => {  // catch for ref.get
      console.error(err);
      return res.json({
        success: false,
        message: "Error with server"
      });
    })
})

module.exports = router;
