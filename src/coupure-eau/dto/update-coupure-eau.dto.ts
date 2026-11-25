import { PartialType } from '@nestjs/swagger';
import { CreateCoupureEauDto } from './create-coupure-eau.dto.js';

export class UpdateCoupureEauDto extends PartialType(CreateCoupureEauDto) {}
