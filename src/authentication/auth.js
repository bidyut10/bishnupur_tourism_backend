const jwt = require("jsonwebtoken");

const Authentication = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    if (!token)
      return res
        .status(400)
        .send({ status: false, message: "token must be present " });

    jwt.verify(token, "5^8LydB!mso^o!Yx", function (err) {
      if (err)
        return res
          .status(401)
          .send({ status: false, message: "token is not valid" });
      next();
    });
  } catch (err) {
    res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

module.exports = { Authentication };
