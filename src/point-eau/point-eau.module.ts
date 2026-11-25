import { Module } from '@nestjs/common';
import { PointEauService } from './point-eau.service.js';
import { PointEauController } from './point-eau.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PointEauController],
  providers: [PointEauService],
})
export class PointEauModule {}
