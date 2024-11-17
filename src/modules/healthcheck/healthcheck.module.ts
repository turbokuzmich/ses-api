import { Module } from '@nestjs/common';
import { HealthCheckController } from './healthcheck.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
