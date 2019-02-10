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
  var userEmail = req.body.params.email;
  var userPassword = req.body.params.password;

  //if email is invalid
  if(validator.isEmail(userEmail) === false){
    return res.json({
      success:false,
      message: "Invalid Email"
    });
  }

  //if input fields were empty
  else if (userEmail.trim() === '' || userPassword.trim() === ''){
    return res.json({
      success:false,
      message: "Empty Inputs"
    });
  }

  //check to see if email exists
  else{
    var ref = db.collection('users').where('email', '==', userEmail);
    ref.get()
      .then(snapshot => {
        //needs to equal to 1
        //user with email was found
        if(snapshot.size === 1){
          snapshot.forEach(doc => {
            if(doc.data().email === userEmail){
              //compare passwords
              bcrypt.compare(userPassword, doc.data().password, (err, validPassword)=> {
                if(err){
                  return res.json({
                    success: false,
                    message: "Server error comparing passwords"
                  });
                }

                //if passwords match, send JWT to authenticate login
                if(validPassword){
                  //info that JWT stores
                  const payload = {email: userEmail};

                  jwt.sign(payload, jwtKey.JWTSecret, {expiresIn: 3600}, (err, token) => {
                    return res.status(200).json({
                      success: true,
                      message: "Login Successful!",
                      email: userEmail,
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


})

module.exports = router;


