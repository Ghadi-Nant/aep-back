import { PartialType } from '@nestjs/swagger';
import { CreateReservoirDto } from './create-reservoir.dto.js';

export class UpdateReservoirDto extends PartialType(CreateReservoirDto) {}
