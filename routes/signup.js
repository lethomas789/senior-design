const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();

//user model 
//email
//name.firstName
//name.lastName
//password

//sign up user
router.post('/', (req,res) => {
    var firstName = req.body.name.firstName;
    var lastName = req.body.name.lastName;
    var email = req.body.email;
    var password = req.body.password;

    //create new object to store into firebase
    var newUser = {
        name:{
            firstName: firstName,
            lastName: lastName,
        },
        email: email,
        password: password
    }

    //check to see if data object exists in user collection
    var ref = db.collection('/users').doc(JSON.stringify(newUser));
    ref.get()
        .then(snapshot => {
            //if user already exists, return 
            if (snapshot.exists){
                res.status(400).send("user exists");
            }

            else{
                //create new object in user collection
                ref.set(newUser);
                res.status(200).send("signup successful");
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error with server");
        })

})

module.exports = router;