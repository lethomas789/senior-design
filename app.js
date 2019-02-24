// require packages
const express = require('express');
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser');
const firebase = require('firebase');
const admin = require('firebase-admin');
const multer = require('multer');  // for multipart bodies e.g. formdata
// const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
// const XMLHttpRequest = require('xhr2');
// const test = require('@')

// firebase setup
const serviceAccount = require('./config/ecs193-ecommerce-firebase-adminsdk-7iy3n-b1f4760eb4.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ecs193-ecommerce.firebaseio.com'
});

const db = admin.firestore().settings({timestampsInSnapshots: true });

// firebase setup
const config = {
    "apiKey": "AIzaSyAGZ_iJTiDvDC45U99h_xHMMkaR0BhIUJM",
    "authDomain": "gs://ecs193-ecommerce.firebaseapp.com",
    "databaseURL": "https://ecs193-ecommerce.firebaseio.com",
    "storageBucket": "ecs193-ecommerce.appspot.com",
    "serviceAccount":
    "./config/ecs193-ecommerce-firebase-adminsdk-7iy3n-b1f4760eb4.json"
};

firebase.initializeApp(config);

const storagePackage = require('firebase/storage');
// const storage = firebase.storage();


// const storage = firebase.storage();
/*
const storage = require('@google-cloud/storage');
const storageRef = storage.ref();
*/


//express setup
const app = express();
// parse body request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// use cors;
app.use(cors());

//routes
const router = express.Router();
const users = require('./routes/users');
const signup = require('./routes/signup');
const login = require('./routes/login');
const getVendorProducts = require('./routes/getVendorProducts');
const getUserCart = require('./routes/getUserCart');
const getAllProducts = require('./routes/getAllProducts');
const adminVendor = require('./routes/adminVendor');

app.use('/api/users', users);
app.use('/api/signup', signup);
app.use('/api/login', login);
app.use('/api/getVendorProducts', getVendorProducts);
app.use('/api/getUserCart', getUserCart);
app.use('/api/getAllProducts', getAllProducts);
app.use('/api/adminVendor', adminVendor);

// listen to requests on port
// choose port based on environment
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT);
