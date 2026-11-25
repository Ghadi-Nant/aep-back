import { PartialType } from '@nestjs/swagger';
import { CreateProductionEauDto } from './create-production-eau.dto.js';

export class UpdateProductionEauDto extends PartialType(CreateProductionEauDto) {}
