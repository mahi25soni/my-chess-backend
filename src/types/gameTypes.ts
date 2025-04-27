import { tableManipulationTypeType } from "./commonTypes";

export type GameTableType = {
  id: number;
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
