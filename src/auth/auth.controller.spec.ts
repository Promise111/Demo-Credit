import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    signup: jest.fn((dto) => {
      if (dto.password !== dto.repeatPassword) {
        return {
          statusCode: 400,
          message: 'password and repeatPassword do not match',
          error: 'Bad Request',
        };
      } else {
        return { access_token: 'token' };
      }
    }),
    signin: jest.fn((dto) => {
      return { access_token: 'token' };
    }),
  };
  const mockJwtStrategy = {};
  const userCred = {
    firstName: 'Promise',
    lastName: 'Ihunna',
    email: 'pihunna@gmail.com',
    password: 'password123',
    repeatPassword: 'password123',
  };
  const userCredIncorrectPass = {
    firstName: 'Promise',
    lastName: 'Ihunna',
    email: 'pihunna@gmail.com',
    password: 'password123',
    repeatPassword: 'password1234',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(JwtStrategy)
      .useValue(mockJwtStrategy)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('user signup', () => {
    it('should signup a user', () => {
      expect(controller.signup(userCred)).toEqual({
        access_token: expect.any(String),
      });
    });

    it('should return 400 if passwords do not match', () => {
      expect(
        controller.signup(userCredIncorrectPass),
      ).toEqual({
        statusCode: expect.any(Number),
        message: 'password and repeatPassword do not match',
        error: 'Bad Request',
      });
    });
  });

  describe('user should signin', () => {
    const dto = {
      email: userCred.email,
      password: userCred.password,
    };
    it('should return a token', () => {
      expect(controller.signin(dto)).toEqual({
        access_token: expect.any(String),
      });
      expect(mockAuthService.signin).toHaveBeenCalledWith(dto);
    });
  });
});
