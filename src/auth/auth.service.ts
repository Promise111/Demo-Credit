import { HelperService } from '../utils/helper/helper.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { AuthDto, SigninDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly config: ConfigService,
    private readonly configService: ConfigService,
    private readonly jwt: JwtService,
    private readonly helperService: HelperService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      const { repeatPassword, ...others } = dto;
      if (dto.password !== dto.repeatPassword) {
        throw new BadRequestException(
          'password and repeatPassword do not match',
        );
      }
      const isEmail: any[] = await this.knex('users')
        .where({ email: dto.email })
        .select('id');

      if (isEmail[0]) {
        throw new ConflictException('Duplicate email entry, email is taken');
      }
      let hash = await argon.hash(dto.password);

      // create user
      let user: number[] = await this.knex('users').insert({
        ...others,
        password: hash,
      });

      const account_number: string =
        this.helperService.generateUniqueAccountNumber(user[0]);

      // create wallet
      await this.knex('wallets').insert({ user_id: user[0], account_number });

      return this.signToken(user[0], dto.email);
      // const { password, ...userDetails } = others;
      // return { message: 'Account created successfully', data: userDetails };
    } catch (error) {
      throw error;
    }
  }

  async signin(dto: SigninDto) {
    try {
      const query: any[] = await this.knex('users')
        .where({ email: dto.email })
        .select('*');
      if (!query[0]) throw new ForbiddenException('Credentials incorrect');
      const isPassword = argon.verify(query[0]['password'], dto.password);

      if (!isPassword) throw new ForbiddenException('Credentials incorrect');

      return this.signToken(query[0]['id'], query[0]['email']);
    } catch (error) {
      throw error;
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    try {
      const payload: { userId: number; email: string } = { userId, email };
      const secret = this.configService.get('JWT_SECRET');
      const token: string = await this.jwt.signAsync(payload, {
        expiresIn: '20m',
        secret,
      });
      return { access_token: token };
    } catch (error) {
      throw error;
    }
  }
}
