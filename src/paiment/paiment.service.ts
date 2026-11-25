import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaimentDto } from './dto/create-paiment.dto.js';
import { UpdatePaimentDto } from './dto/update-paiment.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { connect } from 'http2';

@Injectable()
export class PaimentService {

  constructor(private readonly prisma: PrismaService) {}

  private readonly includeRelations = {
    facture: {
      include: {
        releve: {
          include: {
            compteur: {
              include: {
                abonne: true,
              },
            },
          },
        },
      },
    },
  };

  async create(createPaimentDto: CreatePaimentDto) {

    return this.prisma.$transaction(async (tx) => {

      const paiment = await tx.paiement.create({
        data: createPaimentDto,
        include: this.includeRelations
      })

      const montant = Number(paiment.montantPaye);

      if (montant < 0) {
        throw new BadRequestException(
          'Le montant payé ne peut pas être négatif.',
        );
      }

      if(montant > 0) {
        await tx.facture.update({
          data: {
            statut: 'PAYEE'
          },
          where: { idFacture: paiment.idFacture }
        })

        await tx.recete.create({
          data: {
            dateRecete: new Date(),
            typeService: 'BF',
            libelleRecete: 'VERSEMENT_BP',
            montant: paiment.montantPaye,
            idAep: paiment.facture.releve.compteur.abonne.idAep,
            idPaiement: paiment.idPaiement
          }
        })
      }

      await this.actualiserStatutFacture(tx, paiment.idFacture);
      return paiment;
    })
  }

  async findAll() {
    return await this.prisma.paiement.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.paiement.findUnique({
      where: { idPaiement: id }
    });
  }

  async update(id: number, dto: UpdatePaimentDto) {
    return this.prisma.$transaction(async (tx) => {
      const existant = await tx.paiement.findUnique({
        where: { idPaiement: id },
      });

      if (!existant) {
        throw new NotFoundException('Ce paiement n’existe pas.');
      }

      const paiment = await tx.paiement.update({
        where: { idPaiement: id },
        data: dto,
        include: this.includeRelations,
      });

      const montant = Number(paiment.montantPaye);

      if (montant < 0) {
        throw new BadRequestException(
          'Le montant payé ne peut pas être négatif.',
        );
      }

      if (montant > 0) {
        await tx.recete.upsert({
          where: {
            idPaiement: id,
          },
          create: {
            dateRecete: paiment.datePaiement,
            typeService: 'BP',
            libelleRecete: 'VERSEMENT_BP',
            montant: paiment.montantPaye,
            idAep: paiment.facture.releve.compteur.abonne.idAep,
            idPaiement: id,
          },
          update: {
            dateRecete: paiment.datePaiement,
            montant: paiment.montantPaye,
            idAep: paiment.facture.releve.compteur.abonne.idAep,
          },
        });
      } else {
        await tx.recete.deleteMany({
          where: { idPaiement: id },
        });
      }

      await this.actualiserStatutFacture(tx, existant.idFacture);

      if (paiment.idFacture !== existant.idFacture) {
        await this.actualiserStatutFacture(tx, paiment.idFacture);
      }

      return paiment;
    });
  }

  async remove(id: number) {
    return await this.prisma.paiement.delete({
      where: { idPaiement: id }
    });
  }

  private async actualiserStatutFacture(
    tx: Prisma.TransactionClient,
    idFacture: number,
  ) {
    const facture = await tx.facture.findUnique({
      where: { idFacture },
    });

    if (!facture) {
      throw new NotFoundException('Facture introuvable.');
    }

    const paiements = await tx.paiement.aggregate({
      where: { idFacture },
      _sum: {
        montantPaye: true,
      },
    });

    const totalPaye = Number(paiements._sum.montantPaye ?? 0);
    const montantTotal = Number(facture.montantTotal);

    await tx.facture.update({
      where: { idFacture },
      data: {
        statut: totalPaye >= montantTotal ? 'PAYEE' : 'EN_ATTENTE',
      },
    });
  }

}
