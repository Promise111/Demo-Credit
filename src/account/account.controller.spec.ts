import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

describe('AccountController', () => {
  let controller: AccountController;
  const mockAccountService = {
    getWallet: jest.fn((dto) => {
      return {
        email: 'johndoe@yahoo.com',
        firstName: 'john',
        lastName: 'doe',
        balance: 2000,
        account_number: '0135648688',
      };
    }),
    fundWallet: jest.fn((user, dto) => {
      return {
        wallet_balance: user.balance + dto.amount,
        depositedAmount: dto.amount,
      };
    }),
    withdrawFromWallet: jest.fn((user, dto) => {
      return {
        wallet_balance: user.balance - dto.amount,
        amountWithdrawn: dto.amount,
      };
    }),
    transferFromWallet: jest.fn((user, dto) => {
      return { amountTransfered: dto.amount, receiverId: 2 };
    }),
    getHistory: jest.fn((dto) => {
      return [];
    }),
  };
  const user1 = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@yahoo.com',
    account_number: '0135648688',
    balance: 2000,
    password: 'jDpword',
  };
  const user2 = {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'janedoe@yahoo.com',
    account_number: '0233648699',
    balance: 5000,
    password: 'janeDpword',
  };
  const fundOrWithdraw = { amount: 500 };
  const transfer = {
    amount: 500,
    account_number: '0233648699',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService],
    })
      .overrideProvider(AccountService)
      .useValue(mockAccountService)
      .compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get account', () => {
    it('should return user account', () => {
      expect(controller.getWallet(user1)).toEqual({
        email: 'johndoe@yahoo.com',
        firstName: 'john',
        lastName: 'doe',
        balance: expect.any(Number),
        account_number: expect.stringMatching('0135648688'),
      });
    });
  });

  describe('fund user wallet', () => {
    it('should deposit funds into user wallet', () => {
      expect(controller.fundWallet(user1, fundOrWithdraw)).toEqual({
        wallet_balance: user1.balance + fundOrWithdraw.amount,
        depositedAmount: fundOrWithdraw.amount,
      });
    });
  });

  describe('withdraw from wallet', () => {
    it('should withdraw a fixed sum from wallet', () => {
      expect(controller.withdrawFromWallet(user1, fundOrWithdraw)).toEqual({
        wallet_balance: user1.balance - fundOrWithdraw.amount,
        amountWithdrawn: fundOrWithdraw.amount,
      });
    });
  });

  describe('transfer funds', () => {
    it('should tranfer funds between users', () => {
      expect(controller.transferFromWallet(user1, transfer)).toEqual({
        amountTransfered: transfer.amount,
        receiverId: 2,
      });
    });
  });

  describe('get user transaction history', () => {
    it('should return array of transactions', () => {
      expect(controller.getHistory(user1)).toEqual([]);
    });
  });
});
