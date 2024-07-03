import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/pipes/zod';
import { SignupDto, signupSchema } from './dto/signup';
import { Response } from 'express';
import { either, function as fn } from 'fp-ts';
import { signinSchema, SigninDto } from './dto/signin';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Post('signin')
  @UsePipes(new ZodValidationPipe(signinSchema))
  async signin(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signin(signinDto);

    return fn.pipe(
      result,
      either.match(
        (error) => {
          response.status(401);
          return { status: 'error', error } as any;
        },
        ([user, token]) => {
          response.cookie(this.config.get('session.cookie'), token);
          return { status: 'success', id: user.id } as any;
        },
      ),
    );
  }

  @Post('signup')
  @UsePipes(new ZodValidationPipe(signupSchema))
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signup(signupDto);

    return fn.pipe(
      result,
      either.match(
        (error) => {
          response.status(400);
          return { status: 'error', error } as any;
        },
        (user) => {
          return { status: 'success', id: user.id } as any;
        },
      ),
    );
  }
}
