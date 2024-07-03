'use strict';

import { createHmac } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/models';
import { SignupDto } from './dto/signup';
import { ConfigService } from '@nestjs/config';
import { either, option } from 'fp-ts';
import { SigninDto } from './dto/signin';
// import { InjectQueue } from '@nestjs/bull';
// import { Queue } from 'bull';
// import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { z } from 'zod';
import { pipe } from 'fp-ts/lib/function';

const tokenSchema = z.object({
  email: z.string({ required_error: 'asd' }),
});

type Token = z.infer<typeof tokenSchema>;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    // @InjectQueue('authorization') private queue: Queue,
    private config: ConfigService,
    // private eventEmitter: EventEmitter2,
  ) {}

  sign(data: any) {
    const base64 = Buffer.from(JSON.stringify(data)).toString('base64');
    const signature = createHmac('sha256', this.config.get('auth.secret'))
      .update(base64)
      .digest('hex');

    return `${base64}.${signature}`;
  }

  extract(input: string) {
    const [base64, signature] = input.split('.');

    if (!(base64 && signature)) {
      return null;
    }

    const inputSignature = createHmac('sha256', this.config.get('auth.secret'))
      .update(base64)
      .digest('hex');

    if (signature !== inputSignature) {
      return null;
    }

    try {
      return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
    } catch (_) {
      return null;
    }
  }

  async signup(data: SignupDto): Promise<either.Either<string, User>> {
    const existingUserWithEmail = await this.userModel.findAll({
      where: {
        email: data.login,
      },
    });

    if (existingUserWithEmail.length) {
      return either.left('User already exists');
    }

    const encryptedPassword = createHmac(
      'sha256',
      this.config.get('auth.secret'),
    )
      .update(data.password)
      .digest('hex');

    const newUser = await this.userModel.create({
      name: data.nickname,
      email: data.login,
      password: encryptedPassword,
    });

    // await this.queue.add({
    //   event: 'signup',
    //   data: { name: newUser.name, email: newUser.email },
    // });

    return either.right(newUser);
  }

  async signin(
    data: SigninDto,
  ): Promise<either.Either<string, [User, string]>> {
    const encryptedPassword = createHmac(
      'sha256',
      this.config.get('auth.secret'),
    )
      .update(data.password)
      .digest('hex');

    const user = await this.userModel.findOne({
      where: {
        email: data.login,
        password: encryptedPassword,
      },
    });

    // this.eventEmitter.emit('auth.signin', user.id);

    return user
      ? either.right([user, this.sign({ email: user.email })])
      : either.left('User not found');
  }

  getTokenFromRequest(request: Request): option.Option<Token> {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return option.none;
    }

    const token = authorization.replace(/^Bearer\s/, '');
    const user = this.extract(decodeURIComponent(token));

    if (!user || !tokenSchema.safeParse(user).success) {
      return option.none;
    }

    return option.some(user as Token);
  }

  async getUserFromRequest(request: Request): Promise<option.Option<User>> {
    const token = this.getTokenFromRequest(request);

    return pipe(
      token,
      option.match(
        () => Promise.resolve(option.none),
        (token) =>
          User.findOne({ where: { email: token.email } }).then((user) =>
            user ? option.some(user) : option.none,
          ),
      ),
    );
  }

  isAuthenticated(request: Request) {
    return Boolean(this.getTokenFromRequest(request));
  }
}
