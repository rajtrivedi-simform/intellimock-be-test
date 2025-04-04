import { Response } from "express";
import { apiResponse } from "../constants/types/apiResponse";

export const apiResponseHandler = (
  res: Response,
  status: number,
  msg: string,
  data?: any
) => {
  return res.status(status).json({
    success: status < 400,
    status: status,
    msg: msg,
    data: data || null,
  } as apiResponse);
};
