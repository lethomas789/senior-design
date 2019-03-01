const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();

/**
 * GET on all vendor info. No params.
 * 
 * @returns array of vendor document data
 */
router.get('/', (req, res) => {

  let vendorsRef = db.collection('vendors');

  vendorsRef.get().then(snapshot => {
    let vendors = [];

    // NOTE: will send all data; the date will not be converted here.
    snapshot.forEach(doc => {
      let vendorData = {
        bio: doc.data().bio,
        vendorName: doc.data().vendorName,
        vid: doc.data().vid
      };
      vendors.push(vendorData);
    });
    console.log('Successfully retrieved all vendor info.');
    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved all vendor info.',
      vendors: vendors
    });
  })
  .catch(err => {
    console.log('Error in getting vendorsRef:', err);
    return res.status(200).json({
      success: false,
      message: 'Erro in getting vendorsRef: ' + err
    });
  });

});


module.exports = router;