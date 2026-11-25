
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const maintenant = new Date();

    // Début du jour
    const debutJour = new Date(maintenant);
    debutJour.setHours(0, 0, 0, 0);

    const debutDemain = new Date(debutJour);
    debutDemain.setDate(debutDemain.getDate() + 1);

    // Début du mois courant
    const debutMois = new Date(
      maintenant.getFullYear(),
      maintenant.getMonth(),
      1,
    );

    // Période graphique financière : 12 mois
    const debutGraphiqueFinancier = new Date(
      maintenant.getFullYear(),
      maintenant.getMonth() - 11,
      1,
    );

    // Période graphique hydraulique : 30 jours
    const debutGraphiqueHydraulique = new Date(debutJour);
    debutGraphiqueHydraulique.setDate(
      debutGraphiqueHydraulique.getDate() - 29,
    );

    // Récupération des données
    const [
      nombreAbonnes,
      recettesMois,
      depensesMois,
      recettesBpMois,
      recettesBfMois,
      recettesBpGlobales,
      recettesBfGlobales,
      facturesBp,
      recettesMensuelles,
      depensesMensuelles,
      productionsMois,
      distributionsMois,
      productionsGraphique,
      distributionsGraphique,
      facturesEchues,
    ] = await Promise.all([
      // Nombre d'abonnés actifs
      this.prisma.abonne.count({
        where: {
          statut: 'ACTIF',
        },
      }),

      // Chiffre d'affaires du mois
      this.prisma.recete.aggregate({
        where: {
          dateRecete: {
            gte: debutMois,
            lt: debutDemain,
          },
        },
        _sum: {
          montant: true,
        },
      }),

      // Dépenses du mois
      this.prisma.depense.aggregate({
        where: {
          dateDepense: {
            gte: debutMois,
            lt: debutDemain,
          },
        },
        _sum: {
          montant: true,
        },
      }),

      // Recettes BP du mois
      this.prisma.recete.aggregate({
        where: {
          dateRecete: {
            gte: debutMois,
            lt: debutDemain,
          },
          libelleRecete: 'VERSEMENT_BP',
        },
        _sum: {
          montant: true,
        },
      }),

      // Recettes BF du mois
      this.prisma.recete.aggregate({
        where: {
          dateRecete: {
            gte: debutMois,
            lt: debutDemain,
          },
          libelleRecete: 'VERSEMENT_KIOSQUE',
        },
        _sum: {
          montant: true,
        },
      }),

      // Total BP encaissé depuis le début
      this.prisma.recete.aggregate({
        where: {
          libelleRecete: 'VERSEMENT_BP',
        },
        _sum: {
          montant: true,
        },
      }),

      // Total BF encaissé depuis le début
      this.prisma.recete.aggregate({
        where: {
          libelleRecete: 'VERSEMENT_KIOSQUE',
        },
        _sum: {
          montant: true,
        },
      }),

      // Total des factures BP depuis le début
      this.prisma.facture.aggregate({
        _sum: {
          montantTotal: true,
        },
      }),

      // Recettes des 12 derniers mois
      this.prisma.recete.findMany({
        where: {
          dateRecete: {
            gte: debutGraphiqueFinancier,
            lt: debutDemain,
          },
        },
        select: {
          dateRecete: true,
          montant: true,
        },
      }),

      // Dépenses des 12 derniers mois
      this.prisma.depense.findMany({
        where: {
          dateDepense: {
            gte: debutGraphiqueFinancier,
            lt: debutDemain,
          },
        },
        select: {
          dateDepense: true,
          montant: true,
        },
      }),

      // Production du mois
      this.prisma.productionEau.aggregate({
        where: {
          dateHeure: {
            gte: debutMois,
            lt: debutDemain,
          },
        },
        _sum: {
          volumeProduit: true,
        },
      }),

      // Distribution du mois
      this.prisma.distributionEau.aggregate({
        where: {
          dateHeure: {
            gte: debutMois,
            lt: debutDemain,
          },
        },
        _sum: {
          volumeDistribue: true,
        },
      }),

      // Productions des 30 derniers jours
      this.prisma.productionEau.findMany({
        where: {
          dateHeure: {
            gte: debutGraphiqueHydraulique,
            lt: debutDemain,
          },
        },
        select: {
          dateHeure: true,
          volumeProduit: true,
        },
      }),

      // Distributions des 30 derniers jours
      this.prisma.distributionEau.findMany({
        where: {
          dateHeure: {
            gte: debutGraphiqueHydraulique,
            lt: debutDemain,
          },
        },
        select: {
          dateHeure: true,
          volumeDistribue: true,
        },
      }),

      // Factures échues
      this.prisma.facture.findMany({
        where: {
          dateLimite: {
            lt: maintenant,
          },
        },
        select: {
          montantTotal: true,
          paiment: {
            select: {
              montantPaye: true,
            },
          },
        },
      }),
    ]);

    // --------------------------------------------------
    // 1. INDICATEURS PRINCIPAUX
    // --------------------------------------------------

    const chiffreAffairesMois = Number(
      recettesMois._sum.montant ?? 0,
    );

    const depensesDuMois = Number(
      depensesMois._sum.montant ?? 0,
    );

    const recettesBp = Number(
      recettesBpMois._sum.montant ?? 0,
    );

    const recettesBf = Number(
      recettesBfMois._sum.montant ?? 0,
    );

    const volumeProduitMois = Number(
      productionsMois._sum.volumeProduit ?? 0,
    );

    const volumeDistribueMois = Number(
      distributionsMois._sum.volumeDistribue ?? 0,
    );

    const rendementGlobal =
      volumeProduitMois > 0
        ? (volumeDistribueMois / volumeProduitMois) * 100
        : 0;

    // Taux de recouvrement global
    const totalBpEncaisse = Number(
      recettesBpGlobales._sum.montant ?? 0,
    );

    const totalBfEncaisse = Number(
      recettesBfGlobales._sum.montant ?? 0,
    );

    const totalFacturesBp = Number(
      facturesBp._sum.montantTotal ?? 0,
    );

    const totalBfTheorique = Number(
      await this.prisma.versementKiosque.aggregate({
        _sum: {
          recetteTheorique: true,
        },
      }).then((result) => result._sum.recetteTheorique ?? 0),
    );

    const totalEncaisse = totalBpEncaisse + totalBfEncaisse;
    const totalAttendu = totalFacturesBp + totalBfTheorique;

    const tauxRecouvrement =
      totalAttendu > 0
        ? (totalEncaisse / totalAttendu) * 100
        : 0;

    // --------------------------------------------------
    // 2. GRAPHIQUE RECETTES / DEPENSES SUR 12 MOIS
    // --------------------------------------------------

    const moisGraphique = Array.from(
      { length: 12 },
      (_, index) => {
        const date = new Date(
          maintenant.getFullYear(),
          maintenant.getMonth() - 11 + index,
          1,
        );

        const cle = [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, '0'),
        ].join('-');

        return {
          mois: cle,
          libelle: date.toLocaleDateString('fr-FR', {
            month: 'short',
            year: '2-digit',
          }),
          recettes: 0,
          depenses: 0,
        };
      },
    );

    const moisMap = new Map(
      moisGraphique.map((mois) => [mois.mois, mois]),
    );

    const obtenirCleMois = (date: Date) =>
      `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}`;

    for (const recette of recettesMensuelles) {
      const mois = moisMap.get(
        obtenirCleMois(recette.dateRecete),
      );

      if (mois) {
        mois.recettes += Number(recette.montant);
      }
    }

    for (const depense of depensesMensuelles) {
      const mois = moisMap.get(
        obtenirCleMois(depense.dateDepense),
      );

      if (mois) {
        mois.depenses += Number(depense.montant);
      }
    }

    // --------------------------------------------------
    // 3. GRAPHIQUE PRODUCTION / DISTRIBUTION SUR 30 JOURS
    // --------------------------------------------------

    const joursGraphique = Array.from(
      { length: 30 },
      (_, index) => {
        const date = new Date(debutGraphiqueHydraulique);
        date.setDate(date.getDate() + index);

        const cle = [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, '0'),
          String(date.getDate()).padStart(2, '0'),
        ].join('-');

        return {
          date: cle,
          jour: date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
          }),
          production: 0,
          distribution: 0,
        };
      },
    );

    const joursMap = new Map(
      joursGraphique.map((jour) => [jour.date, jour]),
    );

    const obtenirCleJour = (date: Date) =>
      [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-');

    for (const production of productionsGraphique) {
      const jour = joursMap.get(
        obtenirCleJour(production.dateHeure),
      );

      if (jour) {
        jour.production += Number(production.volumeProduit);
      }
    }

    for (const distribution of distributionsGraphique) {
      const jour = joursMap.get(
        obtenirCleJour(distribution.dateHeure),
      );

      if (jour) {
        jour.distribution += Number(distribution.volumeDistribue);
      }
    }

    // --------------------------------------------------
    // 4. ALERTES STRATEGIQUES
    // --------------------------------------------------

    const facturesImpayees = facturesEchues.filter((facture) => {
      const totalPaye = facture.paiment.reduce(
        (total, paiement) =>
          total + Number(paiement.montantPaye),
        0,
      );

      return totalPaye < Number(facture.montantTotal);
    }).length;

    const volumeEauPerdu = Math.max(
      0,
      volumeProduitMois - volumeDistribueMois,
    );

    // --------------------------------------------------
    // 5. REPONSE DU DASHBOARD
    // --------------------------------------------------

    return {
      statistiques: {
        tauxRecouvrement: Number(tauxRecouvrement.toFixed(2)),
        chiffreAffairesMois: Number(
          chiffreAffairesMois.toFixed(2),
        ),
        rendementGlobal: Number(rendementGlobal.toFixed(2)),
        nombreAbonnes,
      },

      graphiques: {
        recettesDepenses: moisGraphique,

        recettesParSource: {
          bp: Number(recettesBp.toFixed(2)),
          bf: Number(recettesBf.toFixed(2)),
        },

        productionDistribution: joursGraphique,
      },

      alertes: {
        facturesImpayees,
        volumeEauPerdu: Number(volumeEauPerdu.toFixed(2)),
      },
    };
  }



async getGerantDashboard() {
  const maintenant = new Date();

  const debutJour = new Date(maintenant);
  debutJour.setHours(0, 0, 0, 0);

  const debutDemain = new Date(debutJour);
  debutDemain.setDate(debutDemain.getDate() + 1);

  const debutMois = new Date(
    maintenant.getFullYear(),
    maintenant.getMonth(),
    1,
  );

  const libellesRecettes = [
    'VERSEMENT_BP',
    'VERSEMENT_KIOSQUE',
  ] as const;

  const [
    recettesJour,
    recettesMois,
    facturesMois,
    versementsMois,
    facturesEchues,
    impayesBf,
    kiosques,
  ] = await Promise.all([
    // Recettes BP + BF encaissées aujourd'hui
    this.prisma.recete.aggregate({
      where: {
        dateRecete: {
          gte: debutJour,
          lt: debutDemain,
        },
        libelleRecete: {
          in: [...libellesRecettes],
        },
      },
      _sum: { montant: true },
    }),

    // Recettes réellement encaissées ce mois-ci
    this.prisma.recete.aggregate({
      where: {
        dateRecete: {
          gte: debutMois,
          lt: debutDemain,
        },
        libelleRecete: {
          in: [...libellesRecettes],
        },
      },
      _sum: { montant: true },
    }),

    // Objectif BP : factures émises ce mois-ci
    this.prisma.facture.aggregate({
      where: {
        dateEdition: {
          gte: debutMois,
          lt: debutDemain,
        },
      },
      _sum: { montantTotal: true },
    }),

    // Objectif BF : recettes théoriques des kiosques ce mois-ci
    this.prisma.versementKiosque.aggregate({
      where: {
        dateVersement: {
          gte: debutMois,
          lt: debutDemain,
        },
      },
      _sum: { recetteTheorique: true },
    }),

    // Factures échues : calcul du reste à payer
    this.prisma.facture.findMany({
      where: {
        dateLimite: { lt: maintenant },
      },
      select: {
        montantTotal: true,
        paiment: {
          select: { montantPaye: true },
        },
      },
    }),

    // Reste à payer BF
    this.prisma.versementKiosque.aggregate({
      _sum: { restePayer: true },
    }),

    // Tous les kiosques et leurs versements du mois
    this.prisma.kiosque.findMany({
      select: {
        idKiosque: true,
        numKiosque: true,
        versements: {
          where: {
            dateVersement: {
              gte: debutMois,
              lt: debutDemain,
            },
          },
          select: {
            dateVersement: true,
            recetteVersee: true,
          },
        },
      },
      orderBy: {
        numKiosque: 'asc',
      },
    }),
  ]);

  // Montant encaissé aujourd'hui
  const recettesEncaisseesAujourdhui = Number(
    recettesJour._sum.montant ?? 0,
  );

  // Recettes actuelles du mois
  const recetteActuelle = Number(
    recettesMois._sum.montant ?? 0,
  );

  // Objectif mensuel BP + BF
  const objectifBp = Number(
    facturesMois._sum.montantTotal ?? 0,
  );

  const objectifBf = Number(
    versementsMois._sum.recetteTheorique ?? 0,
  );

  const objectifMensuel = objectifBp + objectifBf;

  const progression = objectifMensuel > 0
    ? (recetteActuelle / objectifMensuel) * 100
    : 0;

  // Impayés BP : factures échues moins paiements reçus
  const impayesBp = facturesEchues.reduce((total, facture) => {
    const montantPaye = facture.paiment.reduce(
      (somme, paiement) =>
        somme + Number(paiement.montantPaye),
      0,
    );

    const reste = Math.max(
      0,
      Number(facture.montantTotal) - montantPaye,
    );

    return total + reste;
  }, 0);

  // Impayés totaux BP + BF
  const impayesTotal =
    impayesBp + Number(impayesBf._sum.restePayer ?? 0);

  // Statut mensuel des kiosques
  const statutKiosques = kiosques.map((kiosque) => ({
    idKiosque: kiosque.idKiosque,
    numKiosque: kiosque.numKiosque,
    statut: kiosque.versements.length > 0
      ? 'PAYE'
      : 'EN_RETARD',
    recetteVersee: kiosque.versements.reduce(
      (total, versement) =>
        total + Number(versement.recetteVersee),
      0,
    ),
  }));

  const kiosquesEnRetard = statutKiosques.filter(
    (kiosque) => kiosque.statut === 'EN_RETARD',
  ).length;

  return {
    statistiques: {
      recettesEncaisseesAujourdhui: Number(
        recettesEncaisseesAujourdhui.toFixed(2),
      ),
      montantImpayes: Number(impayesTotal.toFixed(2)),
      kiosquesEnRetard,
    },

    objectifMensuel: {
      bp: Number(objectifBp.toFixed(2)),
      bf: Number(objectifBf.toFixed(2)),
      total: Number(objectifMensuel.toFixed(2)),
      recetteActuelle: Number(recetteActuelle.toFixed(2)),
      progression: Number(progression.toFixed(2)),
    },

    kiosques: statutKiosques,
  };
}


async getTechnicienDashboard() {
  // Récupération des données en parallèle
  const [
    forages,
    coupuresActives,
    derniereProduction,
    derniereDistribution,
  ] = await Promise.all([
    // Statut de tous les forages
    this.prisma.forage.findMany({
      select: {
        idForage: true,
        statut: true,
      },
    }),

    // Coupures non encore clôturées
    this.prisma.coupureEau.count({
      where: {
        dateFin: null,
      },
    }),

    // Dernière production enregistrée
    this.prisma.productionEau.findFirst({
      orderBy: {
        dateHeure: 'desc',
      },
      select: {
        dateHeure: true,
        volumeProduit: true,
      },
    }),

    // Dernière distribution enregistrée
    this.prisma.distributionEau.findFirst({
      orderBy: {
        dateHeure: 'desc',
      },
      select: {
        dateHeure: true,
        volumeDistribue: true,
      },
    }),
  ]);

  // --------------------------------------------------
  // ÉTAT DES FORAGES
  // --------------------------------------------------

  const nombreForages = forages.length;

  const foragesEnService = forages.filter(
    (forage) => String(forage.statut) === 'EN_SERVICE',
  ).length;

  const foragesIndisponibles =
    nombreForages - foragesEnService;

  // --------------------------------------------------
  // DERNIER RENDEMENT
  // --------------------------------------------------

  let dernierRendement: {
    valeur: number;
    dateMesure: Date;
    volumeProduit: number;
    volumeDistribue: number;
  } | null = null;

  if (derniereProduction && derniereDistribution) {
    const volumeProduit = Number(
      derniereProduction.volumeProduit,
    );

    const volumeDistribue = Number(
      derniereDistribution.volumeDistribue,
    );

    if (volumeProduit > 0) {
      const rendement =
        (volumeDistribue / volumeProduit) * 100;

      const dateMesure = new Date(
        Math.max(
          derniereProduction.dateHeure.getTime(),
          derniereDistribution.dateHeure.getTime(),
        ),
      );

      dernierRendement = {
        valeur: Number(rendement.toFixed(2)),
        dateMesure,
        volumeProduit,
        volumeDistribue,
      };
    }
  }

  // --------------------------------------------------
  // RÉPONSE
  // --------------------------------------------------

  return {
    statistiques: {
      equipementsIndisponibles: foragesIndisponibles,
      coupuresActives,
    },

    dernierRendement,

    graphiques: {
      etatForages: {
        total: nombreForages,
        enService: foragesEnService,
        enPanne: foragesIndisponibles,
      },
    },
  };
}

}
