const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/', (req,res) => {
  if (req.query.params) {
    var vid = req.query.params.vid;
  }
  else {
    var vid = req.query.vid;
  }

  // can do db.doc('collection/pathToDoc');

  // require certain response params
  if (!vid) {
    return res.status(200).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  // get all products where vid == vendor 
  db.collection('products').where('vid', '==', vid).get().then(snapshot => {
    let products = [];
    snapshot.forEach(doc => {
      products.push(doc.data());
    });

    console.log('Succesfully retrieved vendor products.');
    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved vendor products.',
      data: products
    });
  })
  .catch(err => {
    console.log('Server error in getting vendor products:', err);
    return res.status(200).json({
      success: false,
      message: 'Server error in getting vendor products: ' + err
    });
  });
})


module.exports = router;
