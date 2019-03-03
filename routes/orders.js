const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
const Email = require('email-templates');

// let transporter = nodemailer.createTransport(transport[, defaults]);



/**
 * Creates a new order when a user checksout a purchase. Saves order to orders
 * collection, vendor orders, and user's order history.
 * 
 * @param items - array of purchased items in paypal API format
 * @param totalPrice - total price of all items
 * @param vid - vendor id - TODO multiple vendors
 * @param user - email of user
 * @param paymentID - paymentID from paypal API
 * @param payerID - payerID from paypal API
 */
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
   * 2. Send emails
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
      date: date,
      paid: true,  // if done through paypal express checkout, then paid
      pickedUp: false,
      name: doc.data().name,
      email: doc.data().email
    };

    // TODO: have diff route if clubs want to do cash pickup


    let ordersRef = db.collection('orders');

    // write to user order history
    ordersRef.add(orderData)
    .then(orderDoc => {
      var oid = orderDoc.id;
      orderDoc.update({oid: oid});

      // TODO send emails


      console.log('Finished saving new order:', oid);
      return res.status(200).json({
        success: true,
        message: 'Successfully saved new order: ' + oid
      });
    })
    .catch(err => {  // catch for ordersRef
      console.log('Error in adding new order:', err);
      return res.status(200).json({
        success: false,
        message: 'Error in adding new order: ' + err
      });
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

    let ordersRef = db.collection('orders');

    // TODO, do an array contains for multiple vendors?

    // get all orders with vid, ordered by date
    ordersRef.where('vid', '==', vid).orderBy('date').get().then(snapshot => {
      snapshot.forEach(doc => {
        let orderData = {
          // have to call toDate on firestore data or else errors
          date: doc.data().date.toDate(),
          items: doc.data().items,
          totalPrice: doc.data().totalPrice,
          paid: doc.data().paid,
          firstName: doc.data().name.firstName,
          lastName: doc.data().name.lastName,
          oid: doc.data().oid,
          pickedUp: doc.data().pickedUp,
          email: doc.data().email
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
 * @param oid - firestore document order ID
 */
 router.patch('/updateOrder', (req, res) => {
   if (req.body.params) {
     var vid = req.body.params.vid;
     var user = req.body.params.user;
     var oid = req.body.params.oid;
   }
   else {
     var vid = req.body.vid;
     var user = req.body.user;
     var oid = req.body.oid;
   }

   if (!vid || !user || !oid) {
     console.log('Error: missing request params in update orders route.');
     return res.status(200).json({
       success: false,
       message: 'Error: missing request params in update orders route.'
     });
   }

   let orderRef = db.collection('orders').doc(oid);
   orderRef.get().then(doc => {
     if (!doc.exists) {
       console.log('Error: provided oid does not exist:', oid);
       return res.status(200).json({
         sucess: false,
         message: 'Server Error: provided order does not exist: ' + oid
       });
     }

     let lastUpdate = admin.firestore.Timestamp.now();

     // TODO, do error checking and mark who updates later

     // update order, flip pickedUp bool from false -> true or true -> false
     orderRef.update({
       pickedUp: !doc.data().pickedUp,
       lastUpdate: lastUpdate
      });

     console.log('Successfully updated order.');
     return res.status(200).json({
       success: true,
       message: 'Successfully updated order.'
     });
   })
   .catch(err => {
     console.log('Error: could not get order ref in DB', err);
     return res.status(200).json({
       success: false,
       message: 'Server error in getting order ' + err
     });
   });


 });

router.get('/testEmail', (req, res) => {
  // Generate SMTP service account from ethereal.email
  let transport = nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
    }

    // console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });

    // Message object
    /*
    let message = {
      from: 'Sender Name <sender@example.com>',
      to: 'Recipient <recipient@example.com>',
      subject: 'Nodemailer is unicode friendly ✔',
      text: 'Hello to myself!',
      html: '<p><b>Hello</b> to myself!</p>'
    };
    */

    /*
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
    */
  });

  const testEmail = new Email({
    message: {
      from: 'test@test.com',
      subject: 'Test Subject',
      to: 'test@test.com'
    },
    send: false,
    // transport: transport
    transport: {
      jsonTransport: true
    }
  });

  testEmail.send({
    template: 'receipt',
    locals: {
      location: 'Test club location here.'
    }
  })
  .then(() => {
    console.log('Finished Sending Email.');
  })
  .catch(console.error);


  return res.sendStatus(200);

});


module.exports = router;