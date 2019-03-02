const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const nodemailer = require('nodemailer');
// let transporter = nodemailer.createTransport(transport[, defaults]);



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
    // ok so transaction id does not equal paymentID

    // buyer@buyer.com
    // "www.google.com/?paymentId=PAYID-LR5AQFQ0YN32001HC067310S&token=EC-7KS50256JG196743N&PayerID=LBVNHUDLVK75E"

    let date = admin.firestore.Timestamp.now();
    let orderData = {
      paymentID: paymentID,
      payerID: payerID,
      items: items,
      totalPrice: totalPrice,
      vid: vid,  // TODO vendor list
      user: user,
      date: date,
      paid: true,  // if done through paypal express checkout, then paid
      pickedUp: false,
      firstName: doc.data().name.firstName,
      lastName: doc.data().name.lastName
    };

    // TODO: have diff route if clubs want to do cash pickup

    // write to user order history
    userRef.collection('orders').add(orderData)
    .then(orderDoc => {
      doc.update({oid: orderDoc.id});

      // set in vendor orders 
      // TODO multiple vendors
      db.collection('vendors').doc(vid).collection('orders').doc(orderDoc.id).set(orderData);

      // write to orders root collection
      db.collection('orders').doc(orderDoc.id).set(orderData);

    })
    .catch(err => {
      console.log('Error in adding new order:', err);
      return res.status(200).json({
        success: false,
        message: 'Error in adding new order: ' + err
      });
    });


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


/**
 * GET vendor's order history
 * 
 * @param vid - vendor vid
 */
router.get('/getVendorOrders', (req, res) => {
  if (req.query.params) {
    var vid = req.query.params.vid;
  }
  else {
    var vid = req.query.vid
  }

  if (!vid) {
    console.log('Error: missing request params in GET orders route.');
    return res.status(200).json({
      success: false,
      message: 'Error: missing request params in GET orders route.'
    });
  }

  // check to make sure given vid exists
  let vendorsRef = db.collection('vendors').doc(vid);
  vendorsRef.get().then(vendorDoc => {
    if (!vendorDoc.exists) {
      console.log('Error: provided vendor does not exist:', vid);
      return res.status(200).json({
        sucess: false,
        message: 'Error: provided vid does not exist: ' + vid
      });
    }

    // now get vendor orders
    let orders = [];

    vendorsRef.collection('orders').orderBy('date', 'desc').get().then(snapshot => {
        snapshot.forEach(doc => {
          let orderData = {
            // have to call toDate on firestore data or else errors
            date: doc.data().date.toDate(),
            items: doc.data().items,
            totalPrice: doc.data().totalPrice,
            paid: doc.data().paid,
            user: doc.data().user,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName
          };

          // NOTE: chosen not to send payment id and payer id

          // TODO, transaction ID
          // might be too much of a pain not to use the library

          orders.push(orderData);
        });

        console.log('Successfully retrieved vendor order history.');
        return res.status(200).json({
          success: true,
          message: 'Successfully retrieved vendor order history.',
          orders: orders
        });
    })
    .catch(err => {  // catch for vendor orders get
      console.log('Server error in retrieving vendor orders:', err);
      return res.status(200).json({
        sucess: false,
        message: 'Server error in retrieving vendor orders: ' + err
      });
    });

  })
  .catch(err => {   // catch for vendor get
    console.log('Server error in retrieving user:', err);
    return res.status(200).json({
      sucess: false,
      message: 'Server error in retrieving user: ' + err
    });
  });
});

/**
 * Let admin for vendor update orders when picked up.
 * 
 * @param vid - vendor id
 * @param user - vendor admin
 * @param orderID - firestore document order ID
 */

 router.patch('/updateOrder', (req, res) => {

 });


module.exports = router;