import { Module } from '@nestjs/common';
import { ForageService } from './forage.service.js';
import { ForageController } from './forage.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ForageController],
  providers: [ForageService],

})
export class ForageModule {}
