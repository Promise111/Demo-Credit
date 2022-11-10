import { AccountService } from './account.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator';
import { User } from '../utils/constants';
import { DepositDto, TransferDto } from './dto';

@UseGuards(JwtGuard)
@Controller('api/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('')
  getWallet(@GetUser() authUser: User) {
    return this.accountService.getWallet(authUser);
  }

  @Post('deposit')
  fundWallet(@GetUser() authUser: User, @Body() dto: DepositDto) {
    return this.accountService.fundWallet(authUser, dto);
  }

  @Post('withdraw')
  withdrawFromWallet(@GetUser() authUser: User, @Body() dto: DepositDto) {
    return this.accountService.withdrawFromWallet(authUser, dto);
  }

  @Post('transfer')
  transferFromWallet(@GetUser() authUser: User, @Body() dto: TransferDto) {
    return this.accountService.transferFromWallet(authUser, dto);
  }

  @Get('transaction_history')
  getHistory(@GetUser() authUser: User) {
    return this.accountService.getHistory(authUser);
  }
}
