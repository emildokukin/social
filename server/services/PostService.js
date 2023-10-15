const PostModel = require("../models/postModel");
const { ObjectId } = require("mongodb");
const UserModel = require("../models/userModel");

class PostService {
  async createPost(post) {
    const newPost = await PostModel.create(post);
    return newPost;
  }

  async getUserPosts(userId, curUserId) {
    const posts = await UserModel.aggregate([
      {
        $match: { _id: new ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          let: { following: "$following", curId: "$_id" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$curId"] } } }],
          as: "followers",
        },
      },
      { $unwind: "$followers" },
      { $replaceRoot: { newRoot: "$followers" } },
      {
        $lookup: {
          from: "posts",
          let: { id: "$_id" },
          pipeline: [{ $match: { $expr: { $eq: ["$userId", "$$id"] } } }],
          as: "post",
        },
      },
      { $unwind: "$post" },
      {
        $addFields: {
          "post.isLiked": {
            $in: [new ObjectId(curUserId), "$post.likes"],
          },
        },
      },
      {
        $project: { _id: 1, firstName: 1, avatarImage: 1, post: 1, isLiked: 1 },
      },
    ]).sort({ "post.createdAt": -1 });
    return posts;
  }

  async getPostsOfUserFollowings(userId) {
    const posts = await UserModel.aggregate([
      {
        $match: { _id: new ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          let: { following: "$following", curId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $in: ["$_id", "$$following"] },
                    { $eq: ["$_id", "$$curId"] },
                  ],
                },
              },
            },
          ],
          as: "followers",
        },
      },
      { $unwind: "$followers" },
      { $replaceRoot: { newRoot: "$followers" } },
      {
        $lookup: {
          from: "posts",
          let: { id: "$_id" },
          pipeline: [{ $match: { $expr: { $eq: ["$userId", "$$id"] } } }],
          as: "post",
        },
      },
      { $unwind: "$post" },
      {
        $addFields: {
          "post.isLiked": {
            $in: [new ObjectId(userId), "$post.likes"],
          },
        },
      },
      {
        $project: { _id: 1, firstName: 1, avatarImage: 1, post: 1, isLiked: 1 },
      },
    ]).sort({ "post.createdAt": -1 });
    return posts;
  }

  async deletePost(postId, userId) {
    const postToDelete = await PostModel.findOne({ _id: postId });

    if (!postToDelete) {
      throw new Error(`Post was not found`);
    }

    if (!postToDelete.userId.equals(userId)) {
      throw new Error(`A post can only be deleted by its owner`);
    }

    await PostModel.deleteOne(postToDelete);

    return postToDelete;
  }

  async likePost(userId, postId) {
    const likedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: userId },
      },
      { new: true }
    );

    return likedPost;
  }

  async unlikePost(userId, postId) {
    const unlikedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: userId },
      },
      { new: true }
    );

    return unlikedPost;
  }
}

module.exports = new PostService();
