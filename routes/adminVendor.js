const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const validator = require("validator");
require("dotenv").config();

// const schedule = require('node-schedule');

/**
 * GET returns vendor about info for frontend.
 *
 * @param user - admin getting info
 * @param vid - vid must be sent to obtain vendor DB info
 *
 * @returns Vendor about page info.
 */
router.get("/", tokenMiddleware, (req, res) => {
  var { user } = req.authorizedData;

  if (req.query.params) {
    // var user = req.query.params.user;
    var vid = req.query.params.vid;
  } else {
    // var user = req.query.user;
    var vid = req.query.vid;
  }

  if (!user || !vid) {
    console.log("Error: missing params for GET adminVendor.");
    return res.status(200).json({
      success: false,
      message: "Error: missing params for GET adminVendor."
    });
  }

  let vendorRef = db.collection("vendors").doc(vid);

  vendorRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log("Error: no such vendor for given vid.");
        return res.status(200).json({
          success: false,
          message: "Error: no such vendor for given vid. "
        });
      }

      let vendorData = doc.data();

      // check to make sure user is admin for security purposes
      vendorRef
        .collection("admins")
        .doc(user)
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log(
              "Error: provided user is not an admin for given vendor."
            );
            return res.status(200).json({
              success: false,
              messaage: "Error: provided user is not an admin for given vendor."
            });
          }

          // else good to send back data

          // console.log("Succesfully retrieved vendor info.");
          // console.log("Vendor:", vendorData.vendorName);
          // console.log("User:", user);
          return res.status(200).json({
            success: true,
            bio: vendorData.bio,
            lastUpdate: vendorData.lastUpdate.toDate(),
            lastUpdateUser: vendorData.lastUpdateUser,
            vendorName: vendorData.vendorName,
            email: vendorData.email,
            emailSchedule: vendorData.emailSchedule,
            pickupInfo: vendorData.pickupInfo,
            facebook: vendorData.facebook,
            instagram: vendorData.instagram,
          });
        })
        .catch(err => {
          // catch for admins ref
          console.log("Error in getting adminRef:", err);
          return res.status(200).json({
            success: false,
            message: "Error in getting adminRef: " + err
          });
        });
    })
    .catch(err => {
      // catch for vendorRef.get
      console.log("Error in getting vendorRef:", err);
      return res.status(200).json({
        success: false,
        message: "Error in getting vendorRef: " + err
      });
    });
}); // END GET /

/**
 * For params, assume that when an admin goes to the edit page, frontend does a
 * GET on the vendor's old info. Even if the admin makes only one change, this
 * route expects old and new data sent for ease of update purposes.
 *
 * @param user - admin editing; assumed to have passed admin check already
 * @param vid - vid must be sent from frontend to obtain vendor DB info
 * @param bio - vendor description
 * @param vendorName - if user wants to change vendorName
 *
 * @returns res success true or false
 */
router.patch("/editVendorInfo", tokenMiddleware, (req, res) => {
  var { user } = req.authorizedData;
  if (req.body.params) {
    var {
      vid,
      vendorName,
      bio,
      email,
      pickupInfo,
      facebook,
      instagram
    } = req.body.params;
  } else {
    var {
      vid,
      vendorName,
      bio,
      email,
      pickupInfo,
      facebook,
      instagram
    } = req.body;
  }

  // must include editing user and vid; bio and vendorName not always edited
  if (!user || !vendorName || !bio || !vid) {
    console.log("Error: missing params for editVendorInfo.");
    return res.status(200).json({
      success: false,
      message: "Error: missing params for editVendorInfo."
    });
  }

  //check if user sent a valid contact email
  if (validator.isEmail(email) === false) {
    return res.json({
      success: false,
      message: "Invalid Email"
    });
  }

  let vendorRef = db.collection("vendors").doc(vid);

  vendorRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log("Error: no such vendor for given vid.");
        return res.status(200).json({
          success: false,
          message: "Error: no such vendor for given vid."
        });
      }

      // check to make sure user is admin for security purposes
      vendorRef
        .collection("admins")
        .doc(user)
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log(
              "Error: provided user is not an admin for given vendor."
            );
            return res.status(200).json({
              success: false,
              messaage: "Error: provided user is not an admin for given vendor."
            });
          }

          // else, good to update

          let lastUpdate = admin.firestore.Timestamp.now();
          let lastUpdateUser = user; // user who did most recent update

          // else vendor exists, write new data
          vendorRef.update({
            vendorName: vendorName,
            bio: bio,
            lastUpdate: lastUpdate,
            lastUpdateUser: lastUpdateUser,
            email: email,
            pickupInfo: pickupInfo,
            facebook: facebook,
            instagram: instagram
          });

          // console.log("Succesfully updated vendor info.");
          // console.log("Vendor:", vendorName);
          // console.log("User:", user);

          return res.status(200).json({
            success: true,
            message: "Succesfully updated vendor info for: " + vendorName
          });
        })
        .catch(err => {
          // catch for admins ref
          console.log("Error in getting adminRef:", err);
          return res.status(200).json({
            success: false,
            message: "Error in getting adminRef: " + err
          });
        });
    })
    .catch(err => {
      // catch for vendorRef.get
      console.log("Error in getting vendorRef:", err);
      return res.status(200).json({
        success: false,
        message: "Error in getting vendorRef: " + err
      });
    });
}); // END PATCH /editVendorInfo

router.patch("/emailSchedule", tokenMiddleware, (req, res) => {
  var { user } = req.authorizedData;
  if (req.body.params) {
    var vid = req.body.params.vid;
    var emailSchedule = req.body.params.emailSchedule;
    // var user = req.body.params.user;
  } else {
    var vid = req.body.vid;
    var emailSchedule = req.body.emailSchedule;
    // var user = req.body.user;
  }

  // example:
  // every 0th min, every 3 hours
  // 0 */3 * * *

  if (!vid || !emailSchedule || !user) {
    console.log("Error missing request params for patch emailSchedule");
    return res.status(200).json({
      success: false,
      message: "Error missing request params for patch emailSchedule"
    });
  }

  let vendorRef = db.collection("vendors").doc(vid);

  vendorRef
    .get()
    .then(vdoc => {
      if (!vdoc.exists) {
        console.log("Error: no such vendor for given vid.");
        return res.status(200).json({
          success: false,
          message: "Error: no such vendor for given vid."
        });
      }

      // check to make sure user is admin for security purposes
      vendorRef
        .collection("admins")
        .doc(user)
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log(
              "Error: provided user is not an admin for given vendor."
            );
            return res.status(200).json({
              success: false,
              messaage: "Error: provided user is not an admin for given vendor."
            });
          }

          // else, good to update
          let lastUpdate = admin.firestore.Timestamp.now();
          let lastUpdateUser = user; // user who did most recent update

          // when updating emailSchedule, must first kill previous job with old
          // schedule
          var oldJob = schedule.scheduledJobs[vdoc.id];

          // cancel only if there was an old job
          if (oldJob != undefined) {
            oldJob.cancel();
          }

          // if none, do not schedule a new task
          if (emailSchedule !== "none") {
            // now, create new job with new emailSchedule
            var j = schedule.scheduleJob(vdoc.id, emailSchedule, function() {
              db.collection("orders")
                .where("vid", "==", vdoc.id)
                .where("seenByVendor", "==", false)
                .orderBy("date", "asc")
                .get()
                .then(ordersSnapshot => {
                  console.log("Email job for:", vdoc.id);
                  console.log("Ran at time:", Date.now());
                  // do not send emails if no new orders
                  if (!ordersSnapshot.empty) {
                    let orderCount = 0;
                    ordersSnapshot.forEach(odoc => {
                      db.collection("orders")
                        .doc(odoc.id)
                        .update({ seenByVendor: true });

                      // NOTE: for our own sanity, we are just gonna send a count of
                      // items and a link to order history page.
                      orderCount += 1;
                    });

                    // once obtained the orders
                    let emailSubject =
                      "You've got new orders from ECS193 E-commerce";

                    const vendorEmail = new Email({
                      message: {
                        from: process.env.EMAIL,
                        // from: 'test@test.com',
                        subject: emailSubject,
                        to: vdoc.data().email
                      },
                      send: false, // set send to true when not testing
                      // preview: false,  // TODO turn off preview before production

                      // TODO
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
                          location: "Test club location here.",
                          emailIntro: emailIntro
                        }
                      })
                      .then(() => {
                        console.log("Finished Sending Email to:", vdoc.id);
                      })
                      // TODO send error email to shared account
                      .catch(console.log);
                  }
                })
                .catch(err => {
                  // catch for orders ref
                  console.log(
                    "Error in getting user orders for emailing:",
                    err
                  );
                  return res.status(200).json({
                    success: false,
                    message: "Error in updating email schedule" + err
                  });
                });
            }); // end function for job schedule
          }

          // once done scheduling new task, update DB
          db.collection("vendors")
            .doc(vid)
            .update({
              emailSchedule: emailSchedule,
              lastUpdate: lastUpdate,
              lastUpdateUser: lastUpdateUser
            });

          console.log("Finished updating new email schedule for vid:", vid);
          return res.status(200).json({
            success: true,
            message: "Finished updating new email schedule for vid: " + vid
          });
        })
        .catch(err => {
          // catch for admins ref
          console.log("Error in getting adminRef:", err);
          return res.status(200).json({
            success: false,
            message: "Error in getting adminRef: " + err
          });
        });
    })
    .catch(err => {
      // catch for vendorRef.get
      console.log("Error in getting vendorRef:", err);
      return res.status(200).json({
        success: false,
        message: "Error in getting vendorRef: " + err
      });
    });
}); // END PATCH /emailSchedule

module.exports = router;
