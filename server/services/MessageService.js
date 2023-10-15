const MessageModel = require("../models/messageModel");
const { ObjectId } = require("mongodb");

class MessageService {
  async getMessages(senderId, receiverId) {
    return await MessageModel.find({
      senderId: { $in: [new ObjectId(senderId), new ObjectId(receiverId)] },
      receiverId: { $in: [new ObjectId(senderId), new ObjectId(receiverId)] },
    });
  }
}

module.exports = new MessageService();
