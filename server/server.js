import { ApolloServer } from "@apollo/server";
import { expressMiddleware  } from "@apollo/server/express4";
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "OPTIONS"],
}));
app.use(express.json());

app.use("/graphql", expressMiddleware(server));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

let groupChats = {}; 

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinGroup", (groupName) => {
    socket.join(groupName);
    console.log(`${socket.id} joined group: ${groupName}`);
    socket.emit("message", `Welcome to the group: ${groupName}`);
  });

  socket.on("sendMessage", ({ groupName, username, message }) => {
    console.log(`Message in ${groupName} from ${username}: ${message}`);
    io.to(groupName).emit("receiveMessage", { username, message });
  });

  socket.on("updateSong", ({ groupName, songTitle }) => {
    groupChats[groupName] = songTitle; 
    console.log(`Song updated in ${groupName}: ${songTitle}`);
    io.to(groupName).emit("currentSong", { songTitle });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = 4000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}/graphql`);
  console.log(`🔌 Socket.io listening on: http://localhost:${PORT}`);
});