const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();

//get all users in /users collection
router.get('/', tokenMiddleware, (req,res) => {
    var email = req.authorizedData.user;

    const userRef = db.collection('users').doc(email);
    userRef.get().then(doc => {
        if(!doc.exists) {
            console.log('No such account for given email:', email);
            return res.status(200).json({
              success: false,
              message: 'No such account for given email: ' + email
            });
        }
    
        else{
            return res.status(200).json({
                message:"Account info retrieved",
                data: doc.data()
            })
        }
    })
})

module.exports = router;
