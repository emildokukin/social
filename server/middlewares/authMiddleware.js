const tokenService = require("../services/TokenService");

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ error: "Token not found in authorization header" });
    }

    const accessToken = authorizationHeader.split(" ")[1];

    if (!accessToken) {
      return res
        .status(401)
        .json({ error: "Token not found in authorization header" });
    }

    const userData = tokenService.validateAccessToken(accessToken);

    if (!userData) {
      return res.status(401).json({ error: "Invalid access token" });
    }

    req.user = userData;

    next();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
