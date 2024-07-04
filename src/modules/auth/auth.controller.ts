import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/pipes/zod';
import { SignupDto, signupSchema } from './dto/signup';
import { either, function as fn } from 'fp-ts';
import { signinSchema, SigninDto } from './dto/signin';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  async signin(
    @Body(new ZodValidationPipe(signinSchema)) signinDto: SigninDto,
  ) {
    const result = await this.authService.signin(signinDto);

    return fn.pipe(
      result,
      either.match(
        (error) => {
          throw new UnauthorizedException(error);
        },
        ([user, token]) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            token,
          } as any;
        },
      ),
    );
  }

  @Post('signup')
  @HttpCode(200)
  async signup(
    @Body(new ZodValidationPipe(signupSchema)) signupDto: SignupDto,
  ) {
    const result = await this.authService.signup(signupDto);

    return fn.pipe(
      result,
      either.match(
        (error) => {
          throw new UnauthorizedException(error);
        },
        ([user, token]) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            token,
          } as any;
        },
      ),
    );
  }
}
