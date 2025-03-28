import express, { Express, NextFunction } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 9000;

const httpServer: any = createServer(app);
const io: any = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"]
  }
});

interface CustomSocket extends Socket {
  user?: {
    user_id?: number;
    type_id?: number;
    roomId?: string;
  };
}

interface SinglePlayerInfo {
  user_id: number;
  type_id: number;
  roomId?: string;
}

const playerOnline: Record<string, SinglePlayerInfo> = {};

io.use((socket: CustomSocket, next: NextFunction) => {
  if (socket) {
    const { userId, typeId } = socket.handshake.query;
    const user_id: number = Number(userId);
    const type_id: number = Number(typeId);

    const searchOpponent: SinglePlayerInfo | undefined = Object.values(
      playerOnline
    ).find((player: SinglePlayerInfo) => {
      return player.user_id !== user_id && player.type_id === type_id;
    });
    if (searchOpponent && searchOpponent.roomId) {
      playerOnline[socket?.id] = {
        user_id,
        type_id,
        roomId: searchOpponent.roomId
      };
      socket.join(searchOpponent.roomId);
    } else {
      playerOnline[socket?.id] = {
        user_id,
        type_id
      };
      const roomId: string = `${playerOnline[socket.id].user_id}-${playerOnline[socket.id].type_id}`;
      playerOnline[socket.id].roomId = roomId;
      socket.join(roomId);
    }

    next();
  } else {
    next(new Error("invalid"));
  }
});

io.on("connection", (socket: CustomSocket) => {
  if (playerOnline[socket.id] && playerOnline[socket.id].roomId) {
    socket.on(
      "move",
      ({
        from,
        to,
        promotion
      }: {
        from: string;
        to: string;
        promotion: string;
      }) => {
        const roomId: any = playerOnline[socket.id]?.roomId;
        if (!roomId) {
          return;
        }
        socket.to(roomId).emit("move", { from, to, promotion });
      }
    );
  }

  // ✅ Always emit message when a player joins
  if (playerOnline[socket.id] && playerOnline[socket.id].roomId) {
    io.to(playerOnline[socket.id].roomId).emit("message", "Hello world");
  }

  // ✅ Always set up  "move" event for EVERY user

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete playerOnline[socket.id];
  });
});

export { app, httpServer, PORT };
