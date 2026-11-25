import { Injectable } from '@nestjs/common';
import { CreateCompteurDto } from './dto/create-compteur.dto.js';
import { UpdateCompteurDto } from './dto/update-compteur.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CompteurService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createCompteurDto: CreateCompteurDto) {
    const compteur = await this.prisma.compteur.create({
      data: createCompteurDto
    })

    return compteur;
  }

  async findAll() {
    return await this.prisma.compteur.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.compteur.findUnique({
      where: { idCompteur: id }
    });
  }

  async update(id: number, updateCompteurDto: UpdateCompteurDto) {
    const compteur = await this.prisma.compteur.update({
      data: updateCompteurDto,
      where: { idCompteur: id }
    })

    return compteur;
  }

  async remove(id: number) {
    return await this.prisma.compteur.delete({
      where: { idCompteur: id }
    });
  }
}
