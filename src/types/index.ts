import { Request } from 'express';
import { Account } from 'src/modules/Account/Account.entity';

export type AppRequest = Request & { user: Account };
