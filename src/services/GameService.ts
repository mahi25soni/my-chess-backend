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
}

export default new GameService();
