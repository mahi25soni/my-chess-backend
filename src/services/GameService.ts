import { prisma } from "../libs/dbConnection";
import {
  GameCreatePayload,
  GameCreateZodSchema,
  GameUpdateZodSchema
} from "../types/gameTypes";
import {
  ForbiddenException,
  NotFoundException
} from "../utils/CustomExceptions";
import { formatZodError } from "../utils/zodHandling";

class GameService {
  public async create(inputData: GameCreatePayload) {
    try {
      const zodResult: any = GameCreateZodSchema.safeParse(inputData);
      if (!zodResult.success) {
        const message: string = formatZodError(zodResult.error.errors);
        throw new ForbiddenException(message);
      }
      const fPlayerOne: any = await prisma.user.findUnique({
        where: {
          id: inputData?.playerOneId
        }
      });
      if (!fPlayerOne) {
        throw new NotFoundException("This player one does not exists");
      }

      const fPlayerTwo: any = await prisma.user.findUnique({
        where: {
          id: inputData?.playerTwoId
        }
      });
      if (!fPlayerTwo) {
        throw new NotFoundException("This player two does not exists");
      }
      const fGameType: any = await prisma.gametype.findUnique({
        where: {
          id: inputData?.gametypeId
        }
      });
      if (!fGameType) {
        throw new NotFoundException("This game type does not exists");
      }

      const nData: any = await prisma.game.create({
        data: inputData
      });
      return nData;
    } catch (error) {
      throw error;
    }
  }

  public async get(gameId: string) {
    try {
      const data: any = await prisma.game.findUnique({
        where: {
          id: gameId
        }
      });

      if (!data) {
        throw new NotFoundException("This game does not exists");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async update(inputData: any) {
    try {
      const zodResult: any = GameUpdateZodSchema.safeParse(inputData);
      if (!zodResult.success) {
        const message: string = formatZodError(zodResult.error.errors);
        throw new ForbiddenException(message);
      }
      const fGame: any = await prisma.game.findUnique({
        where: {
          id: inputData?.id
        }
      });
      if (!fGame) {
        throw new NotFoundException("This game does not exists");
      }

      if (inputData?.playerOneId) {
        const fPlayerOne: any = await prisma.user.findUnique({
          where: {
            id: inputData?.playerOneId
          }
        });
        if (!fPlayerOne) {
          throw new NotFoundException("This player one does not exists");
        }
      }

      if (inputData?.playerTwoId) {
        const fPlayerOne: any = await prisma.user.findUnique({
          where: {
            id: inputData?.playerTwoId
          }
        });
        if (!fPlayerOne) {
          throw new NotFoundException("This player one does not exists");
        }
      }

      if (inputData?.gametypeId) {
        const fGameType: any = await prisma.gametype.findUnique({
          where: {
            id: inputData?.gametypeId
          }
        });
        if (!fGameType) {
          throw new NotFoundException("This game type does not exists");
        }
      }

      if (inputData?.winnerId) {
        const fWinner: any = await prisma.user.findUnique({
          where: {
            id: inputData?.winnerId
          }
        });
        if (!fWinner) {
          throw new NotFoundException("This winner user does not exists");
        }
      }
      const data: any = await prisma.game.update({
        where: {
          id: inputData?.id
        },
        data: inputData
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async delete(gameId: string) {
    try {
      const fGame: any = await prisma.game.findUnique({
        where: {
          id: gameId
        }
      });

      if (!fGame) {
        throw new NotFoundException("This game does not exists");
      }
      const data: any = await prisma.game.delete({
        where: {
          id: gameId
        }
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getGameByUser(userId: string) {
    try {
      const fUser: any = await prisma.user.findUnique({
        where: {
          id: userId
        }
      });

      if (!fUser) {
        throw new NotFoundException("This user does not exists");
      }
      const data: any = await prisma.game.findMany({
        where: {
          OR: [
            {
              playerOneId: userId
            },
            {
              playerTwoId: userId
            }
          ]
        }
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new GameService();
