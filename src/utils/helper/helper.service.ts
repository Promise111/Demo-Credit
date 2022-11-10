import { Global, Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  constructor() {}

  generateUniqueAccountNumber(id: number): string {
    const randomDigits: string = Math.random().toString().substr(2, 10);
    let accountNumber: string = `0${id}${randomDigits}`.slice(0, 10);
    return accountNumber;
  }
}
