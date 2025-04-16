import express, { Express, NextFunction } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 9000;

const httpServer: any = createServer(app);
const io: any = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

interface CustomSocket extends Socket {
  user?: {
    user_id?: string;
    type_id?: string;
    roomId?: string;
  };
}

interface SinglePlayerInfo {
  user_id: string;
  type_id: string;
  roomId?: string;
}

const playerOnline: Record<string, SinglePlayerInfo> = {};

io.use((socket: CustomSocket, next: NextFunction) => {
  if (socket) {
    const { userId, typeId } = socket.handshake.query;
    const user_id: string = String(userId);
    const type_id: string = String(typeId);

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
        promotion,
        game
      }: {
        from: string;
        to: string;
        promotion: string;
        game: any;
      }) => {
        const roomId: any = playerOnline[socket.id]?.roomId;
        if (!roomId) {
          return;
        }
        socket.to(roomId).emit("move", {
          from,
          to,
          promotion,
          game: {
            fen: game.fen, // FEN for current board state
            pgn: game.pgn // PGN for move history
          }
        });
      }
    );
  }

  // ✅ Always emit message when a player joins
  if (playerOnline[socket.id] && playerOnline[socket.id].roomId) {
    io.to(playerOnline[socket.id].roomId).emit("message", "Hello world");
  }
  const room: any = io.sockets.adapter.rooms.get(
    playerOnline[socket.id].roomId
  );

  if (room && room.size === 2) {
    const userIdByRoomId: string | undefined =
      playerOnline[socket.id].roomId?.split("-")[0];
    io.to(playerOnline[socket.id].roomId).emit("gameStart", {
      state: true,
      firstUser: userIdByRoomId?.toString()
    });
  }

  // ✅ Always set up  "move" event for EVERY user

  socket.on("disconnect", (reason: any) => {
    console.log(`User disconnected (${socket.id}):`, reason);
    delete playerOnline[socket.id];
  });
});

export { app, httpServer, PORT };
