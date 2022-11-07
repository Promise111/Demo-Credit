import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    @InjectConnection() private readonly knex: Knex,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.knex('users')
      .where({ email: payload.email })
      .select('id', 'email', 'firstName', 'lastName');
    return user;
  }
}
