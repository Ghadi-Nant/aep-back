import { PartialType } from '@nestjs/swagger';
import { CreateDistributionEauDto } from './create-distribution-eau.dto.js';

export class UpdateDistributionEauDto extends PartialType(CreateDistributionEauDto) {}
