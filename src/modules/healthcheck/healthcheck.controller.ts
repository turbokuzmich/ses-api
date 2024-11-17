import { Controller, Get } from '@nestjs/common';
import DbService from '../db/db.service';

@Controller('healthcheck')
export class HealthCheckController {
  constructor(private readonly db: DbService) {}

  @Get()
  async ping() {
    await this.db.$queryRaw`SELECT 1+1`;
  }
}
