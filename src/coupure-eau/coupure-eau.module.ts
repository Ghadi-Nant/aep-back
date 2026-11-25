import { Module } from '@nestjs/common';
import { CoupureEauService } from './coupure-eau.service.js';
import { CoupureEauController } from './coupure-eau.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CoupureEauController],
  providers: [CoupureEauService],
})
export class CoupureEauModule {}
