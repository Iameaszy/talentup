import { NextFunction, Response } from 'express';

export default function methodsFilter(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'methods not allowed' });
  }

  next();
}
