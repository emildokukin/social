const { WebSocketServer } = require("ws");
const MessageModel = require("../models/messageModel");
const ChatModel = require("../models/chatModel");
const { ObjectId } = require("mongodb");

class TunedWebSocket extends WebSocketServer {
  constructor() {
    super({ noServer: true });

    this.on("connection", (ws) => {
      ws.on("message", async (data) => {
        const user = ws.user;
        data = JSON.parse(data);

        this.clients.forEach((client) => {
          if (client?.user._id === data.receiverId) {
            client.send(
              JSON.stringify({
                senderId: user._id,
                receiverId: client?.user._id,
                text: data.text,
              })
            );
          }
        });

        const chat = await ChatModel.findOne({
          $or: [
            {
              firstUserId: user._id,
              secondUserId: data.receiverId,
            },
            {
              firstUserId: data.receiverId,
              secondUserId: user._id,
            },
          ],
        });

        if (!chat) {
          const newChat = await ChatModel.create({
            firstUserId: user._id,
            secondUserId: data.receiverId,
          });
          MessageModel.create({
            userId: newChat._id,
            senderId: user._id,
            receiverId: data.receiverId,
            text: data.text,
          });
          return;
        }

        MessageModel.create({
          chatId: new ObjectId(chat._id),
          senderId: user._id,
          receiverId: data.receiverId,
          text: data.text,
        });
      });
    });
  }
}

module.exports = TunedWebSocket;
