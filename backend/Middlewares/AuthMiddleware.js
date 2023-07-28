const User = require("../models/user.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// This middleware just verfies the user information through the saved token in the browser.
exports.userVerification = (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token);
  if (!token) {
    return res.json({ status: false });
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) {
        // console.log(user);
        req.body.user = user;
        next();
      } else return res.json({ status: false, err: err.message });
    }
  });
};
