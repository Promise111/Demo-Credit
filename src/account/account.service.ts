import { BadRequestException, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { User } from '../utils/constants';
import { DepositDto, TransferDto } from './dto';

@Injectable()
export class AccountService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async getWallet(authUser: User) {
    try {
      const { id, ...userData } = authUser;
      const wallet: any[] = await this.knex('wallets')
        .where({ id: authUser.id })
        .select('*');
      // balance is divided by 100 because wallet balance is stored in the smallest unit of the nigerian currency (Kobo)
      let data = {
        ...userData,
        balance: wallet[0]['balance'] / 100,
        account_number: wallet[0]['account_number'],
      };
      return { message: 'Record returned successfully', data };
    } catch (error) {
      throw error;
    }
  }

  async fundWallet(authUser: User, dto: DepositDto) {
    try {
      const amountInKobo = dto.amount * 100;
      await this.knex('wallets')
        .where({ id: authUser.id })
        .increment('balance', amountInKobo);

      const updatedWallet: any[] = await this.knex('wallets')
        .where({ id: authUser.id })
        .select('*');
      await this.knex('transactions').insert({
        transaction_type: 'deposit',
        amount: amountInKobo,
        sender_id: authUser.id,
      });
      return {
        message: 'Wallet funded successfully',
        data: {
          wallet_balance: updatedWallet[0]['balance'] / 100,
          depositedAmount: dto.amount,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async withdrawFromWallet(authUser: User, dto: DepositDto) {
    try {
      const amountInKobo = dto.amount * 100;
      await this.knex('wallets')
        .where({ id: authUser.id })
        .decrement('balance', amountInKobo);

      const updatedWallet: any[] = await this.knex('wallets')
        .where({ id: authUser.id })
        .select('*');
      await this.knex('transactions').insert({
        transaction_type: 'withdrawal',
        amount: amountInKobo,
        receiver_id: authUser.id,
      });
      return {
        message: 'Wallet withdrawal successful',
        data: {
          wallet_balance: updatedWallet[0]['balance'] / 100,
          amountWithdrawn: dto.amount,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async transferFromWallet(authUser: User, dto: TransferDto) {
    try {
      const amountInKobo = dto.amount * 100;
      const transferorWalletBalance: number = await this.knex('wallets')
        .where({ id: authUser.id })
        .select('balance');

      if (amountInKobo > transferorWalletBalance[0]['balance']) {
        throw new BadRequestException(
          'Transfer not successful, insufficient balance in wallet',
        );
      }
      const transfereeWallet: any[] = await this.knex('wallets')
        .where({ account_number: dto.account_number })
        .select('user_id', 'balance');

      if (!transfereeWallet[0]?.user_id) {
        throw new BadRequestException('Invalid account number');
      }

      const transferee: any = await this.knex
        .select(
          'users.id',
          'users.firstName',
          'users.lastName',
          'users.email',
          'wallets.balance',
          'wallets.account_number',
          'wallets.user_id',
          // '*'
        )
        .from('users')
        .innerJoin('wallets', 'users.id', 'wallets.user_id')
        .where('wallets.user_id', transfereeWallet[0]?.user_id);

      if (authUser.id === transferee[0]['id']) {
        throw new BadRequestException(
          'Can not initiate transfer to own account',
        );
      }

      // transaction to ensure ACID for cash transfer
      await this.knex.transaction(async (trx) => {
        await trx('wallets')
          .where({ id: authUser.id })
          .decrement('balance', amountInKobo);

        await trx('wallets')
          .where({ id: transfereeWallet[0]?.user_id })
          .increment('balance', amountInKobo);

        await trx('transactions').insert({
          sender_id: authUser.id,
          receiver_id: transfereeWallet[0]?.user_id,
          transaction_type: 'transfer',
          amount: amountInKobo,
        });
      });
      return {
        message: 'Transfer successful',
        data: {
          amountTransfered: amountInKobo / 100,
          receiverId: transfereeWallet[0]?.user_id,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getHistory(authUser: User) {
    try {
      const history: any[] = await this.knex('transactions')
        .where({
          sender_id: authUser.id,
        })
        .orWhere({
          receiver_id: authUser.id,
        })
        .select('*');

      // converted amount in Kobo to Naira
      const formattedHistory = history.map((h) => {
        h['amount'] = h['amount'] / 100;
        return h;
      });
      return { message: 'Records fetched', data: formattedHistory };
    } catch (error) {
      throw error;
    }
  }
}
