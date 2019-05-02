const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const jwtKey = require('../config/jwt.json');

router.post('/', (req, res) =>{
  //extract email and password from request
  if (req.body.params) {
    var email = req.body.params.email.toLowerCase();
    var password = req.body.params.password;
  }
  else {
    var email = req.body.email.toLowerCase();
    var password = req.body.password;
  }

  //if email is invalid
  if (validator.isEmail(email) === false){
    return res.status(200).json({
      success: false,
      message: "Invalid Email"
    });
  }

  //if input fields were empty
  if (email.trim() === '' || password.trim() === ''){
    return res.status(200).json({
      success: false,
      message: "Empty Inputs"
    });
  }

  // check to see if an account exists with given email

  const userRef = db.collection('users').doc(email);
  userRef.get().then(doc => {
    if (!doc.exists) {
      console.log('No such account for given email:', email);
      return res.status(200).json({
        success: false,
        message: 'No such account for given email: ' + email
      });
    }

    bcrypt.compare(password, doc.data().password, (err, validPassword) => {
      if (err) {
        return res.status(200).json({
          success: false,
          message: "Server error comparing passwords"
        });
      }

      let vendors = [];

      // if passwords match, send JWT to authenticate login
      if (validPassword) {
        // if they are an admin, get their vendors
        if (doc.data().isAdmin) {
          // we assume they will exist in admin collection
          db.collection('admins').doc(email).get().then(doc => {
            if (!doc.exists) {
              console.log('Server error in getting admin info');
              return res.status(200).json({
                success: false,
                message: 'Server error in getting admin info' 
              });
            }
            vendors = doc.data().vendors;

            //info that JWT stores
            const payload = { email };

            jwt.sign(payload, jwtKey.JWTSecret, { expiresIn: 3600 }, (err, token) => {
              return res.status(200).json({
                success: true,
                message: "Login Successful!",
                token: 'Bearer ' + token,
                email,
                vendors
              });
            });

          })
          .catch(err => {
            console.log('Server error in getting admin info:', err);
            return res.status(200).json({
              success: false,
              message: 'Server error in getting admin info: ' + err
            });
          });

        }

        // else not admin, send empty array
        else {
          // info that JWT stores
          const payload = { email: email };

          jwt.sign(payload, jwtKey.JWTSecret, { expiresIn: 3600 }, (err, token) => {
            return res.status(200).json({
              success: true,
              message: "Login Successful!",
              token: 'Bearer ' + token,
              email,
              vendors
            });
          });
        }

      }

      // if passwords don't match
      else {
        return res.status(200).json({
          success: false,
          message: "Incorrect Password"
        });
      }
    });

  })
  .catch(err => {  // catch for userRef.get
    console.log('Error in getting userRef:', err);
    return res.status(200).json({
      success: false,
      message: 'Error in getting userRef: ' + err
    });
  });
})

router.get('/googleLogin', (req, res) => {
  if (req.query.params) {
    var {
      email,
      firstName,
      lastName
    } = req.query.params;
  }
  else {
    var {
      email,
      firstName,
      lastName
    } = req.query;
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
    if(!doc.exists) {
      console.log('No such account for provided email:', email);
      return res.json({
        success: false,
        message: 'Sorry, no such account for this email.'
      });
    }

    if(doc.data().isAdmin) {
      db.collection('admins').doc(email).get().then(adoc => {
        if (!adoc.exists) {
          console.log('Server error in getting admin info');
          return res.status(200).json({
            success: false,
            message: 'Server error in getting admin info' 
          });
        }
        const vendors = adoc.data().vendors;
        console.log('vendors here', vendors);

        return res.status(200).json({
          success: true,
          message: "Login Successful!",
          email,
          vendors
        });
      })
      .catch(err => {
        console.log('Server error in getting admin info:', err);
        return res.status(200).json({
          success: false,
          message: 'Server error in getting admin info: ' + err
        });
      });
    }
    else {
      return res.json({
        success: true,
        message: 'Login successful.',
        email,
        vendors: [],
      });
    }
  })
  .catch(err => {
    console.log('Server error in google signup route:', err);
    return res.json({
      success: false,
      message: 'Sorry there was a server error. Please try again later.'
    });
  });




});

//extract email parameter from google oauth
router.get('/gmail', (req,res) => {

  //database parameters are passed through query
  var query = req.query;
  var email = "";
  var firstName = "";
  var lastName = "";
  var vendors = [];

  //trim for white spaces from parameter
  email = query.email.trim();
  firstName = query.firstName.trim();
  lastName = query.lastName.trim();
  
  //find email, similar logic as regular login
  //main difference is extracting login credentials using gmail params
  const userRef = db.collection('users').doc(email);
  userRef.get().then(doc => {
    //if the gmail for the user does not exist, create a new user in firestore database with gmail as identifier
    //combo of signup + login code
    if(!doc.exists){
      // no matching results, create new user
      // create object to store into database
      const newUser = {
        name: {
          firstName,
          lastName,
        },
        email,
        isAdmin: false
      }

      //create new user in database with parameters passed from google login oauth
      db.collection('users').doc(email).set(newUser);
      return res.status(200).json({
        success: true,
        message: "Login Successful!",
        email
      });
    }

    //sign in user
    else{
      if(doc.data().isAdmin) {
        // we assume they will exist in admin collection
        db.collection('admins').doc(email).get().then(doc => {
          if (!doc.exists) {
            console.log('Server error in getting admin info');
            return res.status(200).json({
              success: false,
              message: 'Server error in getting admin info' 
            });
          }
          vendors = doc.data().vendors;

          return res.status(200).json({
            success: true,
            message: "Login Successful!",
            email,
            vendors
          });
        })
        .catch(err => {
          console.log('Server error in getting admin info:', err);
          return res.status(200).json({
            success: false,
            message: 'Server error in getting admin info: ' + err
          });
        });
      }

      // else not admin, send empty array
      else {
        return res.status(200).json({
          success: true,
          message: "Login Successful!",
          email,
          vendors
        });
      }
    }
  });
})


module.exports = router;


