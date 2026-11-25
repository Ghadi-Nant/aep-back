import { Module } from '@nestjs/common';
import { KiosqueService } from './kiosque.service.js';
import { KiosqueController } from './kiosque.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [KiosqueController],
  providers: [KiosqueService],
})
export class KiosqueModule {}
