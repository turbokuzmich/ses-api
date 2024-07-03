import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AclService {
  constructor(private readonly sequelize: Sequelize) {}
}
