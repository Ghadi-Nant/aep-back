import { Module } from '@nestjs/common';
import { DepenseService } from './depense.service.js';
import { DepenseController } from './depense.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [DepenseController],
  providers: [DepenseService],
})
export class DepenseModule {}
