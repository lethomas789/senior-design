const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();


/**
 * Adds new product for vendor.
 */
router.post('/addNewProduct', (req, res) => {
  if (req.body.params){ 
    var {
      vid,
      user,
      productInfo,
      productName,
      productPicture,  // TODO: ask how this is being sent again
      pid,
      pickupLocation,
      pickupTime
    } = req.body.params;

    var productPrice = Number(req.body.params.productPrice);
    var isApparel = false;  // init to be false

    // stock is total number of items
    var stock = Number(req.body.params.stock);

    // if apparel === true, multiple types of stock
    if (req.body.params.isApparel) {
      isApparel = true;
      var xs_stock = Number(req.body.params.xs_stock);
      var s_stock = Number(req.body.params.s_stock);
      var m_stock = Number(req.body.params.m_stock);
      var l_stock = Number(req.body.params.l_stock);
      var xl_stock = Number(req.body.params.xl_stock);
    }
  }

  else {
    var {
      vid,
      user,
      productInfo,
      productName,
      productPicture,
      pid,
      pickupLocation,
      pickupTime
    } = req.body;

    var productPrice = Number(req.body.productPrice);
    var isApparel = false;  // init to be false

    // stock is total number of items combined
    var stock = Number(req.body.stock);      

    // if apparel === true, multiple types of stock
    if (req.body.isApparel) {
      isApparel = true;
      var xs_stock = Number(req.body.xs_stock);
      var s_stock = Number(req.body.s_stock);
      var m_stock = Number(req.body.m_stock);
      var l_stock = Number(req.body.l_stock);
      var xl_stock = Number(req.body.xl_stock);
    }
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
  const vendorRef = db.collection('vendors').doc(vid);
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

      var pictures = [];

      // if no pictures sent, make default image
      if (productPicture.length === 0) {
        pictures.push('https://firebasestorage.googleapis.com/v0/b/ecs193-ecommerce.appspot.com/o/shop.png?alt=media');
      }
      // else, iterate through strings in array and save them
      //made edit, uploading name of image files to construct image url for product, requires image name
      //made edit, extract file name from image name array
      else {
        for(let i = 0; i < productPicture.length; ++i) {
          let link =
          `https://firebasestorage.googleapis.com/v0/b/ecs193-ecommerce.appspot.com/o/images%2F${vid}%2F${pid}%2F${productPicture[i].name}?alt=media`;

          // TODO, figure out order of push, in terms of what order vendors want
          // to show their pics
          pictures.push(link);
        }
      }

      let lastUpdate = admin.firestore.Timestamp.now();
      let lastUpdateUser = user;  // user who did most recent update

      // if apparel true, save extra stock params
      if (isApparel) {
        var productData = {
          productInfo,
          productName,
          productPrice,
          vid,
          pictures,  // array of picture links

          isApparel,
          stock,
          xs_stock,
          s_stock,
          m_stock,
          l_stock,
          xl_stock,
          purchasedStock: 0,  // init to be 0

          lastUpdate,
          lastUpdateUser,

          pid,
          pickupLocation,
          pickupTime
        };
      }
      // else, just save stock
      else {
        var productData = {
          productInfo,
          productName,
          productPrice,
          vid,
          pictures,  // array of picture links

          isApparel,
          stock,
          purchasedStock: 0,  // init to be 0

          lastUpdate,
          lastUpdateUser,

          pid,
          pickupLocation,
          pickupTime
        };
      }

      db.collection('products').doc(pid).set(productData)
      .then(ref => {
        // console.log('Added new product with ID: ', ref.id);

        // db.collection('products').doc(ref.id).update({ pid: ref.id });

        console.log('Succesfully added new product.');
        return res.status(200).json({
          success: true,
          message: 'Successfully added new product.'
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


/**
 * Gets product for admin to edit.
 * 
 * @param vid - vendor id
 * @param pid - product id
 * @param user - admin doing checking the admin product info
 */
router.get('/getProduct', (req, res) => {

  if (req.query.params) {
    var {
      vid,
      user,
      pid
    } = req.query.params;
  }
  else {
    var {
      vid,
      user,
      pid
    } = req.query;
  }

  /*
   * 1. do various param checking
   * 2. check if user is admin in vendor info
   */

  if (!vid || !user || !pid) {
    console.log('Error: missing params for get product.');
    return res.status(200).json({
      success: false,
      message: 'Error: missing params for get product.'
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

      // check if pid exists
      db.collection('products').doc(pid).get().then(pdoc => {
        if (!pdoc.exists) {j
          console.log('Error: provided pid does not exist:', pid);
          return res.status(200).json({
            success: false,
            messaage: 'Error: provided pid does not exist.'
          });
        }

        let data = pdoc.data();

        console.log('Successfully retrieved product info for admin.');

        if (data.isApparel) {
          return res.status(200).json({
            success: true,
            lastUpdate: data.lastUpdate.toDate(),
            lastUpdateUser: data.lastUpdateUser,
            isApparel: data.isApparel,
            pid: data.pid,
            productInfo: data.productInfo,
            productName: data.productName,
            productPicture: data.productPicture,
            productPrice: data.productPrice,
            stock: data.stock,
            xs_stock: data.xs_stock,
            s_stock: data.s_stock,
            m_stock: data.m_stock,
            l_stock: data.l_stock,
            xl_stock: data.xl_stock,
            purchasedStock: data.purchasedStock,
          });
        }
        else {
          return res.status(200).json({
            success: true,
            lastUpdate: data.lastUpdate.toDate(),
            lastUpdateUser: data.lastUpdateUser,
            isApparel: data.isApparel,
            pid: data.pid,
            productInfo: data.productInfo,
            productName: data.productName,
            productPicture: data.productPicture,
            productPrice: data.productPrice,
            stock: data.stock,
            purchasedStock: data.purchasedStock,
          });
        }
      })
      .catch(err => {  // catch for getProduct
        console.log('Error in getting product ref:', err);
        return res.status(200).json({
          success: false,
          message: 'Server error in getting product ref: ' + err
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

router.patch('/editProduct', (req, res) => {
  if (req.body.params){ 
    var {
      vid,
      user,
      productInfo,
      productName,
      productPicture,  // TODO: ask how this is being sent again
      pid,
      pickupLocation,
      pickupTime
    } = req.body.params;

    var productPrice = Number(req.body.params.productPrice);
    var isApparel = false;  // init to be false

    // stock is total number of items
    var stock = Number(req.body.params.stock);

    // if apparel === true, multiple types of stock
    if (req.body.params.isApparel) {
      isApparel = true;
      var xs_stock = Number(req.body.params.xs_stock);
      var s_stock = Number(req.body.params.s_stock);
      var m_stock = Number(req.body.params.m_stock);
      var l_stock = Number(req.body.params.l_stock);
      var xl_stock = Number(req.body.params.xl_stock);
    }
  }

  else {
    var {
      vid,
      user,
      productInfo,
      productName,
      productPicture,
      pid,
      pickupLocation,
      pickupTime
    } = req.body;

    var productPrice = Number(req.body.productPrice);
    var isApparel = false;  // init to be false

    // stock is total number of items combined
    var stock = Number(req.body.stock);      

    // if apparel === true, multiple types of stock
    if (req.body.isApparel) {
      isApparel = true;
      var xs_stock = Number(req.body.xs_stock);
      var s_stock = Number(req.body.s_stock);
      var m_stock = Number(req.body.m_stock);
      var l_stock = Number(req.body.l_stock);
      var xl_stock = Number(req.body.xl_stock);
    }
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
  const vendorRef = db.collection('vendors').doc(vid);
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

      var pictures = [];

      // if no pictures sent, make default image
      if (productPicture.length === 0) {
        pictures.push('https://firebasestorage.googleapis.com/v0/b/ecs193-ecommerce.appspot.com/o/shop.png?alt=media');
      }
      // else, iterate through strings in array and save them
      //made edit, uploading name of image files to construct image url for product, requires image name
      //made edit, extract file name from image name array
      else {
        console.log(productPicture);
        for(let i = 0; i < productPicture.length; ++i) {
          let link =
          `https://firebasestorage.googleapis.com/v0/b/ecs193-ecommerce.appspot.com/o/images%2F${vid}%2F${pid}%2F${productPicture[i].name}?alt=media`;
          // TODO, figure out order of push, in terms of what order vendors want
          // to show their pics
          console.log(link);
          pictures.push(link);
        }
      }

      let lastUpdate = admin.firestore.Timestamp.now();
      let lastUpdateUser = user;  // user who did most recent update

      // if apparel true, save extra stock params
      if (isApparel) {
        var productData = {
          productInfo,
          productName,
          productPrice,
          vid,
          pictures,  // array of picture links

          isApparel,
          stock,
          xs_stock,
          s_stock,
          m_stock,
          l_stock,
          xl_stock,
          // purchasedStock: 0,  // init to be 0

          lastUpdate,
          lastUpdateUser,

          pid,
          pickupLocation,
          pickupTime,
        };
      }
      // else, just save stock
      else {
        var productData = {
          productInfo,
          productName,
          productPrice,
          vid,
          pictures,  // array of picture links

          isApparel,
          stock,
          // on edit, do not alter already purchased stock
          // purchasedStock: 0,  // init to be 0

          lastUpdate,
          lastUpdateUser,

          pid,
          pickupLocation,
          pickupTime,
        };
      }

      db.collection('products').doc(pid).update(productData)
      .then(ref => {
        // console.log('Added new product with ID: ', ref.id);

        // db.collection('products').doc(ref.id).update({ pid: ref.id });

        console.log('Succesfully updated new product.');
        return res.status(200).json({
          success: true,
          message: 'Successfully updated new product.'
        });
      })
      .catch(err => {  // catch for setting new product
        console.log('Error in updating product:', err);
        return res.status(200).json({
          success: false,
          message: 'Error in updating product: ' + err
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

});  // END PATCH /editProduct



module.exports = router;
