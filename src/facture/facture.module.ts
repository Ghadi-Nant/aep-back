import { Module } from '@nestjs/common';
import { FactureService } from './facture.service.js';
import { FactureController } from './facture.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { FacturePdfService } from './facture-pdf.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [FactureController],
  providers: [FactureService, FacturePdfService],
})
export class FactureModule {}
