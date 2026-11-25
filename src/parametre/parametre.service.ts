import { Injectable } from '@nestjs/common';
import { CreateParametreDto } from './dto/create-parametre.dto';
import { UpdateParametreDto } from './dto/update-parametre.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParametreService {

  constructor(private readonly prisma: PrismaService) {}

  async obtenirParametres() {
    let parametre = await this.prisma.parametre.findFirst();
    
    // Si aucun paramètre n'existe encore, on en initialise un par défaut
    if (!parametre) {
      parametre = await this.prisma.parametre.create({
        data: {
          fraisFixeFacture: 500,
          delaiPresentation: 3,
          delaiLimite: 10,
          delaiCoupure: 15,
        },
      });
    }
    return parametre;
  }

  async mettreAJour(data: CreateParametreDto) {
    let parametre = await this.prisma.parametre.findFirst();

    if (!parametre) {
      return this.prisma.parametre.create({ data });
    }

    return this.prisma.parametre.update({
      where: { idParametre: parametre.idParametre },
      data,
    });
  }
}
