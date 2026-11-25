import { PartialType } from '@nestjs/swagger';
import { CreateReleveDto } from './create-releve.dto.js';

export class UpdateReleveDto extends PartialType(CreateReleveDto) {}
