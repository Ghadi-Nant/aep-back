import { Injectable } from '@nestjs/common';
import { CreateAbonneDto } from './dto/create-abonne.dto.js';
import { UpdateAbonneDto } from './dto/update-abonne.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AbonneService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createAbonneDto: CreateAbonneDto) {
    const abonne = await this.prisma.abonne.create({
      data: createAbonneDto
    })
    
    return abonne;
  }

  async findAll() {
    return await this.prisma.abonne.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.abonne.findUnique({
      where: { idAbonne: id }
    });
  }

  async update(id: number, updateAbonneDto: UpdateAbonneDto) {
    const abonne = await this.prisma.abonne.update({
      data: updateAbonneDto,
      where: { idAbonne: id }
    })

    return abonne;
  }

  async remove(id: number) {
    return await this.prisma.abonne.delete({
      where: { idAbonne: id }
    });
  }
}
