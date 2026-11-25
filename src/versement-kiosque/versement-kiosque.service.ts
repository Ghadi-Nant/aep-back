import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVersementKiosqueDto } from './dto/create-versement-kiosque.dto.js';
import { UpdateVersementKiosqueDto } from './dto/update-versement-kiosque.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class VersementKiosqueService {

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateVersementKiosqueDto) {

    await this.verifierKiosque(dto.idKiosque);

    return this.prisma.$transaction(async (tx) => {

      const versement = await tx.versementKiosque.create({
        data: {
          ...dto,
         ...this.calculer(dto)
        },
        include: {
          kiosque: true
        }
      })

      if(Number(versement.recetteVersee) > 0) {
        await tx.recete.create({
          data: {
            dateRecete: new Date(),
            typeService: 'BF',
            libelleRecete: 'VERSEMENT_KIOSQUE',
            montant: versement.recetteTheorique,
            idAep: versement.kiosque.idaep,
            idVersement: versement.idVersement
          }
        })
      }
    })
  }

  async findAll() {
    return await this.prisma.versementKiosque.findMany({
      include:{
        kiosque: true,
      },
      orderBy: {
        dateVersement: 'desc',
      }
    });
  }

  async findOne(id: number) {
    const kiosque = await this.prisma.versementKiosque.findUnique({
      where: { idVersement: id },
      include: {
        kiosque: true,
      }
    });

    if (!kiosque) {
      throw new NotFoundException('Kiosque introuvable.');
    }

    return kiosque;
  }

  async update(id: number, dto: UpdateVersementKiosqueDto) {
    return this.prisma.$transaction(async (tx) => {
      const existant = await tx.versementKiosque.findUnique({
        where: { idVersement: id },
      });

      if (!existant) {
        throw new NotFoundException('Versement introuvable.');
      }

      const idKiosque = dto.idKiosque ?? existant.idKiosque;

      if (dto.idKiosque !== undefined) {
        await this.verifierKiosque(dto.idKiosque);
      }

      const calculs = this.calculer({
        acienIndex: dto.acienIndex ?? existant.acienIndex,
        nouvelIndex: dto.nouvelIndex ?? existant.nouvelIndex,
        prix: dto.prix ?? existant.prix,
        recetteVersee: dto.recetteVersee ?? existant.recetteVersee,
      });

      const versement = await tx.versementKiosque.update({
        where: { idVersement: id },
        data: {
          ...dto,
          ...calculs,
        },
        include: {
          kiosque: true,
        },
      });

      const montant = Number(versement.recetteVersee);

      if (montant > 0) {
        await tx.recete.upsert({
          where: {
            idVersement: id,
          },
          create: {
            dateRecete: versement.dateVersement,
            typeService: 'BF',
            libelleRecete: 'VERSEMENT_KIOSQUE',
            montant: versement.recetteVersee,
            idAep: versement.kiosque.idaep,
            idVersement: id,
          },
          update: {
            dateRecete: versement.dateVersement,
            montant: versement.recetteVersee,
            idAep: versement.kiosque.idaep,
          },
        });
      } else {
        await tx.recete.deleteMany({
          where: { idVersement: id },
        });
      }

      return versement;
    });
  }


  async remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const versement = await tx.versementKiosque.findUnique({
        where: { idVersement: id },
      });

      if (!versement) {
        throw new NotFoundException('Versement introuvable.');
      }

      await tx.recete.deleteMany({
        where: { idVersement: id },
      });

      return tx.versementKiosque.delete({
        where: { idVersement: id },
      });
    });
  }

   private async verifierKiosque(idKiosque: number) {
    const kiosque = await this.prisma.kiosque.findUnique({ where: { idKiosque } });

    if (!kiosque) {
      throw new NotFoundException('Kiosque introuvable.');
    }

    return kiosque;
  }

  private calculer(v: {
    acienIndex: number;
    nouvelIndex: number;
    prix: number;
    recetteVersee: number;
  }) {
    if (v.nouvelIndex < v.acienIndex) {
      throw new BadRequestException("Le nouvel index doit être supérieur ou égal à l'ancien.");
    }

    if (v.recetteVersee < 0) {
      throw new BadRequestException('Le montant versé ne peut pas être négatif.');
    }

    const arrondi = (n: number) => Math.round(n * 100) / 100;

    const quantite = arrondi(v.nouvelIndex - v.acienIndex);
    const recetteTheorique = arrondi(quantite * v.prix);
    const restePayer = arrondi(Math.max(0, recetteTheorique - v.recetteVersee));

    console.log(quantite, recetteTheorique, restePayer)

    return { quantite, recetteTheorique, restePayer };
  }
}
