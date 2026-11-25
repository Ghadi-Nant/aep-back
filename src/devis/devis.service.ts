import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDeviDto } from './dto/create-devi.dto.js';
import { UpdateDeviDto } from './dto/update-devi.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DevisService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createDeviDto: CreateDeviDto) {
    const devis = await this.prisma.devisBP.create({
      data: createDeviDto
    })

    return devis;
  }

  async findAll() {
    return await this.prisma.devisBP.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.devisBP.findUnique({
      where: { idDevis: id }
    });
  }

  async update(id: number, updateDeviDto: UpdateDeviDto) {
    const existingDevis = await this.findOne(id)

    if(!existingDevis) {
      throw new BadRequestException("Devis non trouvé !")
    }
    
    const devis = await this.prisma.devisBP.update({
      data: updateDeviDto,
      where: { idDevis: id }
    })

    return devis;
  }

  async remove(id: number) {
    return await this.prisma.devisBP.findUnique({
      where: { idDevis: id }
    });
  }
}
