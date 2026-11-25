import { PartialType } from '@nestjs/swagger';
import { CreateCompteurDto } from './create-compteur.dto.js';

export class UpdateCompteurDto extends PartialType(CreateCompteurDto) {}
