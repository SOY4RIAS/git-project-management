import { NextFunction, Request, Response } from 'express';

import * as http from '../constants/http';
import { UserService } from './../services/UserService';
import { AuthService } from './../services/AuthService';
import { LoginRequest } from './../typings/RequestsInterfaces';

export class UsersController {
  private authService = new AuthService();

  login(req: LoginRequest, res: Response) {
    const { mail, password } = req.body;

    this.authService
      .login(mail, password)
      .then((token) => {
        res.json({ token });
      })
      .catch((err) => {
        res.status(http.UNAUTHORIZED).json({ err });
      });
  }
}
