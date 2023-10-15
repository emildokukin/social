const tokenService = require("../services/TokenService");
const UserModel = require("../models/userModel");

module.exports = async function (req, res, next) {
  try {
    const userData = req.user;

    const user = await UserModel.findOne({ _id: userData._id });

    if (!user.isActivated) {
      return res.status(403).json({ error: "User is not activated" });
    }

    next();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
