import { PrismaClient } from "@prisma/client";
const prisma: PrismaClient = new PrismaClient();

const getUser: any = async() => {
  const users: any = await prisma.user.findMany();
  console.log(users);
};

getUser();
