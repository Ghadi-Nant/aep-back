import { PartialType } from '@nestjs/swagger';
import { CreateStockDto } from './create-stock.dto.js';

export class UpdateStockDto extends PartialType(CreateStockDto) {}
