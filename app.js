// require packages
const express = require('express');
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser');
const firebase = require('firebase');
const admin = require('firebase-admin');

const cron = require('node-cron');
const Email = require('email-templates');

global.schedule = require('node-schedule');

// firebase setup
const serviceAccount = require('./config/ecs193-ecommerce-firebase-adminsdk-7iy3n-f581d24562.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ecs193-ecommerce.firebaseio.com'
});

let db = admin.firestore().settings({timestampsInSnapshots: true });

//express setup
const app = express();
// parse body request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// use cors;
app.use(cors());

//serve react files
app.use(express.static(path.join(__dirname, '/frontend/build')));

//routes
const router = express.Router();
const users = require('./routes/users');
const signup = require('./routes/signup');
const login = require('./routes/login');
const getVendorProducts = require('./routes/getVendorProducts');
const getUserCart = require('./routes/getUserCart');
const getAllProducts = require('./routes/getAllProducts');
const adminUser = require('./routes/adminUser');
const adminProducts = require('./routes/adminProducts');
const adminVendor = require('./routes/adminVendor');
const getVendorInfo = require('./routes/getVendorInfo');
const paypalSandbox = require('./routes/paypalSandbox');
const orders = require('./routes/orders');
const getProductInfo = require('./routes/getProductInfo');
const stock = require('./routes/stock');

app.use('/api/users', users);
app.use('/api/signup', signup);
app.use('/api/login', login);
app.use('/api/getVendorProducts', getVendorProducts);
app.use('/api/getUserCart', getUserCart);
app.use('/api/getAllProducts', getAllProducts);
app.use('/api/adminUser', adminUser);
app.use('/api/adminProducts', adminProducts);
app.use('/api/adminVendor', adminVendor);
app.use('/api/getVendorInfo', getVendorInfo);
app.use('/api/paypalSandbox', paypalSandbox);
app.use('/api/orders', orders);
app.use('/api/getProductInfo', getProductInfo);
app.use('/api/stock', stock);

//fix react app crashing on refresh
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'))
})

db = admin.firestore();

// on start of app, go through all vendors, and create their email schedules
var initSchedules = db.collection('vendors').get().then(snapshot => {
  snapshot.forEach(vdoc => {
    // job name === doc.vid
    // job schedule === doc.emailSchedule
    let j = schedule.scheduleJob(vdoc.data().vid, vdoc.data().emailSchedule,
    function() {
      db.collection('orders').where('vid', '==', vdoc.id)
      .where('seenByVendor', '==', false)
      .orderBy('date','asc')
      .get().then(ordersSnapshot => {
        console.log('Email job ran for:', vdoc.data().vid);
        console.log('Ran at time:', Date.now());
        // do not send emails if no new orders
        if (!ordersSnapshot.empty) {
          let orderCount = 0;
          ordersSnapshot.forEach(odoc => {
            db.collection('orders').doc(odoc.id).update({seenByVendor: true});

            // NOTE: for our own sanity, we are just gonna send a count of items
            // and a link to order history page.
            orderCount += 1;
          });

          // once obtained the orders
          let emailSubject = "You've got new orders from ECS193 E-commerce"

          const vendorEmail = new Email({
            message: {
              from: 'ecs193.ecommerce@gmail.com',
              // from: 'test@test.com',
              subject: emailSubject,
              to: vdoc.data().email
            },
            send: false,  // set send to true when not testing
            // preview: false,  // TODO turn off preview before production

            transport: {
              // uncomment when actually sending emails
              service: 'gmail',
              auth: {
                user: 'ecs193.ecommerce@gmail.com',
                pass: '193ecommerce'
              }
            }
          });

          let emailIntro = 'Hello, you have ' + orderCount + ' new orders. Please go to your admin order history page to see more details.'

          vendorEmail.send({
            template: 'ordersNotification',
            locals: {
              location: 'Test club location here.',
              emailIntro: emailIntro,
            }
          })
          .then(() => {
            console.log('Finished Sending Email to:', vdoc.id);
          })
          .catch(console.log);
        }

      }) 
      .catch(err => {  // catch for orders ref
        console.log('Error in getting user orders for emailing:', err);
      });

    });  // end function for each job schedule
  });   // END snapshot.forEach vdoc

})
.catch(err => {  // catch for initSchedule
  console.log(err);
  // TODO, send email to self on this breaking
  // once obtained the orders
  let emailSubject = "193 E-commerce: Error in Email Schedules"

  const errorEmail = new Email({
    message: {
      from: 'ecs193.ecommerce@gmail.com',
      // from: 'test@test.com',
      subject: emailSubject,
      to: 'thele@ucdavis.edu'
    },
    send: true,  // set send to true when not testing
    // preview: false,  // TODO turn off preview before production

    transport: {
      // uncomment when actually sending emails
      // TODO, change password, and hide it in config file
      service: 'gmail',
      auth: {
        user: 'ecs193.ecommerce@gmail.com',
        pass: '193ecommerce'
      }
    }
  });

  let emailIntro = 'Error in email schedules for ECS193 Ecomerce.';

  errorEmail.send({
    template: 'ordersNotification',
    locals: {
      location: 'Test club location here.',
      emailIntro: emailIntro,
    }
  })
  .then(() => {
    console.log('Finished Sending Error Email to self.');
  })
  .catch(console.log);
});

/*var defaultApp = admin.initializeApp(defaultAppConfig);
var defaultAuth = defaultApp.auth();

var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signinWithRedirect(provider);
firebase.auth().getRedirectResult().then(function(result) {
	if (result.credential){
		var token = result.credential.accessToken;
	}
}).catch(function(error) {
	var errorCode = error.code;
	var errorMessage = error.message;
	var email = error.email;
	var credential = error.credential;
});*/

// listen to requests on port
// choose port based on environment
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT);
