const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/', (req,res) => {
  // get user id
  let user = req.body.user;

  // return error if empty request
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  let userRef = db.collection('users').doc(user);

  userRef.get().then(doc => {
    if (!doc.exists) {
      return res.status(400).json({
        success: false,
        message: 'No such user'
      });
    }

    // get cart from user
    // cart id doc is user id
    let cartRef = userRef.collection('cart').doc(user).collection('cartItems');

    // TODO, send back higher level cart info

    let cartItems = [];

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
        return res.status(400).json({
          succes: false,
          message: 'Error in getting cart items'
        });
      })  // end cartRef.get()
  })
  .catch(err => {  // catch for userRef.get()
    console.log('Error getting user info:', err);
    return res.status(400).json({
      succes: false,
      message: 'Error in getting user info'
    });
  });  // end userRef.get()
});

router.post('/addItems', (req, res) => {
  // get user id and product id
  let user = req.body.user;
  let pid = req.body.pid;  // product id
  let amtPurchased = Number(req.body.amtPurchased);

  // return error if empty request
  if(!user || !pid || !amtPurchased) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  let userRef = db.collection('users').doc(user);

  userRef.get().then(doc => {
    if (!doc.exists) {
      return res.status(400).json({
        success: false,
        message: 'No such user'
      });
    }

    // get cart from user
    // cart id doc is user id
    let cartRef = userRef.collection('cart').doc(user).collection('cartItems');

    // get product info from pid
    let productInfoRef = db.collection('products').doc(pid);

    productInfoRef.get().then(doc => {
      if (!doc.exists) {
        console.log('No such product doc');
        return res.status(400).json({
          success: false,
          message: 'No such product doc'
        });
      }
      // else, get data
      let productInfo = doc.data();

      let cartItemRef = cartRef.doc(pid);

      var transaction = db.runTransaction(t => {
        return t.get(cartItemRef).then(doc => {
          if (!doc.exists) {
            let totalItemPrice = amtPurchased * productInfo.productPrice;

            let data = {
              amtPurchased: amtPurchased,
              productName: productInfo.productName,
              productPrice: productInfo.productPrice,
              totalPrice: totalItemPrice
            };

            // set new item(s) purchased into cart, with pid as doc identifier
            cartRef.doc(pid).set(data);

            console.log('Succesfully added to cart of user: ' + user);
            return res.status(200).json({
              success: true,
              data: data
            });
          }
          else {
            let oldItemAmt = doc.data().amtPurchased;
            let newAmt = oldItemAmt + amtPurchased;
            let totalItemPrice = newAmt * productInfo.productPrice;


            let data = {
              amtPurchased: newAmt,
              productName: productInfo.productName,
              productPrice: productInfo.productPrice,
              totalPrice: totalItemPrice
            };

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
      return res.status(400).json({
        success: false,
        message: 'No such product doc'
      });
    });  // end productInfo.get()
  })
  .catch(err => {  // catch for userRef.get()
    console.log('Error in userRef.get().then:', err);
    return res.status(400).json({
      success: false,
      message: 'Error in userRef.get().then' + err
    });
  });  // end userRef.get()
});

router.post('/deleteItems', (req,res) => {
  let user = req.body.user;
  let pid = req.body.pid;

  // return error if empty request
  if (user === '' || pid === '') {
    return res.status(400).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  let userRef = db.collection('users').doc(user);

  // check to make sure existing user
  userRef.get().then(doc => {
    if (!doc.exists) {
      console.log('No such user: ', user);
      return res.status(400).json({
        success: false,
        message: 'No such user'
      });
    }
    
    let cartItemRef = userRef.collection('cart').doc(user).collection('cartItems').doc(pid);

    // check to make sure item exists for deltion
    cartItemRef.get().then(doc => {
      if (!doc.exists) {
        console.log('Cannot delete non-existing item for user:', user);
        return res.status(500).json({
          success: false,
          message: 'Cannot delete non-existing item for user:' + user
        });
      }
      // else delete the item from the cart
      let deleteDoc = cartItemRef.delete();
      console.log('Deleted item from cart of user: ', user);
      return res.status(200).json({
        success: true,
        message: 'Succesfully deleted item from cart'
      });
    })
    .catch(err => {
      console.log('Error in getting cartItem doc:', err);
      return res.status(500).json({
        success: false,
        message: 'Error in getting cartItem ref:'  + err
      });
    });

  })
  .catch(err => {  // catch for userRef.get
    console.log('Error in getting user:', user);
    return res.status(500).json({
      success: false,
      message: 'Error in getting user' + err
    });
  });
});

// update amt on user cart page
router.post('/updateItems', (req, res) => {
  let user = req.body.user;
  let pid = req.body.pid;
  let amtPurchased = Number(req.body.amtPurchased);

  // return error if empty request
  if (!user || !pid || !amtPurchased) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  if (amtPurchased <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  let cartItemRef = db.collection('users').doc(user).collection('cart').doc(user).collection('cartItems').doc(pid);

  let transaction = db.runTransaction(t => {
    return t.get(cartItemRef).then(doc => {
      if (!doc.exists) {
        console.log('Cannot alter non-existing item in cart.');
        return res.status(500).json({
          success: false,
          message: 'Cannot alter non-existing item in cart.'
        });
      }
      else {
        let productPrice = doc.data().productPrice;
        let newTotalPrice = amtPurchased * productPrice;

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
      return res.status(500).json({
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

module.exports = router;
