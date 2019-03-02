const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();


router.post('/', (req, res) => {
  if (req.body.params) {
    var items = req.body.params.items;
    var totalPrice = req.body.params.totalPrice;
    var vendor = req.body.params.vendor;  
    var user = req.body.params.user;

  }
  else {

  }

  // TODO: figure out how we want to structure multiple vendors in an order.

});

module.export = router;