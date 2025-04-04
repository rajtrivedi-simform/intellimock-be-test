import prisma from "../../configs/db";
import argon2 from "argon2";
import { v4 as uuid } from "uuid";

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
        userPassword: hashedPassword,
        userFullName: userFullName,
      },
    });

    return userInstance;
  } catch (error) {
    throw new Error("Error creating user!!");
  }
};

const generateHashPassword = async (password: string) => {
  return await argon2.hash(password, { type: argon2.argon2i });
};
