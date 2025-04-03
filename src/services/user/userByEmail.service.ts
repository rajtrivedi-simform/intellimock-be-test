import prisma from "../../configs/db";

export const getUserByEmail = async (userEmail: string) => {
  const user = prisma.user.findUnique({
    where: {
      userEmail: userEmail,
    },
  });

  return user;
};
