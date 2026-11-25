import { Module } from '@nestjs/common';
import { VersementKiosqueService } from './versement-kiosque.service.js';
import { VersementKiosqueController } from './versement-kiosque.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [VersementKiosqueController],
  providers: [VersementKiosqueService],
})
export class VersementKiosqueModule {}
