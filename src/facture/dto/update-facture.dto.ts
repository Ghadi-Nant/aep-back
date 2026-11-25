import { PartialType } from '@nestjs/swagger';
import { CreateFactureDto } from './create-facture.dto.js';

export class UpdateFactureDto extends PartialType(CreateFactureDto) {}
