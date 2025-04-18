import { tableManipulationTypeType } from "./commonTypes";
import { z } from "zod";

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

export const GameCreateZodSchema: any = z.object({
  playerOneId: z.string().nonempty(),
  playerTwoId: z.string().nonempty(),
  gametypeId: z.string().nonempty()
});

export const GameUpdateZodSchema: any = z.object({
  id: z.string().nonempty(),
  playerOneId: z.string().optional(),
  playerTwoId: z.string().optional(),
  gametypeId: z.string().optional(),
  winnerId: z.string().optional(),
  totalTime: z.number().optional(),
  playerOneColor: z.string().optional(),
  playerTwoColor: z.string().optional(),
  matchCompleted: z.boolean().optional()
});
