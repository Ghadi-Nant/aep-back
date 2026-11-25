import { PartialType } from '@nestjs/swagger';
import { CreateKiosqueDto } from './create-kiosque.dto.js';

export class UpdateKiosqueDto extends PartialType(CreateKiosqueDto) {}
