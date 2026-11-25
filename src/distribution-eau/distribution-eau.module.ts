import { Module } from '@nestjs/common';
import { DistributionEauService } from './distribution-eau.service.js';
import { DistributionEauController } from './distribution-eau.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [DistributionEauController],
  providers: [DistributionEauService],
})
export class DistributionEauModule {}
