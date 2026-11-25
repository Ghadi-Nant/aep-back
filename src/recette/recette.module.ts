import { Module } from '@nestjs/common';
import { RecetteService } from './recette.service.js';
import { RecetteController } from './recette.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [RecetteController],
  providers: [RecetteService],
})
export class RecetteModule {}
