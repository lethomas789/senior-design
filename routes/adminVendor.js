const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();


/**
 * GET returns vendor about info for frontend.
 * 
 * @param user - admin getting info
 * @param vid - vid must be sent to obtain vendor DB info
 * 
 * @returns Vendor about page info.
 */
router.get('/', (req, res) => {
  if (req.body.params) {
    var user = req.query.params.user;
    var vid = req.query.params.vid;
  }
  else {
    var user = req.query.user;
    var vid = req.query.vid;
  }

  if (!user || !vid) {
    console.log('Error: missing params for GET adminVendor.');
    return res.status(400).json({
      success: false,
      message: 'Error: missing params for GET adminVendor.'
    });
  }

  let vendorRef = db.collection('vendors').doc(vid);

  vendorRef.get().then(doc => {
    if (!doc.exists) {
      console.log('Error: no such vendor for given vid.');
      return res.status(400).json({
        success: false,
        message: 'Error: no such vendor for given vid. '
      });
    }

    let vendorData = doc.data();

    // check to make sure user is admin for security purposes
    vendorRef.collection('admins').doc(user).get().then(doc => {
      if (!doc.exists) {
        console.log('Error: provided user is not an admin for given vendor.');
        return res.status(400).json({
          success: false,
          messaage: 'Error: provided user is not an admin for given vendor.'
        });
      }

      // else good to send back data

      console.log('Succesfully retrieved vendor info.');
      console.log('Vendor:', vendorData.vendorName);
      console.log('User:', user);
      return res.status(200).json({
        success: true,
        bio: vendorData.bio,
        lastUpdate: vendorData.lastUpdate.toDate(),
        lastUpdateUser: vendorData.lastUpdateUser,
        vendorName: vendorData.vendorName
      });
    })
    .catch(err => {  // catch for admins ref
      console.log('Error in getting adminRef:', err);
      return res.status(500).json({
        success: false,
        message: 'Error in getting adminRef: ' + err
      });
    });

  })
  .catch(err => {   // catch for vendorRef.get
    console.log('Error in getting vendorRef:', err);
    return res.status(500).json({
      success: false,
      message: 'Error in getting vendorRef: ' + err
    });
  });
});  // END GET /


/**
 * For params, assume that when an admin goes to the edit page, frontend does a
 * GET on the vendor's old info. Even if the admin makes only one change, this
 * route expects old and new data sent for ease of update purposes.
 * 
 * @param user - admin editing; assumed to have passed admin check already
 * @param vid - vid must be sent from frontend to obtain vendor DB info
 * @param bio - vendor description
 * @param vendorName - if user wants to change vendorName
 * 
 * @returns res success true or false
 */
router.patch('/editVendorInfo', (req, res) => {

  if (req.body.params) {
    var user = req.body.params.user;
    var vid = req.body.params.vid;
    var vendorName = req.body.params.vendorName;
    var bio = req.body.params.bio;
  }
  else {
    var user = req.body.user;
    var vid = req.body.vid;
    var vendorName = req.body.vendorName;
    var bio = req.body.bio;
  }

  // must include editing user and vid; bio and vendorName not always edited
  if (!user || !vendorName || !bio || !vid) {
    console.log('Error: missing params for editVendorInfo.');
    return res.status(400).json({
      success: false,
      message: 'Error: missing params for editVendorInfo.'
    });
  }

  // assume image done through frontend

  let vendorRef = db.collection('vendors').doc(vid);
  
  vendorRef.get().then(doc => {
    if (!doc.exists) {
      console.log('Error: no such vendor for given vid.');
      return res.status(400).json({
        success: false,
        message: 'Error: no such vendor for given vid.'
      });
    }

    // check to make sure user is admin for security purposes
    vendorRef.collection('admins').doc(user).get().then(doc => {
      if (!doc.exists) {
        console.log('Error: provided user is not an admin for given vendor.');
        return res.status(400).json({
          success: false,
          messaage: 'Error: provided user is not an admin for given vendor.'
        });
      }

      // else, good to update

      let lastUpdate = admin.firestore.Timestamp.now();
      let lastUpdateUser = user;  // user who did most recent update

      // else vendor exists, write new data
      vendorRef.update({
        vendorName: vendorName,
        bio: bio,
        lastUpdate: lastUpdate,
        lastUpdateUser: lastUpdateUser
      });

      console.log('Succesfully updated vendor info.');
      console.log('Vendor:', vendorName);
      console.log('User:', user);

      return res.status(200).json({
        success: true,
        message: 'Succesfully updated vendor info for: ' + vendorName
      });

    })
    .catch(err => {  // catch for admins ref
      console.log('Error in getting adminRef:', err);
      return res.status(500).json({
        success: false,
        message: 'Error in getting adminRef: ' + err
      });
    });
  })
  .catch(err => {   // catch for vendorRef.get
    console.log('Error in getting vendorRef:', err);
    return res.status(500).json({
      success: false,
      message: 'Error in getting vendorRef: ' + err
    });
  });
});  // END PATCH /editVendorInfo

module.exports = router;