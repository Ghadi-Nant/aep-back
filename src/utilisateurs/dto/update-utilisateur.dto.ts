import { PartialType } from '@nestjs/swagger';
import { CreateUtilisateurDto } from './create-utilisateur.dto.js';

export class UpdateUtilisateurDto extends PartialType(CreateUtilisateurDto) {}
