import { Module } from '@nestjs/common';
import { UtilisateursSessionsService } from './utilisateurs-sessions.service.js';
import { UtilisateursSessionsController } from './utilisateurs-sessions.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [UtilisateursSessionsController],
  providers: [UtilisateursSessionsService],
  exports: [UtilisateursSessionsService]
})
export class UtilisateursSessionsModule {}
