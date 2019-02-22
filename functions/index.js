// const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

// const serviceAccount = require('../config/ecs193-ecommerce-firebase-adminsdk-7iy3n-b1f4760eb4.json');

/*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ecs193-ecommerce.firebaseio.com',
  // storageBucket: 'gs://ecs193-ecommerce.appspot.com/'
});
*/

admin.initializeApp();

const db = admin.firestore().settings({timestampsInSnapshots: true });

/*
exports.updateCart = functions.firestore
  .document('users/{user}/cart/{user}')
  .onWrite((change, context) => {
    const doc = change.after.exists ? change.after.data() : null;

    const oldDoc = change.before.data();

    const newVal = change.after.data();

    return change.after.ref.set({
      itemsInCart: itemsInCart + 1
    }, {merge: true});



    // let ref = db.collection('users').doc('test2@gmail.com').collection('cart').doc('test2@gmail.com');
    // let ref = db.doc('users/test2@gmail.com/cart/test2@gmail.com');

    /*
    ref.get()
      .then(doc => {
        let cartData = {
          cartTotalPrice: 0,
          itemsInCart: 0,
          vendorsInOrder: []
        };

        // set empty cart Data
        ref.set(cartData);

        console.log(doc.data());

        return;
      })
      .catch(err => console.log(err));

  });
  */