const { Router } = require("express");
const userController = require("../controllers/userController");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
const activationMiddleware = require("../middlewares/activationMiddleware");
const imageUpload = require("../utils/multer");

const router = new Router();

router.post(
  "/registration",
  body("email").isEmail().withMessage("Incorrect email format"),
  body("password")
    .isLength({ min: 5, max: 32 })
    .withMessage("Password length must be min 5 max 32 symbols"),
  userController.registration
);

router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get(
  "/users",
  authMiddleware,
  activationMiddleware,
  userController.getUsers
);
router.get(
  "/messages/:receiverId",
  authMiddleware,
  activationMiddleware,
  userController.getMessages
);
router.get(
  "/chatUsers",
  authMiddleware,
  activationMiddleware,
  userController.getAllChattedUsers
);
router.put(
  "/subscribe/:userId",
  authMiddleware,
  activationMiddleware,
  userController.subscribe
);
router.delete(
  "/unsubscribe/:userId",
  authMiddleware,
  activationMiddleware,
  userController.unsubscribe
);
router.get(
  "/getuser/:userId",
  authMiddleware,
  activationMiddleware,
  userController.getUserById
);
router.get(
  "/getusersubs/:searchString",
  authMiddleware,
  activationMiddleware,
  userController.getUsersWithSubscriptionCheck
);
router.patch(
  "/updateprofile",
  authMiddleware,
  activationMiddleware,
  imageUpload.single("avatarImage"),
  userController.updateProfile
);

module.exports = router;
