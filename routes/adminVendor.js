const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const jwtKey = require('../config/jwt.json');
const {Storage} = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'ecs193-ecommerce',
});

storage
  .createBucket(bucketName)
  .then(() => {

  })
  .catch(err => {
    console.log('ERROR:', err);

  });

const bucketName = 'testBucket';

router.post('/addAdminUser', (req, res) => {
  if (req.body.params) {
    var vendor = req.body.params.vendor;
    var user = req.body.params.user;
  }
  else {
    var vendor = req.body.vendor;
    var user = req.body.user;
  }

  /*
   * 1. do param checking
   * 2. check vendor code to make sure it matches vendor
   * 3. add to admins list in vendor
   * 4. set their user account isAdmin to true
   *
   */
});

router.post('/addNewProduct', (req, res) => {
  if (req.body.params){ 
    var vendor = req.body.params.vendor;
    var user = req.body.params.user;
    var productInfo = req.body.params.productInfo;
    var productName = req.body.params.productName;
    // TODO figure out how to add many pictures
    var productPicture = req.body.params.productPicture;
    var productPrice = req.body.params.productPrice;
    var stock = req.body.params.stock;
  }
  else {
    var vendor = req.body.vendor;
    var user = req.body.user;
    var productInfo = req.body.productInfo;
    var productName = req.body.productName;
    // TODO figure out how to add many pictures
    var productPicture = req.body.productPicture;
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
});

router.post('/testImages', (req, res) => {

});

module.exports = router;