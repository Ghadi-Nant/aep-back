import { PartialType } from '@nestjs/swagger';
import { CreateDepenseDto } from './create-depense.dto.js';

export class UpdateDepenseDto extends PartialType(CreateDepenseDto) {}
