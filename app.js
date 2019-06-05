// require packages
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const firebase = require("firebase");
const admin = require("firebase-admin");
const cron = require("node-cron");
const Email = require("email-templates");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cookieConfig = require("./config/config.json");

// used to retrieve sensitive information placed within .env files
// see calls to "process.env.<variable here>"
require("dotenv").config();

// node shcedule library made global so that other routes can access globally
// scheduled jobs
global.schedule = require("node-schedule");

// firebase setup
const serviceAccount = require("./config/ecs193-ecommerce-firebase-adminsdk-7iy3n-f581d24562.json");

// firebase initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
});

let db = admin.firestore().settings({ timestampsInSnapshots: true });

//express setup
const app = express();
// parse body request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// use cors;
app.use(cors());

// the backend sends user information back to frontend using http-only cookies
// for security purposes. The below line of code requries the server to encode
// the cookies sent with as ecret
app.use(cookieParser(process.env.COOKIE_SECRET));

//serve react files
app.use(express.static(path.join(__dirname, "/frontend/build")));

// middleware to extract and verify token from headers
const checkToken = (req, res, next) => {
  if (!req.signedCookies.token) {
    // if no tokens, unauthorized request
    console.log("Unauthorized. No token.");
    res.clearCookie("token", cookieConfig);
    // res.sendStatus(403);
    res.status(403).json({
      success: false,
      message: "Please login to view."
    });
  } else {
    // else, token exists, so send it to next middleware
    next();
  }
};

// middleware to decode token and grab authorized data
const decodeToken = (req, res, next) => {
  // verify the jwt against secret
  jwt.verify(
    req.signedCookies.token,
    process.env.JWT_SECRET,
    (err, authorizedData) => {
      if (err) {
        // if error, send forbidden (403)
        console.log("ERROR: could not connect to protected route");
        res.clearCookie("token", cookieConfig);
        return res.sendStatus(403);
      } else {
        // if token is successfully verified, we can use the authorized data
        req.authorizedData = authorizedData;
        next();
      }
    }
  );
};

// middleware to refresh token 
// tokens expire after a given amount of time. If user is still using the
// website and making request calls, then we refresh their token so it doesn't
// expire in the middle of them using the website
const refreshToken = (req, res, next) => {
  const { user, vendors, isAdmin } = req.authorizedData;
  const newPayload = { user, vendors, isAdmin };

  jwt.sign(
    newPayload,
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
    (err, token) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "Error in generating jwt."
        });
      }

      res.cookie("token", token, cookieConfig);
      next();
    }
  );
};

// make the token middleware global so it can be used in all of the server's
// routes
global.tokenMiddleware = [checkToken, decodeToken, refreshToken];

// routes; frontend can make API calls to different routes to do different
// things
const router = express.Router();
const users = require("./routes/users");
const signup = require("./routes/signup");
const login = require("./routes/login");
const getVendorProducts = require("./routes/getVendorProducts");
const getUserCart = require("./routes/getUserCart");
const getAllProducts = require("./routes/getAllProducts");
const adminUser = require("./routes/adminUser");
const adminProducts = require("./routes/adminProducts");
const adminVendor = require("./routes/adminVendor");
const getVendorInfo = require("./routes/getVendorInfo");
const orders = require("./routes/orders");
const getProductInfo = require("./routes/getProductInfo");
const stock = require("./routes/stock");
const resetPass = require("./routes/resetPass");
const checkTokenRefresh = require("./routes/checkTokenRefresh");
const logout = require("./routes/logout");

// specific routes
app.use("/api/users", users);
app.use("/api/signup", signup);
app.use("/api/login", login);
app.use("/api/getVendorProducts", getVendorProducts);
app.use("/api/getUserCart", getUserCart);
app.use("/api/getAllProducts", getAllProducts);
app.use("/api/adminUser", adminUser);
app.use("/api/adminProducts", adminProducts);
app.use("/api/adminVendor", adminVendor);
app.use("/api/getVendorInfo", getVendorInfo);
app.use("/api/orders", orders);
app.use("/api/getProductInfo", getProductInfo);
app.use("/api/stock", stock);
app.use("/api/resetPass", resetPass);
app.use("/api/checkTokenRefresh", checkTokenRefresh);
app.use("/api/logout", logout);

// fix react app crashing on refresh
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
});

db = admin.firestore();

// on start of app, go through all vendors, and create their email schedules
var initSchedules = db
  .collection("vendors")
  .get()
  .then(snapshot => {
    snapshot.forEach(vdoc => {
      // only schedule jobs if there exists an emailSchedule setting
      if (vdoc.data().emailSchedule !== "none") {
        let j = schedule.scheduleJob(
          vdoc.data().vid,
          vdoc.data().emailSchedule,
          function() {
            db.collection("orders")
              .where("vid", "==", vdoc.id)
              .where("seenByVendor", "==", false)
              .orderBy("date", "asc")
              .get()
              .then(ordersSnapshot => {
                console.log("Email job ran for:", vdoc.data().vid);
                console.log("Ran at time:", Date.now());
                // do not send emails if no new orders
                if (!ordersSnapshot.empty) {
                  let orderCount = 0;
                  ordersSnapshot.forEach(odoc => {
                    db.collection("orders")
                      .doc(odoc.id)
                      .update({ seenByVendor: true });

                    // NOTE: for our own sanity, we are just gonna send a count of items
                    // and a link to order history page.
                    orderCount += 1;
                  });

                  // once obtained the orders
                  let emailSubject =
                    "You've got new orders from ECS193 E-commerce";

                  const vendorEmail = new Email({
                    message: {
                      from: process.env.EMAIL,
                      subject: emailSubject,
                      to: vdoc.data().email
                    },
                    send: false, // set send to true when not testing
                    preview: false, // TODO turn off preview before production

                    transport: {
                      // uncomment when actually sending emails
                      service: "gmail",
                      auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASS
                      }
                    }
                  });

                  let emailIntro =
                    "Hello, you have " +
                    orderCount +
                    " new orders. Please go to your admin order history page to see more details.";

                  vendorEmail
                    .send({
                      template: "ordersNotification",
                      locals: {
                        emailIntro: emailIntro
                      }
                    })
                    .then(() => {
                      console.log("Finished Sending Email to:", vdoc.id);
                    })
                    .catch(console.log);
                }
              })
              .catch(err => {
                // catch for orders ref
                console.log("Error in getting user orders for emailing:", err);
              });
          }
        ); // end function for each job schedule
      }
    }); // END snapshot.forEach vdoc
  })
  .catch(err => {
    // catch for initSchedule
    console.log(err);
  });

// clear from DB once every 60 min, accounts who is not verified, and their
// email toekens have expired
var clearUnVerifiedAccounts = schedule.scheduleJob("*/60 * * * *", function() {
  let time = new Date();
  console.log("Clearing unverified accounts at:", time);
  let usersRef = db
    .collection("users")
    .where("isVerified", "==", false)
    .where("emailTokenExpires", "<", time)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log("Clearing out account:", doc.id);
        let deleteUserDoc = db
          .collection("users")
          .doc(doc.id)
          .delete();
      });
      console.log("Finished clearing job.");
    })
    .catch(err => {
      console.log("Error in clearing unverified accounts job", err);
    });
});

// listen to requests on port
// choose port based on environment
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT);
