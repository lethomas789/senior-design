const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();


router.post('/addNewProduct', (req, res) => {
  if (req.body.params){ 
    var vendor = req.body.params.vendor;
    var user = req.body.params.user;
    var productInfo = req.body.params.productInfo;
    var productName = req.body.params.productName;
    // TODO figure out how to add many pictures
    // var productPicture = req.body.params.productPicture;
    var productPrice = req.body.params.productPrice;
    var stock = req.body.params.stock;
  }
  else {
    var vendor = req.body.vendor;
    var user = req.body.user;
    var productInfo = req.body.productInfo;
    var productName = req.body.productName;
    // TODO figure out how to add many pictures
    // var productPicture = req.body.productPicture;
    var productPrice = req.body.productPrice;
    var stock = req.body.stock;
  }

  /*
   * 1. do various param checking
   * 2. check if user is admin in vendor info
   * 3. add product to products root colletion
   * 4. add product to vendors/products
   *
   */
});  // END POST /addNewProduct


module.exports = router;
