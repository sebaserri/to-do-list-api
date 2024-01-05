import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getStatus(): Promise<{ status: string }> {
      const status = this.healthService.getStatus();
      return { status };
  }
}
