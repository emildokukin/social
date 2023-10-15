const userService = require("../services/UserService");
const MessageService = require("../services/MessageService");
const { validationResult } = require("express-validator");
const ms = require("ms");
const UserService = require("../services/UserService");

class UserController {
  
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
      }

      const { email, password, firstName, secondName } = req.body;

      const userData = await userService.registration(
        email,
        password,
        firstName,
        secondName
      );

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN),
        httpOnly: true,
      });

      return res.json(userData);
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN),
        httpOnly: true,
      });

      return res.json(userData);
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      await userService.logout(refreshToken);

      res.clearCookie("refreshToken");
      return res.status(200).json("Successful logout");
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;

      await userService.activate(activationLink);

      if (req.get("origin") === process.env.CLIENT_URL) return res.json("ok");

      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      if (req.get("origin") === process.env.CLIENT_URL)
        return res.json("Incorrect activation code");

      return res.redirect(process.env.CLIENT_URL + "/activate/error");
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const userData = await userService.refresh(refreshToken);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN),
        httpOnly: true,
      });

      return res.json(userData);
    } catch (e) {
      res.status(401).json({ error: e.message });
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async getMessages(req, res, next) {
    try {
      const senderId = req.user._id;
      const receiverId = req.params.receiverId;

      const messages = await MessageService.getMessages(senderId, receiverId);
      return res.json(messages);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async getAllChattedUsers(req, res, next) {
    try {
      const receiverId = req.user._id;

      const users = await userService.getAllChattedUsers(receiverId);

      return res.json(users);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async subscribe(req, res, next) {
    try {
      const followerId = req.user._id;
      const followingId = req.params.userId;

      const messages = await userService.subscribe(followerId, followingId);
      return res.json(messages);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async unsubscribe(req, res, next) {
    try {
      const followerId = req.user._id;
      const followingId = req.params.userId;

      const messages = await userService.unsubscribe(followerId, followingId);
      return res.json(messages);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async getUserById(req, res, next) {
    try {
      const userId = req.params.userId;

      const users = await userService.getUserById(userId);
      return res.json(users);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async getUsersWithSubscriptionCheck(req, res, next) {
    try {
      const userId = req.user._id;
      const searchString = req.params.searchString;

      const users = await userService.getUsersWithSubscriptionCheck(
        userId,
        searchString
      );
      return res.json(users);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user._id;
      const { firstName, secondName, email } = req.body;

      const profileInfo = {
        firstName,
        secondName,
        email,
      };

      if (req.file) {
        profileInfo.avatarImage = req.file.path;
      }

      const newProfile = await UserService.updateProfile(userId, profileInfo);
      return res.json(newProfile);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

module.exports = new UserController();
