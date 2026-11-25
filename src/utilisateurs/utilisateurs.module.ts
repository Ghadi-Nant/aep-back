import { Module } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service.js';
import { UtilisateursController } from './utilisateurs.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [UtilisateursController],
  providers: [UtilisateursService],
  exports: [UtilisateursService]
})
export class UtilisateursModule {}
