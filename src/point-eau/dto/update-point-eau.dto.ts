import { PartialType } from '@nestjs/swagger';
import { CreatePointEauDto } from './create-point-eau.dto.js';

export class UpdatePointEauDto extends PartialType(CreatePointEauDto) {}
