const { Schema, model } = require("mongoose");

const chatSchema = new Schema({
  firstUserId: { type: Schema.Types.ObjectId, ref: "User" },
  secondUserId: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Chat", chatSchema);
