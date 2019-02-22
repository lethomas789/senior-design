const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/', (req,res) => {
  // get user id
  let user = req.body.user;

  // return error if empty request
  if (user === '') {
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
  let amtPurchased = req.body.amtPurchased;

  // return error if empty request
  if (user === '' || pid === '' || amtPurchased === '') {
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
            let totalItemPrice = Number(amtPurchased) * Number(productInfo.productPrice);

            let data = {
              amtPurchased: Number(amtPurchased),
              productName: productInfo.productName,
              productPrice: Number(productInfo.productPrice),
              totalPrice: Number(totalItemPrice)
            };

            // set new item(s) purchased into cart, with pid as doc identifier
            cartRef.doc(pid).set(data);

            // TODO, cloud functions to update cart info like vendorsInOrder,
            // itemsInCart, totalPrice

            console.log('Succesfully added to cart of user: ' + user);
            return res.status(200).json({
              success: true,
              data: data
            });
          }
          else {
            let oldItemAmt = doc.data().amtPurchased;
            let newAmt = oldItemAmt + Number(amtPurchased);
            let totalItemPrice = newAmt * Number(productInfo.productPrice);


            let data = {
              amtPurchased: newAmt,
              productName: productInfo.productName,
              productPrice: productInfo.productPrice,
              totalPrice: totalItemPrice
            };

            // set new item(s) purchased into cart, with pid as doc identifier
            // cartRef.doc(pid).set(data);
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
        console.log('Transaction success!');
      })
      .catch(err => {
        console.log('Transaction failure:', err);
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

  userRef.get().then(doc => {
    if (!doc.exists) {
      console.log('No such user: ', user);
      return res.status(400).json({
        success: false,
        message: 'No such user'
      });
    }
    
    let cartItemRef = userRef.collection('cart').doc(user).collection('cartItems').doc(pid);

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

module.exports = router;
