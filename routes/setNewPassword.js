const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const validator = require('validator');

//query params:
//email - email of user whose password is to be updated
//hash - hashed value of original password, hashed valued updated/stored in database
router.get('/', (req,res) =>{
  //need to extract email and hashed password from URL
  var email = req.query.email;
  var newPassword = req.query.hash;

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
})

module.exports = router;
