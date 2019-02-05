const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const db = admin.firestore();
const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const jwtKey = require('../config/jwt.json');

const saltRounds = 10;


//user model 
//email
//name.firstName
//name.lastName
//password

// /api/signup
// sign up user
router.post('/', (req,res) => {

    // extract user info from request
    var firstName = req.body.name.firstName;
    var lastName = req.body.name.lastName;
    var email = req.body.email;
    var password = req.body.password;

    // validation, checking empty inputs
    if(firstName.trim() === '' || lastName.trim() === '' || email.trim() === '' || password.trim() === ''){
        res.status(400).send("One or more fields are empty");
    }

    // checking invalid email
    else if(validator.isEmail(email) === false){
        res.status(400).send("Invalid email");
    }

    // checking password length
    else if(validator.isLength(password, {min: 8, max: 20})=== false){
        res.status(400).send("Password must be at least 8 characters");
    }

    else{
        // check to see if data object exists in user collection
        // find document by email, email viewed as unique identifer 
        var ref = db.collection('users').where('email', '==', email);

        // get documents with matching query
        ref.get()
            .then(snapshot => {
                //if user already exists, return
                if(snapshot.size > 0){
                    res.status(400).send("email already in use");
                }

                // no matching results, create new user
                else{
                    //create object to store into database
                    var newUser = {
                        name:{
                            firstName: firstName,
                            lastName: lastName,
                        },
                        email: email,
                        password: password
                    };

                    // password hashing
                    bcrypt.genSalt(saltRounds, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, null, (err, hash) => {
                            if(err){
                                res.status(500).send("error hashing password");
                            }

                            //store user into database
                            newUser.password = hash;
                            db.collection('users').doc(email).set(newUser);

                            //generate JWT
                            var payload = {email: email};
                            jwt.sign(payload, jwtKey.JWTSecret, {expiresIn: 3600}, (err, token) => {
                                res.status(200).json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            });

                        })
                    });
                } // end of else statement
            })
            .catch(err => {
                console.log(err);
                res.status(500).send("Error with server");
            })
    }
})

module.exports = router;