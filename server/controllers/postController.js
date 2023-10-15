const PostService = require("../services/PostService");

class PostController {
    
  async getMyPosts(req, res, next) {
    try {
      const userId = req.params.userId;

      const posts = await PostService.getPostsOfUserFollowings(userId);
      return res.json(posts);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async getPostsOfUserFollowings(req, res, next) {
    try {
      const userId = req.user._id;

      const posts = await PostService.getPostsOfUserFollowings(userId);
      return res.json(posts);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async createPost(req, res, next) {
    try {
      const userId = req.user._id;
      const postText = req.body.postText;
      const images = req.files ? req.files.map((file) => file.path) : [];

      const post = {
        userId,
        postText,
        images,
      };

      const newPost = await PostService.createPost(post);
      return res.json(newPost);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async deletePost(req, res, next) {
    try {
      const userId = req.user._id;
      const postId = req.params.postId;

      const postToDelete = await PostService.deletePost(postId, userId);

      return res.json(postToDelete);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async likePost(req, res, next) {
    try {
      const userId = req.user._id;
      const postId = req.params.postId;

      const likedPost = await PostService.likePost(userId, postId);

      return res.json(likedPost);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async unlikePost(req, res, next) {
    try {
      const userId = req.user._id;
      const postId = req.params.postId;

      const unlikedPost = await PostService.unlikePost(userId, postId);

      return res.json(unlikedPost);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async getUserPosts(req, res, next) {
    try {
      const curUserId = req.user._id;
      const userId = req.params.userId;

      const posts = await PostService.getUserPosts(userId, curUserId);

      return res.json(posts);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

module.exports = new PostController();
