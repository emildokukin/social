const { Router } = require("express");
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
const activationMiddleware = require("../middlewares/activationMiddleware");
const imageUpload = require("../utils/multer");

const router = new Router();

router.get(
  "/getmyposts",
  authMiddleware,
  activationMiddleware,
  postController.getMyPosts
);
router.get(
  "/getuserposts/:userId",
  authMiddleware,
  activationMiddleware,
  postController.getUserPosts
);
router.get(
  "/getposts",
  authMiddleware,
  activationMiddleware,
  postController.getPostsOfUserFollowings
);
router.post(
  "/createpost",
  authMiddleware,
  activationMiddleware,
  imageUpload.array("images", 5),
  postController.createPost
);
router.delete(
  "/deletepost/:postId",
  authMiddleware,
  activationMiddleware,
  postController.deletePost
);
router.put(
  "/likepost/:postId",
  authMiddleware,
  activationMiddleware,
  postController.likePost
);
router.delete(
  "/unlikepost/:postId",
  authMiddleware,
  activationMiddleware,
  postController.unlikePost
);

module.exports = router;
