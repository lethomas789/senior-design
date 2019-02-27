const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
// const multer = require('multer');  // for multipart bodies e.g. formdata


/**
 * Route adds a new admin user for given vendor
 * 
 * @params vid - vendor ID
 * @params user - username of user we are trying to make an admin
 * @params adminCode - adminCode associated with vendor
 */
router.post('/addAdminUser', (req, res) => {
  if (req.body.params) {
    var vid = req.body.params.vid;
    var user = req.body.params.user;
    var adminCode = req.body.params.adminCode;
  }
  else {
    var vid = req.body.vid;
    var user = req.body.user;
    var adminCode = req.body.adminCode;
  }

  /*
   * 1. do param checking
   * 2. check vendor code to make sure it matches vendor
   * 3. add to admins list in vendor
   */

  if (!vid || !user || !adminCode) {
    console.log('Error in addAdminUser: missing required request paramters');
    return res.status(400).json({
      success: false,
      message: 'Error in addAdminUser: missing required request paramters'
    });
  }

  // let vendorRef = db.collection('vendors');
  let vendorRef = db.collection('vendors').doc(vid);

  vendorRef.get().then(doc => {
    if (!doc.exists) {
      console.log('Error: no such vendor for given vid:', vid);
      return res.status(400).json({
        success: false,
        message: 'Error: no such vendor for given vid: '+ vid
      });
    }

    vendorRef.collection('adminCode').doc('adminCode').get().then(doc => {
      // check to see if their admin code matches submitted admin code
      if (doc.data().adminCode !== adminCode) {
        console.log('Error: submitted adminCode does not match vendor adminCode');
        return res.status(400).json({
          success: false,
          message: 'Error: submitted adminCode does not match vendor adminCode'
        });
      }

      // else matches, proceed to making user an admin under vendor
      // NOTE: we store admins under a subcollection for security purposes, so
      // the adminList doesnt get pulled anytime you want to pull vendor data

      let adminsRef = db.collection('vendors').doc(vid).collection('admins');

      // create a new admin doc
      adminsRef.doc(user).set({
        email: user
      });

      // now set that user's isAdmin flag to be true
      db.collection('users').doc(user).update({isAdmin: true});

      // now add them to admins root collection
      // NOTE: we merge b/c a user can be admin of more than one club
      db.collection('admins').doc(user).set({
        email: user
      }, {merge: true});

      // b/c arrays work differently, update array of vendors here
      db.collection('admins').doc(user).update({
        vendors: admin.firestore.FieldValue.arrayUnion(vid)
      });

      console.log('Made new admin:', user);
      console.log('Added new vendor for vid:', vid);
      return res.status(200).json({
        success: true,
        message: 'Succesfully added new admin.'
      });
    })
    .catch(err => {  // catch for getAdminCodeRef
      console.log('Error in getting adminCodeRef:', err); 
      return res.status(500).json({
        success: false,
        message: 'Error in getting adminCodeRef: ' + err
      });
    });

  })
  .catch(err => {  // catch for vendorRef
    console.log('Error in getting vendorRef', err);
    return res.status(500).json({
      success: false,
      message: 'Error in getting vendorRef: ' + err
    });
  });
});

/**
 * Route returns 
 * 
 * @param user - user whose isAdmin flag true, and want to retrieve their club
 *
 * @returns: vendors - array of vid(s) for the vendor(s) user is admin of
 */
router.get('/getAdminVendor', (req, res) => {
  if (req.body.params) {
    var user = req.query.params.user;
  }
  else {
    var user = req.query.user;
  }

  if (!user) {
    console.log('Error in getAdminVendor: missing required request paramters');
    return res.status(400).json({
      success: false,
      message: 'Error in getAdminVendor: missing required request paramters'
    });
  }

  db.collection('admins').doc(user).get().then(doc => {
    if (!doc.exists) {
      console.log('Error: user is not admin.')
      return res.status(400).json({
        success: false,
        message: 'Error: user is not admin.'
      });
    }

    // else, return the vid's of whom they are admins of
    console.log('Got admin info for provided user:', user);
    return res.status(200).json({
      success: true,
      message: 'Got admin info for provided user.',
      vendors: doc.data().vendors
    });

  })
  .catch(err => {
    console.log('Error in getting userRef', err);
    return res.status(500).json({
      success: false,
      message: 'Error in getting userRef: ' + err
    });
  });
});

router.post('/editVendorInfo', (req, res) => {
  if (req.body.params) {


  }
  else {

  }

});


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

});

module.exports = router;