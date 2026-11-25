import { PartialType } from '@nestjs/swagger';
import { CreatePompeDto } from './create-pompe.dto.js';

export class UpdatePompeDto extends PartialType(CreatePompeDto) {}
