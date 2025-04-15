import { prisma } from "../libs/dbConnection";
import { GameCreatePayload } from "../types/gameTypes";
import { NotFoundException } from "../utils/CustomExceptions";

class GameService {
  public async create(inputData: GameCreatePayload) {
    try {
      // const data = new
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
