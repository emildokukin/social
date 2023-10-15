const jwt = require("jsonwebtoken");
const tokenModel = require("../models/tokenModel");

class TokenService {
  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return null;
    }
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveRefreshToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    return await tokenModel.create({ user: userId, refreshToken });
  }

  async removeToken(refreshToken) {
    return await tokenModel.deleteOne({ refreshToken });
  }

  async findToken(refreshToken) {
    const tokenData = await tokenModel.findOne({ refreshToken });

    return tokenData;
  }
}

module.exports = new TokenService();
