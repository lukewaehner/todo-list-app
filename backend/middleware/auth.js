const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const xauthtoken = req.header("x-auth-token");

  // Check if the Authorization header exists
  if (!xauthtoken) {
    console.error("No token, auth denied");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Extract the token from the Authorization header
  // const token = authHeader.replace("Bearer ", "");

  const token = xauthtoken;

  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("Token is not valid: ", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
