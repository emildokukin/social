const http = require("http");
const tokenService = require("../services/TokenService");

function onSocketError(err) {
  console.log(err);
}

function authenticate(req, next) {
  const accessToken = req.headers["sec-websocket-protocol"];

  if (!accessToken) {
    next("Access token was not provided", null);
    return;
  }

  const userData = tokenService.validateAccessToken(accessToken);

  if (!userData) {
    next("Invalid access token", null);
    return;
  }

  req.user = userData;

  next(null, userData);
}

const createHttpServer = (expressApp, wss) => {
  const server = http.createServer(expressApp);

  server.on("upgrade", function upgrade(request, socket, head) {

    authenticate(request, function next(err, client) {
      if (err || !client) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }

      socket.removeListener("error", onSocketError);

      wss.handleUpgrade(request, socket, head, function done(ws) {
        ws.user = request.user;
        wss.emit("connection", ws, request, client);
      });
    });
  });

  return server;
};

module.exports = createHttpServer;
