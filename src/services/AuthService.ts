import { getRepository } from 'typeorm';

import { Users } from '../entity/Users';
import * as bcryptjs from 'bcryptjs';

import * as jwt from 'jsonwebtoken';

export class AuthService {
  private userRepository = getRepository(Users);

  async login(mail: string, pass: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { mail },
    });

    const validPass = bcryptjs.compareSync(pass, user.password);

    if (validPass) {
      return this.signToken(user);
    }

    throw Error('INVALID_PASSWORD');
  }

  private signToken(user: Users) {
    const SeedToken = process.env.SEED_TOKEN;

    if (!SeedToken) {
      throw Error('TOKEN_NOT_FOUND');
    }

    const expireDate = new Date();

    /// Set the expire date to one week
    const DAYS_TO_EXPIRE = 7;
    expireDate.setDate(expireDate.getDate() + DAYS_TO_EXPIRE);

    const payload = {
      user: {
        id: user.id,
      },
    };

    return jwt.sign(payload, SeedToken, { expiresIn: expireDate.getTime() });
  }

  public static verifyToken(token: string): Promise<boolean> {
    const SeedToken = process.env.SEED_TOKEN;

    if (!SeedToken) {
      throw Error('TOKEN_NOT_FOUND');
    }

    return new Promise((resolve, reject) => {
      jwt.verify(token, SeedToken, (err, decoded: any) => {
        if (err) {
          return reject(false);
        }

        if (!decoded?.user?.id) {
          return reject(false);
        }

        resolve(true);
      });
    });
  }
}
