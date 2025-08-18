const socket = require("socket.io");
const Chat = require("../models/chat");
const connectionRequest = require("../models/connectionRequest");
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //hand events
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log("joining room :" + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const roomId = [userId, targetUserId].sort().join("_");
          console.log(firstName + " " + text);
          // connectionRequest.findOne({
          //   fromUserId: userId,
          //   targetUserId,
          //   status: "accepted",
          // });

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({ senderId: userId, text });
          io.to(roomId).emit("messageReceived", {
            firstName,
            text,
            senderId: userId,
          });

          await chat.save();
        } catch (error) {
          console.log(error);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
