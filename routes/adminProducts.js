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
    var vid = req.body.params.vid;
    var user = req.body.params.user;
    var productInfo = req.body.params.productInfo;
    var productName = req.body.params.productName;
    var productPicture = req.body.params.productPicture;
    var productPrice = Number(req.body.params.productPrice);

    var isApparel = false;  // init to be false

    // if apparel === true, multiple types of stock
    if (req.body.params.isApparel) {
      isApparel = req.body.params.isApparel;  // change to true
      var xs_stock = Number(req.body.params.xs_stock);
      var s_stock = Number(req.body.params.s_stock);
      var m_stock = Number(req.body.params.m_stock);
      var l_stock = Number(req.body.params.l_stock);
      var xl_stock = Number(req.body.params.xl_stock);
    }
    // stock is total number of items
    var stock = Number(req.body.params.stock);
  }
  else {
    var vid = req.body.vid;
    var user = req.body.user;
    var productInfo = req.body.productInfo;
    var productName = req.body.productName;
    // TODO figure out how to add many pictures
    var productPicture = req.body.productPicture;
    var productPrice = Number(req.body.productPrice);
    var stock = Number(req.body.stock);

    var isApparel = false;  // init to be false

    // if apparel === true, multiple types of stock
    if (req.body.isApparel) {
      isApparel = req.body.isApparel;  // change to true
      var xs_stock = Number(req.body.xs_stock);
      var s_stock = Number(req.body.s_stock);
      var m_stock = Number(req.body.m_stock);
      var l_stock = Number(req.body.l_stock);
      var xl_stock = Number(req.body.xl_stock);

    }
    // stock is total number of items combined
    var stock = Number(req.body.stock);      
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

      var pictures = [];

      // if no pictures sent, make default image
      if (productPicture.length === 0) {
        pictures.push('https://firebasestorage.googleapis.com/v0/b/ecs193-ecommerce.appspot.com/o/shop.png?alt=media');
      }
      // else, iterate through strings in array and save them
      else {
        for(let i = 0; i < productPicture.length; ++i) {
          let link =
          `https://firebasestorage.googleapis.com/v0/b/ecs193-ecommerce.appspot.com/o/images%2F${vid}%2F${productPicture[i]}?alt=media`;

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
          productInfo: productInfo,
          productName: productName,
          productPrice: productPrice,
          vid: vid,
          productPicture: pictures,  // array of picture links

          isApparel: isApparel,
          stock: stock,
          xs_stock: xs_stock,
          s_stock: s_stock,
          m_stock: m_stock,
          l_stock: l_stock,
          xl_stock: xl_stock,
          purchasedStock: 0,

          lastUpdate: lastUpdate,
          lastUpdateUser: lastUpdateUser
        };
      }
      // else, just save stock
      else {
        var productData = {
          productInfo: productInfo,
          productName: productName,
          productPrice: productPrice,
          vid: vid,
          productPicture: pictures,  // array of picture links

          isApparel: isApparel,
          stock: stock,
          purchasedStock: 0,

          lastUpdate: lastUpdate,
          lastUpdateUser: lastUpdateUser
        };
      }

      db.collection('products').add(productData)
      .then(ref => {
        console.log('Added new product with ID: ', ref.id);

        db.collection('products').doc(ref.id).update({ pid: ref.id });

        console.log('Succesfully added new product.');
        return res.status(200).json({
          success: true,
          message: 'Successfully added new product.'
        });

        /*
        // NOTE: no longer needed to add to vendor subcollection
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
        */

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
    var vid = req.query.params.vid;
    var user = req.query.params.user;
    var pid = req.query.params.pid;
  }
  else {
    var vid = req.query.vid;
    var user = req.query.user;
    var pid = req.query.pid;
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
            xl_stock: data.xl_stock
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


/**
 * Edits vendor product.  TODO
 */
router.patch('/editProduct', (req, res) => {

  if (req.body.params){ 
    var vid = req.body.params.vid;
    var user = req.body.params.user;
    var productInfo = req.body.params.productInfo;
    var productName = req.body.params.productName;
    var productPicture = req.body.params.productPicture;
    var productPrice = Number(req.body.params.productPrice);

    var isApparel = false;  // init to be false

    // if apparel === true, multiple types of stock
    if (req.body.params.apparel) {
      isApparel = req.body.params.isApparel;  // change to true
      var xs_stock = Number(req.body.params.xs_stock);
      var s_stock = Number(req.body.params.s_stock);
      var m_stock = Number(req.body.params.m_stock);
      var l_stock = Number(req.body.params.l_stock);
      var xl_stock = Number(req.body.params.xl_stock);
    }
    // stock is total number of items
    var stock = Number(req.body.params.stock);
  }
  else {
    var vid = req.body.vid;
    var user = req.body.user;
    var productInfo = req.body.productInfo;
    var productName = req.body.productName;
    // TODO figure out how to add many pictures
    var productPicture = req.body.productPicture;
    var productPrice = Number(req.body.productPrice);
    var stock = Number(req.body.stock);

    var isApparel = false;  // init to be false

    // if apparel === true, multiple types of stock
    if (req.body.apparel) {
      isApparel = req.body.isApparel;  // change to true
      var xs_stock = Number(req.body.xs_stock);
      var s_stock = Number(req.body.s_stock);
      var m_stock = Number(req.body.m_stock);
      var l_stock = Number(req.body.l_stock);
      var xl_stock = Number(req.body.xl_stock);

    }
    // stock is total number of items combined
    var stock = Number(req.body.stock);      
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

      var pictures = [];

      // if no pictures sent, make default image
      if (productPicture.length === 0) {
        pictures.push('https://firebasestorage.googleapis.com/v0/b/ecs193-ecommerce.appspot.com/o/shop.png?alt=media');
      }
      // else, iterate through strings in array and save them
      else {
        for(let i = 0; i < productPicture.length; ++i) {
          let link =
          `https://firebasestorage.googleapis.com/v0/b/ecs193-ecommerce.appspot.com/o/images%2F${vid}%2F${productPicture[i]}?alt=media`;

          // TODO, figure out order of push, in terms of what order vendors want
          // to show their pics
          pictures.push(link);
        }
      }

      // if apparel true, save extra stock params
      if (isApparel) {
        var productData = {
          productInfo: productInfo,
          productName: productName,
          productPrice: productPrice,
          vid: vid,
          productPicture: pictures,  // array of picture links

          isApparel: isApparel,
          stock: stock,
          xs_stock: xs_stock,
          s_stock: s_stock,
          m_stock: m_stock,
          l_stock: l_stock,
          xl_stock: xl_stock,
          purchasedStock: 0
        };
      }
      // else, just save stock
      else {
        var productData = {
          productInfo: productInfo,
          productName: productName,
          productPrice: productPrice,
          vid: vid,
          productPicture: pictures,  // array of picture links

          isApparel: isApparel,
          stock: stock,
          purchasedStock: 0
        };
      }

      db.collection('products').add(productData)
      .then(ref => {
        console.log('Added new product with ID: ', ref.id);

        db.collection('products').doc(ref.id).update({ pid: ref.id });

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

});  // END PATCH /editProduct

module.exports = router;
