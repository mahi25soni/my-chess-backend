import { tableManipulationTypeType } from "./commonTypes";
import { z } from "zod";

export type GameTableType = {
  id: string;
  playerOneId: string;
  playerTwoId: string;
  gametypeId: string;
  winnerId?: string;
  playerOneColor?: string;
  playerTwoColor?: string;
  colorWon?: string;
  fen?: string;
  pgn?: string;
  gameHistory: string[];
  matchCompleted: boolean;
  startedAt?: Date;
  finishedAt?: Date;
} & tableManipulationTypeType;

export type GameCreatePayload = {
  playerOneId: string;
  playerTwoId: string;
  gametypeId: string;
  playerOneColor?: string;
  playerTwoColor?: string;
  colorWon?: string;
  fen?: string;
  pgn?: string;
  gameHistory: string[];
  matchCompleted?: boolean;
  startedAt?: Date;
  finishedAt?: Date;
};

export type GameUpdatePayload = {
  id: string;
  playerOneId?: string;
  playerTwoId?: string;
  gametypeId?: string;
  winnerId?: string;
  playerOneColor?: string;
  playerTwoColor?: string;
  colorWon?: string;
  fen?: string;
  pgn?: string;
  gameHistory?: string[];
  matchCompleted?: boolean;
  startedAt?: Date;
  finishedAt?: Date;
};

export const GameCreateZodSchema: any = z.object({
  playerOneId: z.string().nonempty(),
  playerTwoId: z.string().nonempty(),
  gametypeId: z.string().nonempty(),
  playerOneColor: z.string().optional(),
  playerTwoColor: z.string().optional(),
  colorWon: z.string().optional(),
  fen: z.string().optional(),
  pgn: z.string().optional(),
  gameHistory: z.array(z.string()).optional(),
  matchCompleted: z.boolean().optional(),
  startedAt: z.date().optional(),
  finishedAt: z.date().optional()
});

export const GameUpdateZodSchema: any = z.object({
  id: z.string().nonempty(),
  playerOneId: z.string().optional(),
  playerTwoId: z.string().optional(),
  gametypeId: z.string().optional(),
  winnerId: z.string().optional(),
  playerOneColor: z.string().optional(),
  playerTwoColor: z.string().optional(),
  colorWon: z.string().optional(),
  fen: z.string().optional(),
  pgn: z.string().optional(),
  gameHistory: z.array(z.string()).optional(),
  matchCompleted: z.boolean().optional(),
  startedAt: z.date().optional(),
  finishedAt: z.date().optional(),
  totalTime: z.number().optional()
});
