const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/', (req,res) => {
  // get user id
  let user = req.body.user;

  // return error if empty request
  if (user.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  let userRef = db.collection('users').doc(user);

  userRef.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json({
          success: false,
          message: 'No such user'
        });
      }

      // get cart from user
      // cart id doc is user id
      // let cartRef = userRef.collection('cart').doc(user).collection('cartItems');
      // TODO change above back, example currentyl just hard coded doc id b/c
      // I'm too lazy to make a new one

      let cartItems = [];
      let cartRef = userRef.collection('/cart/example_uid/cartItems');

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
})

router.post('/addItems', (req, res) => {
  // get user id and product id
  let user = req.body.user;
  let pid = req.body.pid;  // product id
  let amtPurchased = req.body.amtPurchased;

  // return error if empty request
  if (user === '' || pid === '' || amtPurchased === '') {
    return res.status(400).json({
      success: false,
      message: 'Invalid request params'
    });
  }

  let userRef = db.collection('users').doc(user);

  userRef.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json({
          success: false,
          message: 'No such user'
        });
      }

      // get cart from user
      // cart id doc is user id
      let cartRef = userRef.collection('cart').doc(user).collection('cartItems');

      // will overwrite any existing document of pid there, make sure to contain
      // amt purchased
      // for now, query price and do math here, could hold the data in frontend
      // TODO

      // get product info from pid
      let productInfoRef = db.collection('products').doc(pid);

      productInfoRef.get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such product doc');
            return res.status(400).json({
              success: false,
              message: 'No such product doc'
            });
          }
          // else, get data
          let productInfo = doc.data(); 

          let totalItemPrice = Number(amtPurchased) * Number(productInfo.productPrice);

          let data = {
            amtPurchased: amtPurchased,
            productName: productInfo.productName,
            productPrice: productInfo.productPrice,
            totalPrice: totalItemPrice
          };

          // set new item(s) purchased into cart, with pid as doc identifier
          cartRef.doc(pid).set(data);

          // TODO, cloud functions to update cart info like vendorsInOrder,
          // itemsInCart, totalPrice

          return res.status(200).json({
            success: true,
            data: data
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
        message: 'Error in userRef.get().then'
      });
    });  // end userRef.get()
})

module.exports = router;