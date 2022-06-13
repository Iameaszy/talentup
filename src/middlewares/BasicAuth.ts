import { Injectable, NestMiddleware } from '@nestjs/common';
import { AccountService } from 'src/modules/Account/Account.service';
import { Response, NextFunction } from 'express';
import { AppRequest } from 'src/types';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  constructor(private readonly account: AccountService) {}

  async use(req: AppRequest, res: Response, next: NextFunction) {
    if (
      !req.headers.authorization ||
      req.headers.authorization?.indexOf('Basic ') === -1
    ) {
      return res.status(403).json({ message: 'Missing Authorization Header' });
    }

    const base64Credentials = req.headers.authorization.split(' ')[1];
    const [username, password] =
      Buffer.from(base64Credentials, 'base64').toString('ascii')?.split(':') ||
      [];
    const user = await this.account.findAccount(username, password);
    if (!user) {
      return res
        .status(403)
        .json({ message: 'Invalid Authentication Credentials' });
    }

    // attach user to request object
    req.user = user;

    next();
  }
}
