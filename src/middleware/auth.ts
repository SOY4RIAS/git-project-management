import { Request, NextFunction, Response } from 'express';
import { AuthService } from './../services/AuthService';
import * as http from './../constants/http';

const TokenPrefix = 'Bearer ';

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const unAuthorize = (step: number) => {
    res.status(http.UNAUTHORIZED).json({ err: 'INVALID_TOKEN', step });
  };

  const TOKEN_UNPARSED = req.get('Authorization');

  if (!TOKEN_UNPARSED) {
    return unAuthorize(1);
  }

  if (!TOKEN_UNPARSED.includes(TokenPrefix)) {
    return unAuthorize(2);
  }

  const TOKEN = TOKEN_UNPARSED.replace(TokenPrefix, '');

  try {
    const result = await AuthService.verifyToken(TOKEN);

    if (!result) {
      return unAuthorize(3);
    }

    next();
  } catch (err) {
    unAuthorize(4);
  }
};
