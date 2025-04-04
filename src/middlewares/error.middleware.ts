import { Request, Response } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: Function
) => {
  const statusCode: number = res.statusCode ? res.statusCode : 500;

  res.json({
    status: statusCode,
    message: err.message,
  });
};

export default errorHandler;
