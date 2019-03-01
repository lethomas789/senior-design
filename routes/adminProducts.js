const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();


/**
 * Adds new product for vendor.
 */
router.post('/addNewProduct', (req, res) => {
  var size = '';  // not all products will have size
  // TODO figure out categories


  if (req.body.params){ 
    var vid = req.body.params.vid;
    var user = req.body.params.user;
    var productInfo = req.body.params.productInfo;
    var productName = req.body.params.productName;
    // TODO figure out how to add many pictures
    // var productPicture = req.body.params.productPicture;
    var productPrice = req.body.params.productPrice;
    var stock = req.body.params.stock;
  }
  else {
    var vid = req.body.vid;
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
   */

   if (!vid || !user || !productInfo || !productName || !productPrice || !stock) {
    console.log('Error: missing params for adding new product.');
    return res.status(200).json({
      success: false,
      message: 'Error: missing params for adding new product.'
    });
   }

   // check existing vendor
   let vendorRef = db.collection('vendors').doc(vid);
   vendorRef.get().then(doc => {
    if (!doc.exists) {
      console.log('Error: no such vendor for given vid.');
      return res.status(200).json({
        success: false,
        message: 'Error: no such vendor for given vid. '
      });
    }

    // check existing admin user
    vendorRef.collection('admins').doc(user).get().then(doc => {
      if (!doc.exists) {
        console.log('Error: provided user is not an admin for given vendor.');
        return res.status(200).json({
          success: false,
          messaage: 'Error: provided user is not an admin for given vendor.'
        });
      }

      let productData = {
        productInfo: productInfo,
        productName: productName,
        productPrice: productPrice,
        stock: stock,
        purchasedStock: 0,
        vid: vid,
        productPicture: 'TODO'
      };

      db.collection('products').add(productData)
      .then(ref => {
        console.log('Added new product with ID: ', ref.id);

        db.collection('products').doc(ref.id).update({pid: ref.id});

        vendorRef.collection('products').doc(ref.id).set(productData)
        .then(_ => {
          console.log('Succesfully added new product.');
          return res.status(200).json({
            success: true,
            message: 'Successfully added new product.' 
          });
        })
        .catch(err => {
          console.log('Error in adding new product:', err);
          return res.status(200).json({
            success: false,
            message: 'Error in adding new product: ' + err
          });
        });

      })
      .catch(err => {  // catch for setting new product
        console.log('Error in adding new product:', err);
        return res.status(200).json({
          success: false,
          message: 'Error in adding new product: ' + err
        });
      });

    })
    .catch(err => {  // catch for adminRef
      console.log('Error in getting adminref:', err);
      return res.status(200).json({
        success: false,
        message: 'Error in getting adminRef: ' + err
      });
    });

   })
   .catch(err => {   // catch for vendorref.get
     console.log('Error in getting vendorRef:', err);
     return res.status(200).json({
       success: false,
       message: 'Error in getting vendorRef: ' + err
     });
   });

});  // END POST /addNewProduct


module.exports = router;
