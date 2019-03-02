const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();


router.post('/', (req, res) => {
  if (req.body.params) {
    var items = req.body.params.items;
    var totalPrice = req.body.params.totalPrice;
    var vid = req.body.params.vid;  
    var user = req.body.params.user;
    var paymentID = req.body.params.paymentID;
    var payerID = req.body.params.payerID;
  }
  else {
    var items = req.body.items;
    var totalPrice = req.body.totalPrice;
    var vid = req.body.vid;  
    var user = req.body.user;
    var paymentID = req.body.paymentID;
    var payerID = req.body.payerID;
  }

  // TODO: figure out how we want to structure multiple vendors in an order.
  // TODO: test if paymentID is transaction ID in paypal

  /**
   * 1. Write to orders root collection.
   * 2. Write to user's orders. 
   * 3. Write to vendor's orders.
   */

   if (!items || !totalPrice || !vid || !user || !paymentID || !payerID) {
     console.log('Error: missing request params in orders route.');
     return res.status(200).json({
        success: false,
        message: 'Error: missing request params in orders route.'
     });
   }
  
  var userRef = db.collection('users').doc(user);
  userRef.get().then(doc => {
    if (!doc.exists) {
      console.log('Error: provided user does not exist:', user);
      return res.status(200).json({
        sucess: false,
        message: 'Error: provided user does not exist: ' + user
      });
    }

    // 7:44 test paymentID = transactionID
    // paymentID = LR47X3Y9CA5706187855000T

    let date = admin.firestore.Timestamp.now();
    let orderData = {
      paymentID: paymentID,
      payerID: payerID,
      items: items,
      totalPrice: totalPrice,
      vid: vid,  // TODO vendor list
      user: user,
      date: date,
      paid: true  // if done through paypal express checkout, then paid
    };

    // TODO: have diff route if clubs want to do cash pickup

    // write to user order history
    userRef.collection('orders').doc(paymentID).set(orderData);

    // set in vendor orders 
    // TODO multiple vendors
    db.collection('vendors').doc(vid).collection('orders').doc(paymentID).set(orderData);

    // write to orders root collection
    db.collection('orders').doc(paymentID).set(orderData);

    // TODO send emails

    console.log('Finished saving new order:', paymentID);
    return res.status(200).json({
      success: true,
      message: 'Successfully saved new order: ' + paymentID
    });
  })
  .catch(err => {  // catch for userRef get
    console.log('Server error in retrieving user:', err);
    return res.status(200).json({
      sucess: false,
      message: 'Server error in retrieving user: ' + err
    });
  });

});


module.exports = router;