import { Module } from '@nestjs/common';
import { ProductionEauService } from './production-eau.service.js';
import { ProductionEauController } from './production-eau.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ProductionEauController],
  providers: [ProductionEauService],
})
export class ProductionEauModule {}
