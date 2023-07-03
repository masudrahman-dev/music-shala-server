const jwt = require("jsonwebtoken");

const createToken = (req, res) => {
    // const secret = require("crypto").randomBytes(64).toString("hex");
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res.send({token});
  }

  module.exports = {createToken}