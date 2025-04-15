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

  public async get(userId: string) {
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
