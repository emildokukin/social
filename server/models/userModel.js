const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  secondName: { type: String },
  avatarImage: { type: String },
  profileImages: [{ type: String }],
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationCode: { type: String },
  followers: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  following: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
});

module.exports = model("User", UserSchema);
