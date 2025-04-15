import { tableManipulationTypeType } from "./commonTypes";

export type GameTableType = {
  id: string;
  playerOneId: string;
  playerTwoId: string;
  gametypeId: string;
  winnerId: string;
  totalTime: number;
  playerOneColor: string;
  playerTwoColor: string;
  matchCompleted: string;
} & tableManipulationTypeType;

export type GameCreatePayload = {
  playerOneId: string;
  playerTwoId: string;
  gametypeId: string;
  playerOneColor: string;
  playerTwoColor: string;
};

export type GameUpdatePayload = {
  id: string;
  playerOneId?: string;
  playerTwoId?: string;
  gametypeId?: string;
  winnerId?: string;
  totalTime?: number;
  playerOneColor?: string;
  playerTwoColor?: string;
  matchCompleted?: string;
};
