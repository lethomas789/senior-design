const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const multer = require('multer');  // for multipart bodies e.g. formdata
const upload = multer();
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// const XMLHttpRequest = require('xhr2');
/*
const storage = require('@google-cloud/storage');
const storageRef = storage.firebase.ref();
*/
const storagePackage = require('firebase/storage');
const storage = firebase.storage();
const storageRef = storage.ref();


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

var testUpload = upload.fields([
  { name: 'image', maxCount: 1}, 
]);
router.post('/testAddImages', testUpload, (req, res) => {
  console.log(req.body);
  console.log(req.files['image'][0].buffer);
  /*
  if (req.body.params) {
    var user = req.body.params.user;
    var image = req.body.params.image;
  }
  else {
    var user = req.body.params.user;
    var image = req.body.params.image;
  }

  if (!user || !image) {
    console.log('Invalid params for image upload');
    return res.status(400).json({
      success: false,
      message: 'Invalid parmas for image upload'
    });
  }

  var testImageRef = storageRef.child('testVendor/images/test.jpg');

  var file = image;

  testImageRef.put(file).then(snapshot => {
    console.log('Uploaded a blob or file to test images');
  });
  */

  return res.status(200).json({
    success: true,
    message: 'Testing'
  });
});

router.get('/testDownload', (req, res) => {
  console.log('why');
  var pathRef = storage.ref('testVendor/space-jordan1.png').getDownloadURL().then(url => {

    console.log(url);
    return res.status(200).json({
      success: true,
      message: 'Testing',
      data: url
    });
  })
  .catch(err => {
    console.log('download error');
    return res.status(500).json({
      success: false,
      message: 'god help me'
    });
  });

});


module.exports = router;
