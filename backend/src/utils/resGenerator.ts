import { Response } from "express";

const resGenerator = (
  res: Response,
  statusCode: number,
  status: string,
  message: string,
) => {
  return res.status(statusCode).json({
    status,
    message,
  });
};

export default resGenerator;
