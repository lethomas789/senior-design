const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

/**
 * @param user = user id
 * 
 * 1. Check existing user
 * 2. Get user cart ref in DB
 * 3. Collect all cart items, and return
 */
router.get('/', tokenMiddleware, (req,res) => {

  //passing user/email param through payload of token
  var { user } = req.authorizedData;

  //get user id
  // if (req.query.params) {
  //   var user = req.query.params.user;
  // }
  // else {
  //   var user = req.query.user;
  // }

  // return error if empty request
  if (!user) {
    return res.status(200).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  const userRef = db.collection('users').doc(user);

  userRef.get().then(doc => {
    if (!doc.exists) {
      return res.status(200).json({
        success: false,
        message: 'No such user'
      });
    }

    // get cart from user
    // cart id doc is user id
    const cartRef = userRef.collection('cart').doc(user).collection('cartItems');

    const cartItems = [];

    cartRef.get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          // push each cartItem doc to array
          cartItems.push(doc.data());
        });

        // send cartItems info
        return res.status(200).json({
          success: true,
          data: cartItems
        });

      })
      .catch(err => {  // catch for cartRef.get()
        console.log('Error in getting cart items:', err);
        return res.status(200).json({
          succes: false,
          message: 'Error in getting cart items'
        });
      })  // end cartRef.get()
  })
  .catch(err => {  // catch for userRef.get()
    console.log('Error getting user info:', err);
    return res.status(200).json({
      succes: false,
      message: 'Error in getting user info'
    });
  });  // end userRef.get()
});

/**
 * @param user - user id
 * @param pid - product id
 * @param vendorID - vendor id
 * @param imageLink = take out
 * @param size - size of apparrel
 * @param isApparel - bool
 * @param amtPurchased - num items purchased
 */
router.post('/addItems', tokenMiddleware, (req, res) => {
  var { user } = req.authorizedData;
  if (req.body.params) {
    var {
      // user,
      pid,
      vendorID,
      imageLink,
      size,
      isApparel
    } = req.body.params;
    var amtPurchased = Number(req.body.params.amtPurchased);
  }
  else {
    var {
      // user,
      pid,
      vendorID,
      imageLink,
      size,
      isApparel
    } = req.body;
    var amtPurchased = Number(req.body.amtPurchased);
  }

  // return error if empty request
  if(!user || !pid || !amtPurchased) {
    return res.status(200).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  const userRef = db.collection('users').doc(user);

  userRef.get().then(doc => {
    if (!doc.exists) {
      return res.status(200).json({
        success: false,
        message: 'No such user'
      });
    }

    // get cart from user
    // cart id doc is user id
    const cartRef = userRef.collection('cart').doc(user).collection('cartItems');

    // get product info from pid
    const productInfoRef = db.collection('products').doc(pid);

    productInfoRef.get().then(doc => {
      if (!doc.exists) {
        console.log('No such product doc');
        return res.status(200).json({
          success: false,
          message: 'No such product doc'
        });
      }
      // else, get data
      const productInfo = doc.data();

      let itemID = pid;

      // if item added is apparrel, the item id is pid-size
      if (isApparel === true) {
        itemID = `${pid}-${size}`
      }

      const cartItemRef = cartRef.doc(itemID);

      var transaction = db.runTransaction(t => {
        return t.get(cartItemRef).then(doc => {
          if (!doc.exists) {

            let totalItemPrice = amtPurchased * productInfo.productPrice;
            var data = {};

            //if the item is an apparel, create a data object with size and isApparel field
            if(isApparel === true){
              data = {
                pid: pid,
                amtPurchased: amtPurchased,
                productName: productInfo.productName,
                productPrice: productInfo.productPrice,
                totalPrice: totalItemPrice,
                vid: vendorID,
                image: imageLink,
                size: size,
                isApparel: isApparel,
                itemID: itemID,
              }

              // console.log("checking is apparel data", data);
            } 

            //if regular item, create data object with regular properties
            else{
              data = {
                pid: pid,
                amtPurchased: amtPurchased,
                productName: productInfo.productName,
                productPrice: productInfo.productPrice,
                totalPrice: totalItemPrice,
                vid: vendorID,
                image: imageLink,
                isApparel: isApparel,
                itemID: itemID,
              };
              // console.log("checking non apparel data", data);
            }

            // set new item(s) purchased into cart, with pid as doc identifier
            cartRef.doc(itemID).set(data);
            console.log('Succesfully added to cart of user: ' + user);
            return res.status(200).json({
              success: true,
              data: data
            });
          }

          //if the item does exist
          else {
            const oldItemAmt = doc.data().amtPurchased;
            const newAmt = oldItemAmt + amtPurchased;
            const totalItemPrice = newAmt * productInfo.productPrice;

            var data;

            //if item is not an apparel
            if(isApparel === false){
              data = {
                pid: pid,
                amtPurchased: newAmt,
                productName: productInfo.productName,
                productPrice: productInfo.productPrice,
                totalPrice: totalItemPrice,
                vid: vendorID,
                image: imageLink,
                itemID: itemID,
              };
            }

            //if the item is an apparel
            else{
              data = {
                pid: pid,
                amtPurchased: newAmt,
                productName: productInfo.productName,
                productPrice: productInfo.productPrice,
                totalPrice: totalItemPrice,
                vid: vendorID,
                image: imageLink,
                size: size,
                isApparel: isApparel,
                itemID: itemID,
              };
            }

            // update cart item
            t.update(cartItemRef, {
              amtPurchased: newAmt,
              totalPrice: totalItemPrice
            });

            console.log('Succesfully updated cart of user: ' + user);
            return res.status(200).json({
              success: true,
              data: data
            });
          }
        });
      })
      .then(result => {
        console.log('Update cart transaction success!');
      })
      .catch(err => {
        console.log('Update cart transaction failure:', err);
      });
    })
    .catch(err => {  // catch for productInfoRef.get()
      console.log('No such product doc');
      return res.status(200).json({
        success: false,
        message: 'No such product doc'
      });
    });  // end productInfo.get()
  })
  .catch(err => {  // catch for userRef.get()
    console.log('Error in userRef.get().then:', err);
    return res.status(200).json({
      success: false,
      message: 'Error in userRef.get().then' + err
    });
  });  // end userRef.get()
});

router.post('/deleteItems', tokenMiddleware, (req,res) => {
  var { user } = req.authorizedData;

  if (req.body.params) {
    // var user = req.body.params.user;
    var pid = req.body.params.pid;
    var isApparel = req.body.params.isApparel;
    var size = req.body.params.size;
  }
  else {
    // var user = req.body.user;
    var pid = req.body.pid;
    var isApparel = req.body.isApparel;
    var size = req.body.size;
  }

  // return error if empty request
  if (user === '' || pid === '' || isApparel === '') {
    return res.status(200).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  const userRef = db.collection('users').doc(user);

  // check to make sure existing user
  userRef.get().then(doc => {
    if (!doc.exists) {
      console.log('No such user: ', user);
      return res.status(200).json({
        success: false,
        message: 'No such user'
      });
    }
    
    let itemID = pid;

    // if item added is apparrel, the item id is pid-size
    if (isApparel === true) {
      itemID = `${pid}-${size}`
    }

    const cartItemRef = userRef.collection('cart').doc(user).collection('cartItems').doc(itemID);

    // check to make sure item exists for deltion
    cartItemRef.get().then(doc => {
      if (!doc.exists) {
        console.log('Cannot delete non-existing item for user:', user);
        return res.status(200).json({
          success: false,
          message: 'Cannot delete non-existing item for user:' + user
        });
      }
      // else delete the item from the cart
      let deleteDoc = cartItemRef.delete();
      // console.log('Deleted item from cart of user: ', user);
      return res.status(200).json({
        success: true,
        message: 'Succesfully deleted item from cart'
      });
    })
    .catch(err => {
      console.log('Error in getting cartItem doc:', err);
      return res.status(200).json({
        success: false,
        message: 'Error in getting cartItem ref:'  + err
      });
    });
  })
  .catch(err => {  // catch for userRef.get
    console.log('Error in getting user:', user);
    return res.status(200).json({
      success: false,
      message: 'Error in getting user' + err
    });
  });
});

// update amt on user cart page
router.post('/updateItems', tokenMiddleware, (req, res) => {
  var { user } = req.authorizedData;
  if (req.body.params) {
    // var user = req.body.params.user;
    var pid = req.body.params.pid;
    var amtPurchased = Number(req.body.params.amtPurchased);
    var isApparel = req.body.params.isApparel;
    var size = req.body.params.size;
  }
  else {
    // var user = req.body.user;
    var pid = req.body.pid;
    var amtPurchased = Number(req.body.amtPurchased);
    var isApparel = req.body.isApparel;
    var size = req.body.size;
  }

  // return error if empty request
  if (!user || !pid || !amtPurchased) {
    return res.status(200).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  if (amtPurchased <= 0) {
    return res.status(200).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  let itemID = pid;

  // if item added is apparrel, the item id is pid-size
  if (isApparel === true) {
    itemID = `${pid}-${size}`
  }
  
  const userRef = db.collection('users').doc(user);

  const cartItemRef = userRef.collection('cart').doc(user).collection('cartItems').doc(itemID);

  let transaction = db.runTransaction(t => {
    return t.get(cartItemRef).then(doc => {
      if (!doc.exists) {
        console.log('Cannot alter non-existing item in cart.');
        return res.status(200).json({
          success: false,
          message: 'Cannot alter non-existing item in cart.'
        });
      }
      else {
        const productPrice = doc.data().productPrice;
        const newTotalPrice = amtPurchased * productPrice;

        t.update(cartItemRef, {
          amtPurchased: amtPurchased,
          totalPrice: newTotalPrice
        });
        console.log('Successfully altered item quantity in user cart:', user);
        return res.status(200).json({
          success: true,
          message: 'Sucessfully altered item quantity in user cart: ' + user
        });
      }
    })
    .catch(err => {
      console.log('Error in getting pid from cart', err);
      return res.status(200).json({
        success: false,
        message: 'Error in getting pid from cart' + err
      });
    });
  })
  .then(result => {
    console.log('UpdateItems transaction success.');
  })
  .catch(err => {
    console.log('Error: UpdateItems transaction failed:', err);
  });
});

// route not used
router.post('/updateCart', tokenMiddleware, (req,res) => {
  var { user } = req.authorizedData;

  if (req.body.params) {
    // var user = req.body.params.user;
    var cartTotalPrice = Number(req.body.params.cartTotalPrice);
    var itemsInCart = Number(req.body.params.itemsInCart);
    var vendorsInOrder = req.body.params.vendorsInOrder;
  }
  else {
    // var user = req.body.user;
    var cartTotalPrice = Number(req.body.cartTotalPrice);
    var itemsInCart = Number(req.body.itemsInCart);
    var vendorsInOrder = req.body.vendorsInOrder;
  }

  if (!user || !cartTotalPrice || !itemsInCart || !vendorsInOrder) {
    return res.status(200).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  const userRef = db.collection('users').doc(user);

  userRef.get().then(doc => {
    // if user doesnt exist, stop
    if (!doc.exists) {
      console.log('Error: user does not exist: ', user);
      return res.status(200).json({
        success: false,
        message: 'Cannot update cart for non-existent user: ' + user
      });
    }

    // else update their cart
    const userCartRef = db.collection('users').doc(user).collection('cart').doc(user);

    const data = {
      cartTotalPrice: cartTotalPrice,
      itemsInCart: itemsInCart,
      vendorsInOrder: vendorsInOrder
    };

    // set the new user Cart info
    userCartRef.set(data);
    return res.status(200).json({
      success: true,
      message: 'Succesfully set new cart info for user: ' + user
    });
  })
  .catch(err => {
    console.log('Error in getting user:', err);
    return res.status(200).json({
      success: false,
      message: 'Error in getting user: ' + err
    });
  });
});

/**
 * Clears cart of a user. Route no longer used after split of cart changes.
 * 
 * @param user - email for user whose cart being cleared
 */
router.delete('/clearCart', tokenMiddleware, (req, res) => {

  var { user } = req.authorizedData;

  if (!user) {
    console.log('Error, missing request params in clearCart')
    return res.status(200).json({
      success: false,
      message: 'Missing request params in clearCart'
    });
  }

  const cartRef = db.collection('users').doc(user).collection('cart').doc(user).collection('cartItems');
  cartRef.get().then(snapshot => {
    if (snapshot.empty) {
      console.log('User cart successfully cleared.');
      return res.status(200).json({
        success: true,
        message: 'Successfully cleared cart.'
      });
    }

    // do a batch delete on all cartItems
    var batch = db.batch();

    snapshot.forEach(doc => {
      let itemRef = cartRef.doc(doc.id);
      batch.delete(itemRef);
    });

    batch.commit().then(() => {
      console.log('User cart successfully cleared.');
      return res.status(200).json({
        success: true,
        message: 'Successfully cleared cart.'
      });
    })
    .catch(err => {
      console.log('Server error in batch delete of user cart:', err);
      return res.status(200).json({
        success: false,
        message: 'server error in batch delete of user cart: ' + err
      });
    })
  })
  .catch(err => {
    console.log('Server error in deleting cart:', err);
    return res.status(200).json({
      success: false,
      message: 'Server error in deleting cart: ' + err
    });
  });
});

module.exports = router;