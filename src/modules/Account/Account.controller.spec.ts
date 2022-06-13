import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './Account.controller';
import { AccountService } from './Account.service';

describe('AccountController', () => {
  let appController: AccountController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService],
    }).compile();

    appController = app.get<AccountController>(AccountController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getAccounts()).toBe('Hello World!');
    });
  });
});
