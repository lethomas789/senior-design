const express = require("express");
const router = express.Router();
const firebase = require("firebase");
const admin = require("firebase-admin");
const db = admin.firestore();

/**
 * GET route to check if existing stock
 * @param pid - product id
 * @param isApparel - bool flag
 * @param size - string indicatign stock size e.g "s_stock", "xs_stock" etc.
 * @param amt - amt user trying to purchase
 */
router.get("/", (req, res) => {
  if (req.query.params) {
    var { pid, isApparel, size, amt } = req.query.params;
  } else {
    var { pid, isApparel, size, amt } = req.query;
  }

  if (!pid) {
    console.log("Error: missing params for checking stock.");
    return res.status(200).json({
      success: false,
      message: "Error: missing params for checking stock."
    });
  }

  const productRef = db.collection("products").doc(pid);

  productRef
    .get()
    .then(doc => {
      if (!doc) {
        console.log("Error: no such product for given pid:", pid);
        return res.json({
          success: false,
          message: "Error: no such product for given pid: " + pid
        });
      }

      const pdata = doc.data();

      // if apparel, check the size stock
      if (isApparel === true) {
        if (pdata[size] >= amt) {
          // console.log("Successfully checked for existing stock:", pdata[size]);
          return res.json({
            success: true,
            message: "Successfullly checked for existing stock.",
            availableStock: true
          });
        } else {
          // console.log("Successfully checked for existing stock:", pdata[size]);
          return res.json({
            success: true,
            message: "Sorry not enough stock.",
            availableStock: false
          });
        }
      } else {
        if (pdata.stock >= amt) {
          // console.log("Successfully checked for existing stock:", pdata.stock);
          return res.json({
            success: true,
            message: "Successfullly checked for existing stock.",
            availableStock: true
          });
        } else {
          return res.json({
            success: true,
            message: "Sorry not enough stock.",
            availableStock: false
          });
        }
      }
    })
    .catch(err => {
      console.log("Server error in checking product stock:", err);
      return res.json({
        success: false,
        message: "Server error in checking product stock: " + err
      });
    });
});

/**
 * PATCH route to subtract stock on purchase
 * @param pid - product id
 * @param isApparel - bool flag
 * @param size - string indicatign stock size e.g "s_stock", "xs_stock" etc.
 * @param amt - amt user trying to purchase
 */
router.patch("/", tokenMiddleware, (req, res) => {
  if (req.body.params) {
    var { pid, isApparel, size, amt } = req.body.params;
  } else {
    var { pid, isApparel, size, amt } = req.body;
  }

  if (!pid) {
    console.log("Error: missing params for checking stock.");
    return res.status(200).json({
      success: false,
      message: "Error: missing params for checking stock."
    });
  }

  const productRef = db.collection("products").doc(pid);
  const transaction = db
    .runTransaction(t => {
      return t.get(productRef).then(doc => {
        if (!doc) {
          console.log("Error: no such product for given pid:", pid);
          return Promise.reject(
            "Sorry, an error occurred, please try again later."
          );
        }

        const pdata = doc.data();
        if (isApparel === true) {
          const newAmt = pdata[size] - amt;
          t.update(productRef, { [size]: newAmt });
          // console.log("Successfully subtracted product stock.");
          return Promise.resolve("Product stock subtracted.");
        } else {
          const newAmt = pdata.stock - amt;

          t.update(productRef, { stock: newAmt });
          // console.log("Successfully subtracted product stock.");
          return Promise.resolve("Product stock subtracted.");
        }
      });
    })
    .then(result => {
      console.log("Transaction success", result);
      return res.json({
        success: true,
        message: "Purchase successful."
      });
    })
    .catch(err => {
      console.log("Transaction failure:", err);
      return res.json({
        success: false,
        message: "Sorry, a server error occurred. Please try again later."
      });
    });
});

module.exports = router;
