import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/ormconfig';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TaskModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class AppModule {}
