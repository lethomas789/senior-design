const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();

//get all users in /users collection
router.get('/', (req,res) => {
    //access collections of users
    db.collection('/users').get()
        .then(snapshot => {
            //create array, append each data record to array
            var results = [];
            snapshot.forEach(doc => {
                results.push(doc.data());
            });
            //return result of data
            res.status(200).send(results);
        })
        .catch((err) => {
            console.log(err);
        })
})

module.exports = router;
