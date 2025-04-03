import { Request, Response } from "express";
import { getUserByEmail } from "../services/user/userByEmail.service";
import { apiResponseHandler } from "../utils/apiResponse";
import bcrypt from "bcrypt";
import prisma from "../configs/db";
import { userCreation } from "../services/user/userCreation.service";

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword) {
      return apiResponseHandler(
        res,
        400,
        "Email and Password are required for Login"
      );
    }

    const user = await getUserByEmail(userEmail);

    if (!user) {
      return apiResponseHandler(
        res,
        404,
        `No user found with email: ${userEmail}`
      );
    }

    const isPasswordValid = userPassword == user.userPassword;

    if (!isPasswordValid) {
      console.log(userPassword, user);
      return apiResponseHandler(res, 400, "Invalid Credentials");
    }

    return apiResponseHandler(res, 200, "Login Successful!");
  } catch (error) {
    return apiResponseHandler(res, 500, "Internal Server Error!");
  }
};

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { userEmail, userPassword, confirmPassword, userFullName } = req.body;

    if (!userEmail || !userPassword || !confirmPassword || !userFullName) {
      return apiResponseHandler(
        res,
        400,
        "E-Mail, Password and FullName are required for Registeration"
      );
    }

    const userInstance = await getUserByEmail(userEmail);

    if (userInstance) {
      return apiResponseHandler(res, 400, "Email already exists!");
    }

    const newUser = userCreation(userEmail, userPassword, userFullName);
    
  } catch (e) {
    console.error(e);
    return apiResponseHandler(res, 500, "Internal Server Error!");
  }
};
