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

  const vendorsRef = db.collection('vendors');

  vendorsRef.get().then(snapshot => {
    const vendors = [];

    // NOTE: will send all data; the date will not be converted here.
    snapshot.forEach(doc => {
      let vendorData = {
        bio,
        vendorName,
        vid,
        bioPictures
      } = doc.data();
      vendors.push(vendorData);
    });
    // console.log('Successfully retrieved all vendor info.');
    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved all vendor info.',
      vendors
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


router.get('/aboutClub', (req, res) => {
  if (req.query.params) {
    var { vid } = req.query.params;
  }
  else {
    var { vid } = req.query;
  }

  if (!vid) {
    console.log('Error, missing params for route.');
    return res.json({
      success: false,
      message: 'Missing params for vendor route.'
    });
  }

  const vendorRef = db.collection('vendors').doc(vid);

  vendorRef.get().then(doc => {
    if (!doc.exists) {
      console.log('No such vendor for given vid', vid);
      return res.json({
        success: false,
        message: "No such vendor for given vid: " + vid
      });
    }

    // console.log('Retrieved vendor about info');

    const { bio, vendorName, bioPictures} = doc.data();

    return res.json({
      success: true,
      message: "Successfully obtained info.",
      bio,
      vendorName,
      bioPictures,
    });
  })
  .catch(err => {
    console.log('Error in retrieving vendor info,', err);
    return res.json({
      success: false,
      message: "Server error in retrieving info: " + err
    });
  })
})


module.exports = router;