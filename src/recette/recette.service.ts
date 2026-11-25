import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRecetteDto } from './dto/create-recette.dto.js';
import { UpdateRecetteDto } from './dto/update-recette.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RecetteService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createRecetteDto: CreateRecetteDto) {
    const recete = await this.prisma.recete.create({
      data: createRecetteDto
    })

    return recete;
  }

  async findAll() {
    return await this.prisma.recete.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.recete.findUnique({
      where: { idRecete: id }
    });
  }

  async update(id: number, updateRecetteDto: UpdateRecetteDto) {
    const existingRecette = await this.findOne(id)

    if(!existingRecette) {
      throw new BadRequestException("Recette non trouvée")
    }
    
    const recete = await this.prisma.recete.update({
      data: updateRecetteDto,
      where: { idRecete: id }
    })
    
    return recete;
  }

  async remove(id: number) {
    return await this.prisma.recete.delete({
      where: { idRecete: id }
    });
  }
}
