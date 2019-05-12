const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const jwt = require('jsonwebtoken');
require("dotenv").config();

router.get('/', tokenMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token still valid"
  })
})

module.exports = router;