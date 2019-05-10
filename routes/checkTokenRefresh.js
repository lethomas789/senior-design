const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const jwt = require('jsonwebtoken');
require("dotenv").config();

router.get('/', (req, res) => {
  if(req.query.params){
    var token = req.query.params.token;
  }
  else{
    var token = req.query.token;
  }

  //verify token, access email by extracting from payload
  if(token){
    jwt.verify(token, process.env.JWT_SECRET,  (err, payload) => {
      if(err){
        return res.status(200).json({
          success: false,
          message: "Error with token, need to refresh"
        })
      }

      //if token check successful, extract email from payload 
      else{
        return res.status(200).json({
          success: true,
          message: "Token still valid"
        })
      }
    })
  }

  else{
    return res.status(200).json({
      success: true,
      message: "No token user not logged in"
    })
  }
})

module.exports = router;