import { PartialType } from '@nestjs/swagger';
import { CreateAbonneDto } from './create-abonne.dto.js';

export class UpdateAbonneDto extends PartialType(CreateAbonneDto) {}
