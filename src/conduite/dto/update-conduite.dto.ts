import { PartialType } from '@nestjs/swagger';
import { CreateConduiteDto } from './create-conduite.dto.js';

export class UpdateConduiteDto extends PartialType(CreateConduiteDto) {}
