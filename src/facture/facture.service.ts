
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFactureDto } from './dto/create-facture.dto.js';
import { UpdateFactureDto } from './dto/update-facture.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import writtenNumber from 'written-number-ts'

@Injectable()
export class FactureService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFactureDto: CreateFactureDto) {
    const { idReleve } = createFactureDto;

    // 1. Vérifier l'existence du relevé
    const releve = await this.prisma.releve.findUnique({
      where: { idReleve },
      include: {
        compteur: {
          include: {
            abonne: {
              include: {
                aep: true,
              },
            },
          },
        },
      },
    });

    if (!releve) {
      throw new BadRequestException('Relevé introuvable !');
    }

    // 2. Vérifier qu'une facture n'existe pas déjà
    const factureExistante = await this.prisma.facture.findUnique({
      where: { idReleve },
    });

    if (factureExistante) {
      throw new BadRequestException(
        'Une facture existe déjà pour ce relevé !',
      );
    }

    // 3. Calculer les informations de la facture
    const parametre = await this.prisma.parametre.findFirst();

    const dateEdition = new Date();
    const moisFacturation = dateEdition.getMonth() + 1;
    const anneeFacturation = dateEdition.getFullYear();

    const datePresentation = new Date(dateEdition);
    datePresentation.setDate(
      datePresentation.getDate() +
        Number(parametre?.delaiPresentation ?? 3),
    );

    const dateLimite = new Date(datePresentation);
    dateLimite.setDate(
      dateLimite.getDate() + Number(parametre?.delaiLimite ?? 10),
    );

    const dateCoupure = new Date(datePresentation);
    dateCoupure.setDate(
      dateCoupure.getDate() + Number(parametre?.delaiCoupure ?? 15),
    );

    const prixM3 = Number(releve.compteur.abonne.aep.prixEauBp ?? 3200);
    const fraisFixes = Number(parametre?.fraisFixeFacture ?? 500);

    const montantConsommation = releve.consommation * prixM3;
    const montantTotal = montantConsommation + fraisFixes;

    // 4. Générer le numéro de facture
    const derniereFacture = await this.prisma.facture.findFirst({
      orderBy: { idFacture: 'desc' },
      select: { numFacture: true },
    });

    const dernierNumero = Number(
      derniereFacture?.numFacture.split('/')[0],
    );

    const numero = Number.isInteger(dernierNumero)
      ? dernierNumero + 1
      : 1001;

    const aep = releve.compteur.abonne.aep;

    const nomAepCourt =
      aep.nomAep.trim().split(/\s+/).pop()?.slice(0, 5).toUpperCase() ||
      'AEP';

    const annee = String(dateEdition.getFullYear()).slice(-2);
    const numFacture = `${numero}/${nomAepCourt} ${annee}`;

    // 5. Enregistrer la facture
    return this.prisma.facture.create({
      data: {
        numFacture,
        dateEdition,
        datePresentation,
        dateLimite,
        dateCoupure,
        montantConsommation,
        fraisFixe: fraisFixes,
        montantTotal,
        moisFacturation,
        anneeFacturation,
        statut: 'EN_ATTENTE',
        idReleve,
      },
    });
  }

  async findAll() {
    return this.prisma.facture.findMany({
      include: {
        releve: {
          include: {
            compteur: {
              include: {
                abonne: {
                  include: {
                    aep: true,
                  },
                },
              },
            },
          },
        },
        paiment: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.facture.findUnique({
      where: { idFacture: id },
      include: {
        releve: {
          include: {
            compteur: {
              include: {
                abonne: {
                  include: {
                    aep: true,
                  },
                },
              },
            },
          },
        },
        paiment: true,
      },
    });
  }

  async update(id: number, updateFactureDto: UpdateFactureDto) {
    const factureExistante = await this.findOne(id);

    if (!factureExistante) {
      throw new BadRequestException('Facture non trouvée !');
    }

    return this.prisma.facture.update({
      where: { idFacture: id },
      data: updateFactureDto,
    });
  }

  async remove(id: number) {
    const factureExistante = await this.findOne(id);

    if (!factureExistante) {
      throw new BadRequestException('Facture non trouvée !');
    }

    return this.prisma.facture.delete({
      where: { idFacture: id },
    });
  }

  // Préparer toutes les données nécessaires au template PDF
  async getFacturePdfData(id: number) {
    const facture = await this.findOne(id);

    if (!facture) {
      throw new BadRequestException('Facture non trouvée !');
    }

    const releve = facture.releve;
    const compteur = releve.compteur;
    const abonne = compteur.abonne;
    const aep = abonne.aep;

    // Formatage des dates
    const formatDate = (date: Date) =>
      new Intl.DateTimeFormat('fr-FR').format(date);

    // Formatage des montants
    const formatMontant = (montant: number) =>
      montant.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    // Formatage des index et consommations
    const formatIndex = (valeur: number) =>
      valeur.toLocaleString('fr-FR', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });

    const jour = this.getDayInMonth((facture.dateEdition.getMonth() + 1), (facture.dateEdition.getFullYear()))

    // Mois de facturation
    const mois = new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
    })
      .format(
        new Date(
          facture.anneeFacturation ?? facture.dateEdition.getFullYear(),
          (facture.moisFacturation ?? facture.dateEdition.getMonth() + 1) - 1,
          1,
        ),
      )
      .toUpperCase();

    // Paiements déjà effectués
    const montantPaye = facture.paiment.reduce(
      (total, paiement) => total + Number(paiement.montantPaye),
      0,
    );

    const resteAPayer = Math.max(
      0,
      Number(facture.montantTotal) - montantPaye,
    );

    const dernierPaiement = [...facture.paiment].sort(
      (a, b) =>
        new Date(b.datePaiement).getTime() -
        new Date(a.datePaiement).getTime(),
    )[0];

    return {
      entreprise: {
        nom: aep.nomAep,
      },

      abonne: {
        nom: `${abonne.nom} ${abonne.prenom}`,
        adresse: abonne.adresse,
        reference: abonne.refClient,
      },

      compteur: {
        reference: compteur.numCompteur,
      },

      numFacture: facture.numFacture,

      mois,

      dateEdition: formatDate(facture.dateEdition),
      datePresentation: formatDate(facture.datePresentation),
      dateLimite: formatDate(facture.dateLimite),
      dateCoupure: formatDate(facture.dateCoupure),

      nouvelIndex: formatIndex(releve.nouvelIndex),
      ancieIndex: formatIndex(releve.ancienIndex),
      consommation: formatIndex(releve.consommation),

      prixM3: formatMontant(Number(aep.prixEauBp)),
      montantConsommation: formatMontant(
        Number(facture.montantConsommation),
      ),
      prixFixe: formatMontant(Number(facture.fraisFixe)),
      montantTotal: formatMontant(Number(facture.montantTotal)),
      montantEnLettres: this.montantEnLettres(Number(facture.montantTotal)),

      montantPaye: formatMontant(montantPaye),
      resteAPayer: formatMontant(resteAPayer),
      dateReleve: formatDate(releve.dateReleve),

      datePaiement: dernierPaiement
        ? formatDate(dernierPaiement.datePaiement)
        : '________________',

      // Informations non disponibles dans les modèles actuels
      dateAncienIndex: null,
      joursConsommation: jour,
      numeroRecu: null,
      modePaiement: null,
      payePar: null,
    };
  }

  private montantEnLettres(montant: number) {
    const entier = Math.floor(montant)
    const centimes = Math.round((montant - entier) * 100)

    let res = `${writtenNumber(entier, { lang: 'fr'})}`

    if (centimes > 0) {
      res+= ` et ${writtenNumber(centimes, { lang: 'fr'})}`
    }

    return res.charAt(0).toUpperCase() + res.slice(1);
  }

  private getDayInMonth(mois: number, annee: number) {
    return new Date(annee, mois, 0).getDate();
  }
}
