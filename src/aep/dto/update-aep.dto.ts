import { PartialType } from '@nestjs/swagger';//tsy mzv 
import { CreateAepDto } from './create-aep.dto.js';

export class UpdateAepDto extends PartialType(CreateAepDto) {}
