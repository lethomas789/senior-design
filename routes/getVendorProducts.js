const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/', (req,res) => {
  if (req.query.params) {
    var vendor = req.query.params.vendor;
  }
  else {
    var vendor = req.query.vendor;
  }

  // can do db.doc('collection/pathToDoc');

  // require certain response params
  if (!vendor) {
    return res.status(200).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  // get vendor path
  var vendorRef = db.collection('vendors').doc(vendor);

  vendorRef.get()
    .then(doc => {
      // no such vendor 
      if (!doc.exists) {
        // console.log('No such vendor: ', vendor);
        return res.status(200).json({
          success: false,
          message: 'No such vendor'
        });
      }
      // else get vendor products
      let productsRef = vendorRef.collection('products');
      let products = [];
      productsRef.get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            // push all product info into products array
            products.push(doc.data());
          });
          // send back products info
          return res.status(200).json({
            success: true,
            data: products
          });
        })
        .catch(err => {  // catch for productsRef.get()
          console.log('Error in getting vendor products:', err);
          return res.status(200).json({
            succes: false,
            message: 'Error in getting vendor products'
          });
        })  // end productsRef.get() 
    })
    .catch(err => {  // catch for vendorRef.get()
      console.log('Error getting vendor info:', err);
      return res.status(200).json({
        succes: false,
        message: 'Error in getting vendor info'
      });
    });  // end vendorRef.get()
})


module.exports = router;
