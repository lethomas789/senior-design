const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtKey = require('../config/jwt.json');


//verify JWT to contnue with API
function auth (req,res,next) {
    var token = req.headers['x-access-token'];
    if(!token){
        res.status(403).send({auth: false, message: "No token, please login"});
    }

    else{
        jwt.verify(token, jwtKey.JWTSecret, (err, decoded) => {
            if(err){
                res.status(500).send({auth: false, message: "Error validating token"});
            }

            else{
                req.email = decoded.email;
                next();
            }
        });
    }
}

module.exports = auth;