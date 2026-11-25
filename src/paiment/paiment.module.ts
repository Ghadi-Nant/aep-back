import { Module } from '@nestjs/common';
import { PaimentService } from './paiment.service.js';
import { PaimentController } from './paiment.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PaimentController],
  providers: [PaimentService],
})
export class PaimentModule {}
