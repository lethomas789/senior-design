const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
// const multer = require('multer');  // for multipart bodies e.g. formdata

async function getVendorNames(arrayOfRefs, retArray) {
  return db.runTransaction(t => {
    return Promise.all(arrayOfRefs.map(async (element) => {
      const doc = await t.get(element);
      retArray.push(doc.data().vendorName);
      console.log(retArray);
    }));
  });
}


/**
 * Route gets the list of vendor(s) the provided user is an admin of
 * 
 * @param user - user whose isAdmin flag true, and want to retrieve their club
 *
 * @returns: vendors - array of vid(s) for the vendor(s) user is admin of
 */
router.get('/', tokenMiddleware, (req, res) => {
  var { user, isAdmin } = req.authorizedData;

  // if (req.query.params) {
  //   var user = req.query.params.user;
  // }
  // else {
  //   var user = req.query.user;
  // }

  // check if given user
  if (!user || !isAdmin) {
    console.log('Error in getAdminVendor: missing required request paramters');
    return res.status(200).json({
      success: false,
      message: 'Error in getAdminVendor: missing required request paramters'
    });
  }

  if (!isAdmin) {
    console.log('User not an admin.');
    return res.json({
      success: false,
      message: 'Unauthorized, not an admin.',
    });
  }

  // get the user in the admins root collection
  db.collection('admins').doc(user).get().then(doc => {
    if (!doc.exists) {
      console.log('Error: user is not admin.')
      return res.status(200).json({
        success: false,
        message: 'Error: user is not admin.'
      });
    }


    let vendorIDs = doc.data().vendors;
    let vendorRefs = [];
    
    let vendorObjects = [];

    // push all vid's into an array for below
    for (let i = 0; i < vendorIDs.length; ++i) {
      vendorRefs.push(db.collection('vendors').doc(vendorIDs[i]));
    }

    // use transaction to grab all vid's and vendorName's to grab them all in
    // one go.
    db.runTransaction(transaction => {
      return transaction.getAll(vendorRefs).then(docs => {
        for (let i = 0; i < vendorRefs.length; ++i) {
          vendorObjects.push({
            vid: docs[i].data().vid,
            vendorName: docs[i].data().vendorName
          });
        }
      });
    })
    .then(() => {
      // once finished, send the object to frontend
      // console.log('Got admin info for provided user:', user);
      return res.status(200).json({
        success: true,
        message: 'Got admin info for provided user.',
        vendors: vendorObjects
      });

    })
    .catch(err => {
      console.log('Server error in running vendor transaction:', err);
      return res.status(200).json({
        success: false,
        message: 'Server error in running vendor transaction: ' + err
      });
    });

  })
  .catch(err => {
    console.log('Error in getting userRef', err);
    return res.status(200).json({
      success: false,
      message: 'Error in getting userRef: ' + err
    });
  });
});   // END GET /

// check if user is an admin
router.get('/checkAdmin', tokenMiddleware, (req, res) => {
  var { user, isAdmin } = req.authorizedData;

  if (!isAdmin) {
    console.log('User not an admin.');
    return res.json({
      success: false,
      message: 'Unauthorized, not an admin.',
    });
  }

  return res.json({
    success: true,
    message: "Success"
  });
});

/**
 * Route adds a new admin user for given vendor
 * 
 * @params vid - vendor ID
 * @params user - username of user we are trying to make an admin
 * @params adminCode - adminCode associated with vendor
 * 
 * @returns res with success true or false
 */
router.post('/addAdminUser', tokenMiddleware, (req, res) => {
  var { user } = req.authorizedData;
  if (req.body.params) {
    var vid = req.body.params.vid;
    // var user = req.body.params.user;
    var adminCode = req.body.params.adminCode;
  }
  else {
    var vid = req.body.vid;
    // var user = req.body.user;
    var adminCode = req.body.adminCode;
  }

  /*
   * 1. do param checking
   * 2. check vendor code to make sure it matches vendor
   * 3. add to admins list in vendor
   */

  if (!vid || !user || !adminCode) {
    console.log('Error in addAdminUser: missing required request paramters');
    return res.status(200).json({
      success: false,
      message: 'Error in addAdminUser: missing required request paramters'
    });
  }

  // let vendorRef = db.collection('vendors');
  let vendorRef = db.collection('vendors').doc(vid);

  vendorRef.get().then(doc => {
    if (!doc.exists) {
      console.log('Error: no such vendor for given vid:', vid);
      return res.status(200).json({
        success: false,
        message: 'Error: no such vendor for given vid: '+ vid
      });
    }

    vendorRef.collection('adminCode').doc('adminCode').get().then(doc => {
      // check to see if their admin code matches submitted admin code
      if (doc.data().adminCode !== adminCode) {
        console.log('Error: submitted adminCode does not match vendor adminCode');
        return res.status(200).json({
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
      }, {merge: true}).then(() => {
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
      .catch(err => {
        console.log('Error occured in setting admin for user:', err);
        return res.status(200).json({
          success: false,
          message: 'Server error occured in creating new admin. ' + err
        });
      });

    })
    .catch(err => {  // catch for getAdminCodeRef
      console.log('Error in getting adminCodeRef:', err); 
      return res.status(200).json({
        success: false,
        message: 'Error in getting adminCodeRef: ' + err
      });
    });

  })
  .catch(err => {  // catch for vendorRef
    console.log('Error in getting vendorRef', err);
    return res.status(200).json({
      success: false,
      message: 'Error in getting vendorRef: ' + err
    });
  });
});  // END POST /addAdminUser




module.exports = router;