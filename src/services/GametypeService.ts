import { prisma } from "../libs/dbConnection";

class GametypeService {
  public async get() {
    try {
      const data: any = await prisma.gametype.findMany();
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new GametypeService();
