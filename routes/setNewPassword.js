const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;

//query params:
//email - email of user whose password is to be updated
//password - plain text value of password
router.patch('/', (req,res) =>{
  //need to extract email and hashed password from URL
  var email = req.body.params.email;
  var password = req.body.params.password;
  var newPassword = '';

  //hash text value of password to database
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(password, salt, null, (err, hash) => {
      if (err) {
        return res.status(200).json({
          success: false,
          message: "Error hashing password"
        })
      }
      newPassword = hash;
      
      //hash new password
      //update user with new password in firestore database
      const userRef = db.collection('users').doc(email);

      //update matching doc's password to new password
      userRef.update({
        "password": newPassword
      })
      .then( () => {
        console.log("Password updated successfully!");
        return res.status(200).json({
          success: true,
          message: "Password updated successfully!"
        })
      })
      .catch(err => {
        console.log("error ", err);
        return res.status(200).json({
          success: false,
          message: "Password did not update"
        })
      })
    }) //end of hash
  });  // end bcrypt.genSalt
})

module.exports = router;
