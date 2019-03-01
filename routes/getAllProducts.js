const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/', (req, res) => {
  let productsRef = db.collection('products');

  productsRef.get()
    .then(snapshot => {
      let products = [];
      snapshot.forEach(doc => {
        // push each product doc to array
        products.push(doc.data());
      });

      return res.status(200).json({
        success: true,
        data: products
      });
    })
    .catch(err => {
      console.log('Error in getting products:', err);
      res.status(200).json({
        success: false,
        message: 'Error in getting proudcts'
      });
    });
})

module.exports = router;
