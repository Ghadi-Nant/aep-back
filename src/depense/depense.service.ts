import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDepenseDto } from './dto/create-depense.dto.js';
import { UpdateDepenseDto } from './dto/update-depense.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DepenseService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createDepenseDto: CreateDepenseDto) {
    const depense = await this.prisma.depense.create({
      data: createDepenseDto
    })

    return depense;
  }

  async findAll() {
    return await this.prisma.depense.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.depense.findUnique({
      where: { idDepense: id }
    });
  }

  async update(id: number, updateDepenseDto: UpdateDepenseDto) {
    const existingDepense = await this.findOne(id)

    if(!existingDepense) {
      throw new BadRequestException("Dépense non trouvée")
    }
    
    const depense = await this.prisma.depense.update({
      data: updateDepenseDto,
      where: { idDepense: id }
    })
    
    return depense;
  }

  async remove(id: number) {
    return await this.prisma.depense.delete({
      where: { idDepense: id }
    });
  }
}
