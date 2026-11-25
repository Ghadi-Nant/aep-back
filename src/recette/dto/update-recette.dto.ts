import { PartialType } from '@nestjs/swagger';
import { CreateRecetteDto } from './create-recette.dto.js';

export class UpdateRecetteDto extends PartialType(CreateRecetteDto) {}
