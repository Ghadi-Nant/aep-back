import { Module } from '@nestjs/common';
import { AbonneService } from './abonne.service.js';
import { AbonneController } from './abonne.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [AbonneController],
  providers: [AbonneService],
})
export class AbonneModule {}
