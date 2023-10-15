const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
    senderId: { type: Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Message", messageSchema);
