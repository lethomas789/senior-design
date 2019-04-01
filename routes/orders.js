const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const nodemailer = require('nodemailer');
const Email = require('email-templates');

/**
 * Creates a new order when a user checksout a purchase. Saves order to orders
 * collection, vendor orders, and user's order history.
 * 
 * NOTE: paypal payment objects save numbers as strings. Thus, for ease and
 * also for html email formatting, numbers will be saved as strings in the
 * orders collection.
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
    var {
      items,
      totalPrice,
      vid,
      user,
      paymentID,
      payerID
    } = req.body.params;
  }
  else {
    var {
      items,
      totalPrice,
      vid,
      user,
      paymentID,
      payerID
    } = req.body;
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
  
  const userRef = db.collection('users').doc(user);
  userRef.get().then(doc => {
    if (!doc.exists) {
      console.log('Error: provided user does not exist:', user);
      return res.status(200).json({
        sucess: false,
        message: 'Error: provided user does not exist: ' + user
      });
    }

    // TODO save vendorName, pickup time, pickup location, etc.
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
      email: doc.data().email,
      seenByVendor: false  // init as false, for cron emailing purposes
    };

    // TODO: have diff route if clubs want to do cash pickup


    let ordersRef = db.collection('orders');

    // write to user order history
    ordersRef.add(orderData)
    .then(orderDoc => {
      var oid = orderDoc.id;
      orderDoc.update({oid: oid});

      // TODO send emails

      let firstName = doc.data().name.firstName;
      let lastName = doc.data().name.lastName;

      let newItems = [];

      // convert paypal items numbers from strings to numbers to do calculations
      for (let i = 0; i < items.length; ++i) {
        let newItem = {
          name: items[i].name,
          price: Number(items[i].price).toFixed(2),
          quantity: Number(items[i].quantity),
          totalPrice: (Number(items[i].price) * Number(items[i].quantity)).toFixed(2)
        }

        newItems.push(newItem);
      }

      let emailSubject = 'ECS193 E-commerce Order Recipt: ' + oid;
      let emailIntro = 'Hi ' + firstName + ' ' + lastName + ', here is an order receipt for you to show the club when you pick up your order.'

      const testEmail = new Email({
        message: {
          from: 'ecs193.ecommerce@gmail.com',
          // from: 'test@test.com',
          subject: emailSubject,
          to: doc.data().email
        },
        send: true,  // set send to true when not testing
        // preview: false,  // TODO turn off preview before production

        transport: {
         // host: 'localhost', // TODO update w/ website?
          port: 465,
          secure: true,  
          tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
          },
          
          // uncomment when actually sending emails
          service: 'gmail',
          auth: {
            user: 'ecs193.ecommerce@gmail.com',
            pass: '193ecommerce'
          }
        
        }
      });

      testEmail.send({
        template: 'receipt',
        locals: {
          items: newItems,
          totalPrice: totalPrice,
          location: 'Test club location here.', 
          emailIntro: emailIntro,
          oid: oid
        }
      })
      .then(() => {
        console.log('Finished Sending Email.');
      })
      .catch(console.log);


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
    console.log('Server error in retrieving vendor:', err);
    return res.status(200).json({
      sucess: false,
      message: 'Server error in retrieving vendor: ' + err
    });
  });
});

/**
 * GET order history of given user.
 * 
 * @param user - email for user
 */
router.get('/getUserOrders', (req, res) => {
  if (req.query.params) {
    var user = req.query.params.user;
  }
  else {
    var user = req.query.user;
  }

  if (!user) {
    console.log('Error: missing request params in GET orders route.');
    return res.status(200).json({
      success: false,
      message: 'Error: missing request params in GET orders route.'
    });
  }

  // check to make sure given vid exists
  let userRef = db.collection('users').doc(user);
  userRef.get().then(userDoc => {
    if (!userDoc.exists) {
      console.log('Error: provided vendor does not exist:', user);
      return res.status(200).json({
        sucess: false,
        message: 'Error: provided vid does not exist: ' + user 
      });
    }

    // now get vendor orders
    let orders = [];

    let ordersRef = db.collection('orders');

    // TODO, do an array contains for multiple vendors?

    // get all orders with user, ordered by date
    ordersRef.where('email', '==', user).orderBy('date').get().then(snapshot => {
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

        orders.push(orderData);
      });

      console.log('Successfully retrieved user order history.');
      return res.status(200).json({
        success: true,
        message: 'Successfully retrieved user order history.',
        orders: orders
      });
    })
    .catch(err => {  // catch for user orders get
      console.log('Server error in retrieving user orders:', err);
      return res.status(200).json({
        sucess: false,
        message: 'Server error in retrieving user orders: ' + err
      });
    });

  })
  .catch(err => {   // catch for user get
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
  db.collection('vendors').get().then(snapshot => {
    snapshot.forEach(vdoc => {
      db.collection('orders').where('vid', '==', vdoc.id)
        .where('seenByVendor', '==', false)
        .orderBy('date', 'asc')
        .get().then(ordersSnapshot => {
          let orders = [];
          let orderCount = 0;
          ordersSnapshot.forEach(odoc => {
            odoc.update({ seenByVendor: true });

            /*
            let orderData = {
              // have to call toDate on firestore data or else errors
              date: odoc.data().date.toDate(),
              items: odoc.data().items,
              totalPrice: odoc.data().totalPrice,
              paid: odoc.data().paid,
              firstName: odoc.data().name.firstName,
              lastName: odoc.data().name.lastName,
              oid: odoc.data().oid,
              pickedUp: odoc.data().pickedUp,
              email: odoc.data().email
            };
            orders.push(orderData);
            */

            // NOTE: for our own sanity, we are just gonna send a count of items
            // and a link to order history page.
            orderCount += 1;
          });

          // once obtained the orders
          let emailSubject = "You've got new orders from ECS193 E-commerce"

          const vendorEmail = new Email({
            message: {
              // from: 'ecs193.ecommerce@gmail.com',
              from: 'test@test.com',
              subject: emailSubject,
              to: 'test@test.com'
            },
            send: false,  // set send to true when not testing
            // preview: false,  // TODO turn off preview before production

            transport: {
              host: 'localhost', // TODO update w/ website?
              port: 465,
              secure: true,
              tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
              },
              /*
              // uncomment when actually sending emails
              service: 'gmail',
              auth: {
                user: 'ecs193.ecommerce@gmail.com',
                pass: '193ecommerce'
              }
              */
            }
          });

          // let emailIntro = 'Hi ' + firstName + ' ' + lastName + ', here is an order receipt for you to show the club when you pick up your order.'
          let emailIntro = 'Hello, you have ' + orderCount + ' new orders. Please go to your admin order history page to see more details.'

          vendorEmail.send({
            template: 'ordersNotification',
            locals: {
              emailIntro: emailIntro,
            }
          })
            .then(() => {
              console.log('Finished Sending Email.');
            })
            .catch(console.log);

        })
        .catch(err => {
          console.log('Error in getting user orders for emailing:', err);
        });

    });  // end forEach vendor

  })
    .catch(err => {
      console.log('Server error in getting vendors for emailing:', err);
    });
  return res.sendStatus(200);

});


module.exports = router;