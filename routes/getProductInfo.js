const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const nodemailer = require('nodemailer');
const Email = require('email-templates');

/**
 * GET a product's info. Main item page for users.
 * 
 * @param pid = product id
 */
router.get('/', (req, res) => {
  if (req.query.params) {
    var pid = req.query.params.pid;
  }
  else {
    var pid = req.query.pid
  }

  if (!pid) {
    console.log('Error: missing request params for getting product info.');
    return res.status(200).json({
      success: false,
      message: 'Error: missing request params for getting product info.'
    });
  }

  db.collection('products').doc(pid).get().then(doc => {
    if (!doc.exists) {
      console.log('No such product for given pid:', pid);
      return res.status(200).json({
        success: false,
        message: 'No such product for given pid: ' + pid
      });
    }

    // TODO product picture(s)

    // if the object is not an apparel
    if(doc.data().isApparel === false){
      var product = {
        productInfo,
        productName,
        productPicture,
        productPrice,
        productStock,
        isApparel,
        vid,
      } = doc.data();
    }

    // else it is an apparel
    else{
      var product = {
        productInfo,
        productName,
        productPicture,
        productPrice,
        productStock,
        isApparel,
        vid,
        s_stock,
        m_stock,
        l_stock,
        xs_stock,
        xl_stock,
      } = doc.data();
    }

    console.log('Successfully retrieved product info.')
    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved product info.',
      product: product
    });
  })
  .catch(err => {  // catch for products.get
    console.log('Server error in getting product info:', err);
    return res.status(200).json({
      success: false,
      message: 'Server error in getting product info: ' + err
    });
  });
});

module.exports = router;
