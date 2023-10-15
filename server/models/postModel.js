const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    postText: { type: String, required: true },
    images: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Post", PostSchema);
