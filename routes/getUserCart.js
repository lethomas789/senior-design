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
    })
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

router.post('/addItem', (req, res) => {

});

module.exports = router;