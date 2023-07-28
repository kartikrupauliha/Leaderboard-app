require("dotenv").config();
const { SHA256 } = require("crypto-js");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function hashString(inputString) {
  return SHA256(inputString).toString();
}

//Middleware. Here we are passing this middleware through all the routes which are accessed by Admin only.
// It first checks if there token is there to check whether the user who is making the request is "admin" or not.
// If no cookies are found, it will check for presence of an "ADMIN_STRING", if admin_string is correct, it passes the backend request, otherwise error occurs.
// No cookies found option is specifically for Admin to make backend requests via Postman. If there was no such mechanism, the admin will have to pass all the tokens, cookies in the postman, then he would be able to make request. To avoid this hassle, I created this mechanism.
exports.adminVerification = async (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token);

  // normally verifying every user
  if (token) {
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.json({ status: false });
      } else {
        const user = await User.findById(data.id);
        // console.log(user);
        if (user) {
          if (user.isAdmin) {
            req.body.user = user;
            next();
          } else {
            return res.json({ status: false, err: "Not the Admin" });
          }
        } else return res.json({ status: false, err: err.message });
      }
    });
  } else {
    // made this specifically so that admin (Service account) could directly make a backend request without setting tokens and all
    // admin just needs to enter the "secret phrase" in the body to call a backend request
    const ADMIN_STRING = req.body.ADMIN_STRING;
    const hashValue = await hashString(ADMIN_STRING);
    if (hashValue == process.env.SECRET_PHRASE) {
      const user = await User.findOne({ isAdmin: true });
      if (user) {
        req.body.user = user;
        next();
      }
    } else {
      return res.json({ status: false, err: "Wrong secret phrase" });
    }
  }
};
