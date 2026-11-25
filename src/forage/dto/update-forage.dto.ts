import { PartialType } from '@nestjs/swagger';
import { CreateForageDto } from './create-forage.dto.js';

export class UpdateForageDto extends PartialType(CreateForageDto) {}
