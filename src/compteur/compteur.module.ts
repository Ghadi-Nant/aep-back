import { Module } from '@nestjs/common';
import { CompteurService } from './compteur.service.js';
import { CompteurController } from './compteur.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CompteurController],
  providers: [CompteurService],
})
export class CompteurModule {}
