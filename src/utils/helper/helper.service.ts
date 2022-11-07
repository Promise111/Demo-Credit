import { Global, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class HelperService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  generateUniqueAccountNumber(id: number): string {
    const randomDigits: string = Math.random().toString().substr(2, 10);
    let accountNumber: string = `0${id}${randomDigits}`.slice(0, 10);
    return accountNumber;
  }
}
