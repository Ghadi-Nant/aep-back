import { PartialType } from '@nestjs/swagger';
import { CreateVersementKiosqueDto } from './create-versement-kiosque.dto.js';

export class UpdateVersementKiosqueDto extends PartialType(CreateVersementKiosqueDto) {}
