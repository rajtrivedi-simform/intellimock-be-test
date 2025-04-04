//library imports
import { Request, Response } from "express";
import argon2 from "argon2";
import expressAsyncHandler from "express-async-handler";
// Helper Functions Import
import prisma from "../configs/db";
import { apiResponseHandler } from "../utils/api.response";
import { userCreation } from "../services/user/userCreation.service";
import { getUserByEmail } from "../services/user/userByEmail.service";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt/jwt.utils";

export const userLogin = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword) {
      return apiResponseHandler(
        res,
        400,
        "Email & Password are required to Login"
      );
    }

    const userInstance = await prisma.user.findUnique({
      where: {
        userEmail: userEmail,
      },
    });

    if (!userInstance) {
      return apiResponseHandler(res, 400, `No User with ${userEmail} found!`);
    }

    const isValidPassword: boolean = await argon2.verify(
      userInstance.userPassword,
      userPassword
    );

    if (!isValidPassword) {
      return apiResponseHandler(res, 400, "Invalid Credentials");
    }

    const authToken = generateAccessToken({ id: userInstance.id });
    const refreshToken = generateRefreshToken({ id: userInstance.id });

    res.cookie("auth", authToken, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return apiResponseHandler(res, 200, "Login Successful!");
  }
);

export const userRegister = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { userEmail, userPassword, confirmPassword, userFullName } =
        req.body;

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

      if (!newUser) {
        return apiResponseHandler(res, 400, "Error Creating User!");
      }

      return apiResponseHandler(res, 201, "Successfully Created New User!");
    } catch (e) {
      console.error(e);
      return apiResponseHandler(res, 500, "Internal Server Error!");
    }
  }
);
