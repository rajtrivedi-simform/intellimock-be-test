import prisma from "../../configs/db";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

export const userCreation = async (
  userEmail: string,
  userPassword: string,
  userFullName: string
) => {
  const hashedPassword = await generateHashPassword(userPassword);

  try {
    const userInstance = await prisma.user.create({
      data: {
        id: uuid(),
        userEmail: userEmail,
        userPassword: userPassword,
        userFullName: userFullName,
      },
    });

    return userInstance;
  } catch (error) {
    return "Error Creating User";
  }
};

const generateHashPassword = async (password: string) => {
  let saltRounds: number = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};
