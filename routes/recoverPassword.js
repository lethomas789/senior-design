const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');

//get request to indicate a password needs to be changed
router.get('/', (req, res) => {
  var email = "";
  email = req.query.email;

  //search firebase database for matching email
  const userRef = db.collection('users').doc(email);

  userRef.get().then(doc => {
    if(!doc.exists){
      return res.status(200).json({
        success: false,
        message: 'No such account for given email: ' + email
      });
    }

    //if the email was found, need to send an email to user to 
    else{
      //extract password from user and send via email
      if(doc._fieldsProto.password === undefined){
        return res.status(200).json({
          success: false,
          message: "No password for gmail account " + email,
        });
      }

      else{
        var extractedPassword = doc._fieldsProto.password.stringValue;
        if(extractedPassword != undefined){
          return res.status(200).json({
            success: true,
            message: "Password recovered for: " + email,
            password: extractedPassword
          });
        }
      }
    }
  })

})

module.exports = router;
