import { Controller, Get } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Controller('healthcheck')
export class HealthCheckController {
  constructor(private readonly sequelize: Sequelize) {}

  @Get()
  async ping() {
    await this.sequelize.authenticate();

    return this.sequelize.getDialect();
  }
}
