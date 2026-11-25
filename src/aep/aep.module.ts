import { Module } from '@nestjs/common';
import { AepService } from './aep.service.js';
import { AepController } from './aep.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [AepController],
  providers: [AepService],
})
export class AepModule {}
