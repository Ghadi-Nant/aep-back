import { PartialType } from '@nestjs/swagger';
import { CreateDeviDto } from './create-devi.dto.js';

export class UpdateDeviDto extends PartialType(CreateDeviDto) {}
