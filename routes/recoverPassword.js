const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const Email = require('email-templates');
const async = require('async');
const saltRounds = 10;

//route to indicate a password needs to be changed
//references: 
// http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/ and Thomas's code in orders.js
// https://blog.cloudboost.io/execute-asynchronous-tasks-in-series-942b74697f9c
// https://nodemailer.com/smtp/

//params: 
//email - email of user whose password wants to be changed
//password - new password text value to be hashed
//confirm password - confirming same password was typed
router.patch('/', (req, res) => {
  var email = "";
  var password = "";
  var confirmPassword = "";
  var host = req.headers.host;

  //extract email, password, and confirmed password from request
  if(req.body.params){
    email = req.body.params.email;
    password = req.body.params.password;
    confirmPassword = req.body.params.confirmPassword;
  }

  else{
    email = req.body.email;
    password = req.body.password;
    confirmPassword = req.body.confirmPassword;
  }

  //search firebase database for matching email
  const userRef = db.collection('users').doc(email);
  userRef.get().then(doc => {
    if(!doc.exists){
      return res.status(200).json({
        success: false,
        message: 'No such account for given email: ' + email
      });
    }

    //if the email was found, need to send an email to user to verify new password
    else{
      //reset password
      //async.waterfall, array of functions to execute in order
      //first function is to hash new password
      //second function is to email user to verify hashed password
      async.waterfall([
        function(callback){
          //hash new password with bcrypt
          bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => {
              if (err) {
                return callback(error);
              }
              console.log("new password hashed successfully");
              //this function is complete, move onto next function in waterfall array of functions
              return callback(null, hash);
            }) //end of hash
          })  // end bcrypt.genSalt
        },
        function(hash, callback){
          //email configuration
          console.log("in email sending function, checking param", hash);

          //using nodemailer to send basic email

          //email configurations for sending password
          const emailConfig = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            auth: {
              user: 'ecs193.ecommerce@gmail.com',
              pass: '193ecommerce'
            },
            tls: {
              rejectUnauthorized: false
            }
          });

          //contact options include sender/receiver, subject, and text containing link to verify password
          //using query params in url to store email and new hashed password of user
          //when user clinks URL, redirects them to /api/setNewPassword/params route to update firestore database
          const contactOptions = {
            from: 'ecs193.ecommerce@gmail.com',
            to: email,
            subject: 'Password Recovery',
            text: 'You have requested to reset/recover your password. Please click the following link to confirm password:' + 'http://' + host + '/api/setNewPassword/?'+ 'email=' + email + '&hash=' + hash
          }

          //send email to user with link to verify password change
          emailConfig.sendMail(contactOptions, function(err, res){
            if(err){
              console.log("error occurred ", err);
              return res.status(200).json({
                success: false,
                message: "Error sending email"
              })
            }

            else{
              console.log("email sent!");
              return res.status(200).json({
                success: true,
                message: "Password recovery email sent! Click link in email to confirm password change!"
              });
            }
          });
        }
      ], function(err, result){
        if(err){
          console.log("error", err);
        }
        else{
          console.log("result", result);
          return res.status(200).json({
            success: true,
            message: "Password recovery email sent! Click link in email to confirm password change!"
          });
        }
      }); //end of async waterfall
    }
  })
})

module.exports = router;
