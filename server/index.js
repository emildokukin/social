const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const postsRouter = require("./routes/post");

const TunedWebSocket = require("./websocket/TunedWebSocket");
const createHttpServer = require("./http/httpServer");
require("dotenv").config();

const PORT = process.env.PORT || 5001;
const app = express();

const wss = new TunedWebSocket();
const server = createHttpServer(app, wss);

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use("/api", userRouter);
app.use("/api", postsRouter);

async function start() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
