const UserModel = require("../models/userModel");
const ChatModel = require("../models/chatModel");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./MailService");
const tokenService = require("./TokenService");
const { ObjectId } = require("mongodb");

class UserService {
  async activate(activationCode) {
    const user = await UserModel.findOne({ activationCode });

    if (!user) {
      throw new Error("Incorrect activation link");
    }

    user.isActivated = true;

    return user.save();
  }

  async registration(email, password, firstName, secondName) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw new Error(`User with such email ${email} already exists`);
    }

    const hashPassword = await bcrypt.hash(password, 2);
    const activationCode = uuid.v4();
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationCode,
      firstName,
      secondName,
    });

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationCode}`
    );

    const userInfo = {
      _id: user._id,
      email: user.email,
      isActivated: user.isActivated,
      firstName: user.firstName,
      secondName: user.secondName,
    };

    const tokens = tokenService.generateTokens(userInfo);
    await tokenService.saveRefreshToken(user._id, tokens.refreshToken);

    return {
      ...tokens,
      activationCode,
      user: userInfo,
    };
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error(`User with such email ${email} was not found`);
    }

    const isPasswordsEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordsEqual) {
      throw new Error(`An incorrect password was entered`);
    }

    const userInfo = {
      _id: user._id,
      email: user.email,
      isActivated: user.isActivated,
      firstName: user.firstName,
      secondName: user.secondName,
      avatarImage: user.avatarImage,
    };

    const tokens = tokenService.generateTokens(userInfo);
    await tokenService.saveRefreshToken(user._id, tokens.refreshToken);

    return {
      ...tokens,
      user: userInfo,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new Error("Invalid refresh token");
    }

    const user = await UserModel.findById(userData._id);

    const userInfo = {
      _id: user._id,
      email: user.email,
      isActivated: user.isActivated,
      firstName: user.firstName,
      secondName: user.secondName,
      avatarImage: user.avatarImage,
    };

    const tokens = tokenService.generateTokens(userInfo);
    await tokenService.saveRefreshToken(userInfo._id, tokens.refreshToken);

    return {
      ...tokens,
      user: userInfo,
    };
  }

  async updateProfile(userId, profileInfo) {
    const profile = await UserModel.findByIdAndUpdate(userId, profileInfo, {
      new: true,
    });
    return profile;
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  async getAllChattedUsers(userId) {
    if (!ObjectId.isValid(userId)) throw new Error("Invalid user id");

    const result = await ChatModel.aggregate([
      {
        $match: {
          $or: [
            { firstUserId: new ObjectId(userId) },
            { secondUserId: new ObjectId(userId) },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          let: { firstUserId: "$firstUserId", secondUserId: "$secondUserId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ["$$firstUserId", "$_id"] },
                        { $ne: ["$$firstUserId", new ObjectId(userId)] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ["$$secondUserId", "$_id"] },
                        { $ne: ["$$secondUserId", new ObjectId(userId)] },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "cho",
        },
      },
      { $unwind: "$cho" },
      { $replaceRoot: { newRoot: "$cho" } },
    ]);

    return result;
  }

  async subscribe(followerId, followingId) {
    //followerId - who subscribes

    if (followingId === followerId) {
      throw new Error(`User can not follow himself`);
    }

    const follower = await UserModel.findByIdAndUpdate(
      followerId,
      {
        $addToSet: { following: followingId },
      },
      { new: true }
    );

    if (!follower) {
      throw new Error(`User with id ${followerId} was not found`);
    }

    const following = await UserModel.findByIdAndUpdate(
      followingId,
      {
        $addToSet: { followers: followerId },
      },
      { new: true }
    );

    if (!following) {
      throw new Error(`User with id ${followingId} was not found`);
    }

    return follower;
  }

  async unsubscribe(followerId, followingId) {
    if (followingId === followerId) {
      throw new Error(`User can not unfollow himself`);
    }

    const follower = await UserModel.findByIdAndUpdate(
      followerId,
      {
        $pull: { following: followingId },
      },
      { new: true }
    );

    if (!follower) {
      throw new Error(`User with id ${followerId} was not found`);
    }

    const following = await UserModel.findByIdAndUpdate(
      followingId,
      {
        $pull: { followers: followerId },
      },
      { new: true }
    );

    if (!following) {
      throw new Error(`User with id ${followingId} was not found`);
    }

    return follower;
  }

  async getUsersByString(searchString, currentUserId) {
    const users = await UserModel.find({
      $and: [
        {
          $or: [
            { firstName: { $regex: new RegExp(searchString, "i") } },
            { secondName: { $regex: new RegExp(searchString, "i") } },
          ],
        },
        { _id: { $ne: currentUserId } },
      ],
    });
    return users;
  }

  async getUserById(userId) {
    const user = await UserModel.findById(userId);
    return user;
  }

  async getUsersWithSubscriptionCheck(userId, searchString) {
    const users = await UserModel.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { firstName: { $regex: new RegExp(searchString, "i") } },
                { secondName: { $regex: new RegExp(searchString, "i") } },
              ],
            },
            { _id: { $ne: new ObjectId(userId) } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", new ObjectId(userId)] }, // Match the condition
              },
            },
          ],
          as: "curUser",
        },
      },
      {
        $unwind: "$curUser",
      },
      {
        $addFields: {
          isSubscribing: { $in: ["$_id", "$curUser.following"] },
        },
      },
      {
        $project: {
          orderDetails: 0,
        },
      },
    ]);
    return users;
  }
}

module.exports = new UserService();
