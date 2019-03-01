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
    var email = req.body.params.email;
    var password = req.body.params.password;
  }
  else {
    var email = req.body.email;
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

  let userRef = db.collection('users').doc(email);
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

            // console.log('Vendors are:', vendors);

            //info that JWT stores
            const payload = { email: email };

            jwt.sign(payload, jwtKey.JWTSecret, { expiresIn: 3600 }, (err, token) => {
              return res.status(200).json({
                success: true,
                message: "Login Successful!",
                token: 'Bearer ' + token,
                email: email,
                vendors: vendors
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
              email: email,
              token: 'Bearer ' + token,
              vendors: vendors
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


  /*
  //check to see if email exists
  else {
    var ref = db.collection('users').where('email', '==', email);
    ref.get()
      .then(snapshot => {
        //needs to equal to 1
        //user with email was found
        if(snapshot.size === 1){
          snapshot.forEach(doc => {
            if(doc.data().email === email){
              //compare passwords
              bcrypt.compare(password, doc.data().password, (err, validPassword)=> {
                if(err){
                  return res.json({
                    success: false,
                    message: "Server error comparing passwords"
                  });
                }

                //if passwords match, send JWT to authenticate login
                if(validPassword){
                  //info that JWT stores
                  const payload = {email: email};

                  jwt.sign(payload, jwtKey.JWTSecret, {expiresIn: 3600}, (err, token) => {
                    return res.status(200).json({
                      success: true,
                      message: "Login Successful!",
                      email: email,
                      token: 'Bearer ' + token
                    });
                  });
                }

                //if passwords don't match
                else{
                  return res.json({
                    success:false,
                    message: "Incorrect Password"
                  });
                }
              })
            }

            else{
              return res.json({
                success:false,
                message: "Invalid Email"
              });
            }
          })
        }

        else{
          return res.json({
            success:false,
            message: "Email does not exist, please make an account"
          });
        }
      })
  }
  */
})

module.exports = router;


