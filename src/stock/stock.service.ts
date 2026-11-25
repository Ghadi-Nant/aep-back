import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto.js';
import { UpdateStockDto } from './dto/update-stock.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class StockService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createStockDto: CreateStockDto) {
    const stock = await this.prisma.stock.create({
      data: createStockDto
    })

    return stock;
  }

  async findAll() {
    return await this.prisma.stock.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.stock.findUnique({
      where: { idStock: id }
    });
  }

  async update(id: number, updateStockDto: UpdateStockDto) {
    const existingStock = await this.findOne(id)

    if(!existingStock) {
      throw new BadRequestException("Stock non trouvé !")
    }
    const stock = await this.prisma.stock.update({
      data: updateStockDto,
      where: { idStock: id }
    })

    return stock;
  }

  async remove(id: number) {
    return await this.prisma.stock.delete({
      where: { idStock: id }
    });
  }
}
