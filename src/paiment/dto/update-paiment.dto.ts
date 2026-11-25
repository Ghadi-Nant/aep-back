import { PartialType } from '@nestjs/swagger';
import { CreatePaimentDto } from './create-paiment.dto.js';

export class UpdatePaimentDto extends PartialType(CreatePaimentDto) {}
