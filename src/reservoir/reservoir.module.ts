import { Module } from '@nestjs/common';
import { ReservoirService } from './reservoir.service.js';
import { ReservoirController } from './reservoir.controller.js';

@Module({
  controllers: [ReservoirController],
  providers: [ReservoirService],
})
export class ReservoirModule {}
