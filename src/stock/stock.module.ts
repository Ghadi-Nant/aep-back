import { Module } from '@nestjs/common';
import { StockService } from './stock.service.js';
import { StockController } from './stock.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
