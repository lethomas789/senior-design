const express = require("express");
const router = express.Router();
const cookieConfig = require('../config/config.json');

// clear out cookies on logout
router.post("/", (req, res) => {
  if (req.signedCookies.token) {
    res.clearCookie("token", cookieConfig);
  }
  return res.sendStatus(200);
});

module.exports = router;