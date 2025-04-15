import { prisma } from "../libs/dbConnection";

class GameService {
  public async create(inputData: any) {
    try {
      // const data = new
      const nData: any = await prisma.game.create(inputData);
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

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async update(gameId: string, inputData: any) {
    try {
      const data: any = await prisma.game.update({
        where: {
          id: gameId
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
