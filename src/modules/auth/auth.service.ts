'use strict';

import { createHmac } from 'crypto';
import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
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
import type { Config } from 'src/config';
import DbService from '../db/db.service';
import { AclService } from '../acl/acl.service';

const tokenSchema = z.object({
  id: z.number().positive(),
});

type Token = z.infer<typeof tokenSchema>;

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DbService,
    private readonly acl: AclService,
    // @InjectQueue('authorization') private readonly queue: Queue,
    private readonly config: ConfigService<Config, true>,
    // private readonly eventEmitter: EventEmitter2,
  ) {}

  private encrypt(something: string) {
    return createHmac('sha256', this.config.get('auth.secret', { infer: true }))
      .update(something)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  sign(data: any) {
    const base64 = Buffer.from(JSON.stringify(data)).toString('base64');
    const signature = this.encrypt(base64);

    return `${base64}.${signature}`;
  }

  extract(input: string): object | null {
    const [base64, signature] = input.split('.');

    if (!(base64 && signature)) {
      return null;
    }

    const inputSignature = this.encrypt(base64);

    if (signature !== inputSignature) {
      return null;
    }

    try {
      return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
    } catch (_) {
      return null;
    }
  }

  async signup(
    data: SignupDto,
  ): Promise<either.Either<string, [User, string]>> {
    const UsersWithEmailCount = await this.db.user.count({
      where: {
        email: data.login,
      },
    });

    if (UsersWithEmailCount) {
      return either.left('User already exists');
    }

    const salt = this.config.get('users.salt', { infer: true });
    const encryptedPassword = this.encrypt(`${data.password}.${salt}`);

    // TODO need a transaction here
    const newUser = await this.db.user.create({
      data: {
        name: data.nickname,
        email: data.login,
        password: encryptedPassword,
        role: data.role,
      },
    });

    await this.acl.setUserRole(newUser.id, data.role);

    // await this.queue.add({
    //   event: 'signup',
    //   data: { name: newUser.name, email: newUser.email },
    // });

    return either.right([newUser, this.sign({ id: newUser.id })]);
  }

  async signin(
    data: SigninDto,
  ): Promise<either.Either<string, [User, string]>> {
    const salt = this.config.get('users.salt', { infer: true });
    const encryptedPassword = this.encrypt(`${data.password}.${salt}`);

    const user = await this.db.user.findUnique({
      where: {
        email: data.login,
        password: encryptedPassword,
      },
    });

    // this.eventEmitter.emit('auth.signin', user.id);

    return user
      ? either.right([user, this.sign({ id: user.id })])
      : either.left('User not found');
  }

  private getTokenFromQuery(request: Request): option.Option<Token> {
    return pipe(
      option.some(request.query.token),
      option.map((token) => z.coerce.string().parse(token)),
      option.map((token) => this.extract(token)),
      option.flatMap((parsedToken) =>
        parsedToken
          ? option.some(tokenSchema.safeParse(parsedToken))
          : option.none,
      ),
      option.flatMap((validatedToken) =>
        validatedToken.success
          ? option.some(validatedToken.data as Token)
          : option.none,
      ),
    );
  }

  private getTokenFromHeaders(request: Request): option.Option<Token> {
    return pipe(
      option.some(request.headers.authorization),
      option.map((header) =>
        decodeURIComponent(
          z.coerce
            .string()
            .parse(header)
            .replace(/^Bearer\s/, ''),
        ),
      ),
      option.map((token) => this.extract(token)),
      option.flatMap((parsedToken) =>
        parsedToken
          ? option.some(tokenSchema.safeParse(parsedToken))
          : option.none,
      ),
      option.flatMap((validatedToken) =>
        validatedToken.success
          ? option.some(validatedToken.data as Token)
          : option.none,
      ),
    );
  }

  getTokenFromRequest(request: Request): option.Option<Token> {
    return pipe(
      this.getTokenFromQuery(request),
      option.orElse(() => this.getTokenFromHeaders(request)),
    );
  }

  async getUserFromRequest(request: Request): Promise<option.Option<User>> {
    const token = this.getTokenFromRequest(request);

    return pipe(
      token,
      option.match(
        () => Promise.resolve(option.none),
        (token) =>
          this.db.user
            .findUnique({ where: { id: token.id } })
            .then((user) => (user ? option.some(user) : option.none)),
      ),
    );
  }

  async getUserById(id: number): Promise<option.Option<User>> {
    const user = await this.db.user.findUnique({ where: { id } });

    return user ? option.some(user) : option.none;
  }
}
