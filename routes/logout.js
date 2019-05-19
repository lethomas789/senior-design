const express = require("express");
const router = express.Router();

// clear out cookies on logout
router.post("/", (req, res) => {
  console.log('LOGOUT')
  const cookieConfig = { 
    httpOnly: true,   // prevent frontend JS from reading cookies
    // secure: true,     // force https
    maxAge: 3600000,  // cookie expires in 1 hour
    signed: true,
  }

  if (req.signedCookies.token) {
    console.log('LOGGING OUT');
    res.clearCookie("token", cookieConfig);
    return res.sendStatus(200);
  }
});

module.exports = router;