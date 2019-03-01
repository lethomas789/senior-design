const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();

// paypal-rest-sdk library
var paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox',  // sandbox or live
  'client_id': 'AQRbJx9R02PGD4hvGRQlGL48Ri1mvf4c7qd6LzuNHqmbtothVDp-vI6K7qatzi3dgYcg4tkp5lpXHBye',
  'client_secret': 'EG0XG-x11vWd-an3PzTmwOMVad0XU3oGwtpZDRjlVGs9tjTQeYRs1WsWIwlPDBQT_VP5s8ScNWjGZajx'
});

// TODO move this into a file, and gitignore it

var payReq = {
  "intent": "sale",
  "payer": {
    "payment_method": "paypal"
  },
  "redirect_urls": {
    "return_url": "localhost:3000", // send back to localhosts
    "cancel_url": "localhost:3000/testPaypal"
  },
  "transactions": [{
    "item_list": {
      "items": [{
        "name": "item",
        "sku": "item",
        "price": "1.00",
        "currency": "USD",
        "quantity": 1
      }]
    },
    "amount": {
      "currency": "USD",
      "total": "0.01"
    },
    "description": "This is the payment description."
  }]
};

router.get('/testCreate', (req, res) => {

  paypal.payment.create(payReq, function(error, payment) {

    var links = {};

    if (error) {
      console.log(JSON.stringify(error));
    }
    else {
      payment.links.forEach(function (linkObj) {
        links[linkObj.rel] = {
          href: linkObj.href,
          method: linkObj.method
        };
      })

      // If the redirect URL is present, redirect the customer to that URL
      if (links.hasOwnProperty('approval_url')) {
        // Redirect the customer to links['approval_url'].href
        console.log('PAYPAL TEST FINISHED');
        console.log(payment);
        return res.status(200).json({
          success: true,
          link: links['approval_url'].href
        });
      }
      else {
        console.log('no redirect URL present');
        return res.status(400).json({
          success: false
        });
      }
    }
  });

});

/**
 * NOTE: once user accepts approval_url, the paymentID and payerID is appended
 * to the redirect URL
 */

router.get('/testExecute', (req, res) => {
  var paymentID = req.query.paymentID;
  var payerID = { payer_id: req.query.payerID };


  paypal.payment.execute(paymentID, payerID, function (error, payment) {
    if (error) {
      console.error(JSON.stringify(error));
    } else {
      if (payment.state == 'approved') {
        console.log('payment completed successfully');
        console.log(payment);
        res.status(200).json({success: true});
      } else {
        console.log('payment not successful');
        res.status(200).json({success: false});
      }
    }
  });
});



module.exports = router;