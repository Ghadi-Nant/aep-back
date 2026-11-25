import { PartialType } from '@nestjs/swagger';
import { CreatePanneauDto } from './create-panneau.dto.js';

export class UpdatePanneauDto extends PartialType(CreatePanneauDto) {}
