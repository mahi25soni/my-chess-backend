import express, { Express, NextFunction } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import GameService from "../services/GameService";

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
  readyToPlay?: boolean;
  alreadyInGame?: boolean;
  gameId?: string | null;
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
      return (
        player.readyToPlay &&
        !player.alreadyInGame &&
        player.user_id !== user_id &&
        player.type_id === type_id
      );
    });

    if (searchOpponent && searchOpponent.roomId) {
      playerOnline[socket?.id] = {
        user_id,
        type_id,
        roomId: searchOpponent.roomId,
        name: String(name),
        email: String(email),
        readyToPlay: true,
        alreadyInGame: false,
        gameId: null
      };
      socket.join(searchOpponent.roomId);
    } else {
      playerOnline[socket?.id] = {
        user_id,
        type_id,
        name: String(name),
        email: String(email),
        readyToPlay: true,
        alreadyInGame: false,
        gameId: null
      };

      const roomId: string = `${socket.id}-${Date.now()}`;
      playerOnline[socket.id].roomId = roomId;
      socket.join(roomId);
    }

    next();
  } else {
    next(new Error("invalid"));
  }
});

io.on("connection", async(socket: CustomSocket) => {
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

    const gameData: any = await GameService.create({
      playerOneId: player1.user_id,
      playerTwoId: player2.user_id,
      gametypeId: player1.type_id
    });

    console.log("gameData", gameData);

    socket1?.emit("gameStart", {
      state: true,
      firstUser: player1?.user_id,
      opponentName: player2?.name,
      opponentEmail: player2?.email,
      opponentId: player2?.user_id
    });

    socket2?.emit("gameStart", {
      state: true,
      firstUser: player1?.user_id,
      opponentName: player1?.name,
      opponentEmail: player1?.email,
      opponentId: player1?.user_id
    });

    player1.alreadyInGame = true;
    player2.alreadyInGame = true;
    player1.gameId = gameData.id;
    player2.gameId = gameData.id;
  }

  // ✅ Always set up  "move" event for EVERY user

  socket.on("quit-event", (message: string) => {
    const roomId: string | undefined = playerOnline[socket.id]?.roomId;
    const userId: string | undefined = playerOnline[socket.id]?.user_id;

    const [socketId1, socketId2]: string[] = Array.from(room);

    if (
      roomId &&
      socketId1 &&
      socketId2 &&
      playerOnline[socketId1]?.readyToPlay &&
      playerOnline[socketId2]?.readyToPlay
    ) {
      socket.to(roomId).emit("quit-event", {
        state: false,
        message: message,
        userId: userId
      });
      socket.leave(roomId);
    }
    delete playerOnline[socket.id];

    if (socketId1 && socketId2) {
      const opponentSocketId: string =
        socket.id === socketId1 ? socketId2 : socketId1;
      playerOnline[opponentSocketId].readyToPlay = false;
      playerOnline[opponentSocketId].gameId = null;
    }
  });

  socket.on("game-over", async(data: any) => {
    const [socketId1, socketId2]: string[] = Array.from(room);
    const player1: SinglePlayerInfo = playerOnline[socketId1];
    const player2: SinglePlayerInfo = playerOnline[socketId2];

    console.log("game-over", data);

    const updateGame: any = await GameService.update({
      id: player1.gameId,
      winnerId: data.winner.id,
      matchCompleted: true
    });

    player1.readyToPlay = false;
    player2.readyToPlay = false;
    player1.gameId = null;
    player2.gameId = null;

    console.log("updateGame", updateGame);
  });
  socket.on("new-match", () => {
    if (playerOnline[socket.id]) {
      playerOnline[socket.id].readyToPlay = true;
      playerOnline[socket.id].alreadyInGame = false;
    }
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
