import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import { PORT } from "./config.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});

app.use(morgan("dev"));
app.use(cors());

io.on("connection", (socket) => {
  socket.on("message", (message) => {
    socket.broadcast.emit("message", {
      body: message,
      from: socket.id,
    });
  });
});

app.use(express.static(join(__dirname, "../client/dist")));

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
