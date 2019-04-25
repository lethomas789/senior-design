const express = require("express");
const router = express.Router();
const firebase = require("firebase");
const admin = require("firebase-admin");
const db = admin.firestore();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt-nodejs");
const saltRounds = 10;
const Email = require("email-templates");

router.post("/", (req, res) => {
  if (req.body.params) {
    var { email } = req.body.params;
  } else {
    var { email } = req.body;
  }

  if (!email) {
    console.log("Missing params for route.");
    return res.json({
      success: false,
      message: "Missing parmas for route"
    });
  }

  const userRef = db.collection("users").doc(email);
  userRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log("No such account for given email:", email);
        return res.json({
          success: false,
          message: "Sorry, no such account for given email."
        });
      }

      const token = crypto.randomBytes(20).toString("hex");
      const now = Date.now();
      const time = new Date(now + 3600000);
      // console.log('time is:', time.toString());

      // console.log("Reset token is:", token);
      console.log("Time is:", time);
      userRef.update({
        resetPassToken: token,
        resetPassExpires: time
        // testTimeNow: admin.firestore.Timestamp.now()
      });

      // once obtained the orders
      const emailSubject = "ECS 193 Ecommerce Reset Password";
      const body =
        `You are receiving this email because you (or someone else) has
        requested a password reset for your account.\n` +
        `Please click on the following link within one hour of receiving it: ` +
        // TODO LINK
        `If you did not request this, please ignore this email and your
        password will remain unchanged.\n`;

      const resetPassEmail = new Email({
        message: {
          from: "ecs193.ecommerce@gmail.com",
          // from: 'test@test.com',
          subject: emailSubject,
          to: email
        },
        send: true, // set send to true when not testing
        // preview: false, // TODO turn off preview before production

        transport: {
          // uncomment when actually sending emails
          service: "gmail",
          auth: {
            user: "ecs193.ecommerce@gmail.com",
            pass: "193ecommerce"
          }
        }
      });

      resetPassEmail
        .send({
          // TODO template, and hide email info
          template: "resetPass",
          locals: {
            body: body
          }
        })
        .then(() => {
          console.log("Finished sending reset email to:", email);
          return res.json({
            success: true,
            message: "Successfully sent reset password email."
          });
        })
        .catch(console.log);
    })
    .catch(err => {
      console.log("Error in reset pass route:", err);
      return res.json({
        success: false,
        message: "Server error: " + err
      });
    });
});

router.get("/checkToken", (req, res) => {
  if (req.query.params) {
    var { resetPassToken } = req.query.params;
  } else {
    var { resetPassToken } = req.query;
  }

  if (!resetPassToken) {
    console.log("Missing params for route.");
    return res.json({
      success: false,
      message: "Missing params for route"
    });
  }

  // const time = Date.now();
  const time = new Date();
  console.log(time);

  const queryRef = db
    .collection("users")
    .where("resetPassToken", "==", resetPassToken)
    .where("resetPassExpires", ">", time);

  queryRef
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No such token or expired:", resetPassToken);
        console.log("what");
        return res.json({
          success: false,
          message: "Sorry, password reset link is invalid or has expired."
        });
      }

      let email = "";

      // should only be one doc in snapshot
      snapshot.forEach(doc => {
        email = doc.data().email;
      });
      // token link found
      return res.json({
        success: true,
        email: email,
        message: "Passwork reset link is good."
      });
    })
    .catch(err => {
      console.log("Error in check token route:", err);
      return res.json({
        success: false,
        message: "Server error: " + err
      });
    });
});

router.post("/updatePass", (req, res) => {
  if (req.body.params) {
    var { email, newPassword } = req.body.params;
  } else {
    var { email, newPassword } = req.body;
  }

  if (!email || !newPassword) {
    console.log("Missing params for route.");
    return res.json({
      success: false,
      message: "Missing parmas for route"
    });
  }

  const userRef = db.collection("users").doc(email);
  userRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log("No such account for given email:", email);
        return res.json({
          success: false,
          message: "Sorry, no such account for given email."
        });
      }

      // password hashing
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(newPassword, salt, null, (err, hashedPassword) => {
          if (err) {
            return res.json({
              success: false,
              message: "Server error hashing password"
            });
          }
          userRef
            .update({
              password: hashedPassword,
              resetPassToken: null,
              resetPassExpires: null
            })
            .then(() => {
              console.log("Successfully updated password.");
              return res.json({
                success: true,
                message: "Successfully updated password."
              });
            })
            .catch(err => {
              console.log("Server error in updating DB:", err);
              return res.json({
                success: false,
                message: "Server error in updating DB: " + err
              });
            });
        });
      }); // end bcrypt.genSalt
    })
    .catch(err => {
      console.log("Error in reset pass route:", err);
      return res.json({
        success: false,
        message: "Server error: " + err
      });
    });
});

module.exports = router;
