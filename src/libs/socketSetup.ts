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
  name?: string;
  email?: string;
}

const playerOnline: Record<string, SinglePlayerInfo> = {};

io.use((socket: CustomSocket, next: NextFunction) => {
  if (socket) {
    const { userId, typeId, name, email } = socket.handshake.query;
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
        roomId: searchOpponent.roomId,
        name: String(name),
        email: String(email)
      };
      socket.join(searchOpponent.roomId);
    } else {
      playerOnline[socket?.id] = {
        user_id,
        type_id,
        name: String(name),
        email: String(email)
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
    io.to(playerOnline[socket.id].roomId).emit(
      "message",
      `${playerOnline[socket.id].name} joined the game`
    );
  }
  const room: any = io.sockets.adapter.rooms.get(
    playerOnline[socket.id].roomId
  );

  if (room && room.size === 2) {
    const [socketId1, socketId2]: string[] = Array.from(room);
    const player1: SinglePlayerInfo = playerOnline[socketId1];
    const player2: SinglePlayerInfo = playerOnline[socketId2];

    const socket1: Socket = io.sockets.sockets.get(socketId1);
    const socket2: Socket = io.sockets.sockets.get(socketId2);

    socket1?.emit("gameStart", {
      state: true,
      firstUser: player1?.user_id,
      opponentName: player2?.name,
      opponentEmail: player2?.email
    });

    socket2?.emit("gameStart", {
      state: true,
      firstUser: player1?.user_id,
      opponentName: player1?.name,
      opponentEmail: player1?.email
    });
  }

  // ✅ Always set up  "move" event for EVERY user

  socket.on("quit-event", () => {
    const roomId: string | undefined = playerOnline[socket.id]?.roomId;
    const userId: string | undefined = playerOnline[socket.id]?.user_id;

    if (roomId) {
      socket.to(roomId).emit("quit-event", {
        state: false,
        message: "Opponent left the game",
        userId: userId
      });
      socket.leave(roomId);
    }
    delete playerOnline[socket.id];
  });

  socket.on("disconnect", (reason: any) => {
    const roomId: string | undefined = playerOnline[socket.id]?.roomId;
    const userId: string | undefined = playerOnline[socket.id]?.user_id;
    if (roomId) {
      const room: any = io.sockets.adapter.rooms.get(roomId);
      if (room && room.size === 1) {
        io.to(roomId).emit("quit-event", {
          state: false,
          message: "Opponent left the game",
          userId: userId
        });
        socket.leave(roomId);
      }
    }
    console.log("User disconnected", socket.id, reason);
    delete playerOnline[socket.id];
  });
});

export { app, httpServer, PORT };
