import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AepModule } from './aep/aep.module.js';
import { ConfigModule } from '@nestjs/config'
import { ForageModule } from './forage/forage.module.js';
import { DevisModule } from './devis/devis.module.js';
import { StockModule } from './stock/stock.module.js';
import { RecetteModule } from './recette/recette.module.js';
import { DepenseModule } from './depense/depense.module.js';
import { CoupureEauModule } from './coupure-eau/coupure-eau.module.js';
import { MaintenanceModule } from './maintenance/maintenance.module.js';
import { PaimentModule } from './paiment/paiment.module.js';
import { FactureModule } from './facture/facture.module.js';
import { ReleveModule } from './releve/releve.module.js';
import { CompteurModule } from './compteur/compteur.module.js';
import { AbonneModule } from './abonne/abonne.module.js';
import { VersementKiosqueModule } from './versement-kiosque/versement-kiosque.module.js';
import { KiosqueModule } from './kiosque/kiosque.module.js';
import { DistributionEauModule } from './distribution-eau/distribution-eau.module.js';
import { ProductionEauModule } from './production-eau/production-eau.module.js';
import { PointEauModule } from './point-eau/point-eau.module.js';
import { ConduiteModule } from './conduite/conduite.module.js';
import { PanneauModule } from './panneau/panneau.module.js';
import { ReservoirModule } from './reservoir/reservoir.module.js';
import { PompeModule } from './pompe/pompe.module.js';
//import { ForageModule } from './forage/forage.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module.js';
import { UtilisateursSessionsModule } from './utilisateurs-sessions/utilisateurs-sessions.module.js';
import { DashboardModule } from './dashboard/dashboard.module';
import { ParametreModule } from './parametre/parametre.module';
import { AuthSharedModule } from './auth-shared/auth-shared.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'gestion_aep',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AepModule,
    ForageModule,
    PompeModule,
    ReservoirModule,
    PanneauModule,
    ConduiteModule,
    PointEauModule,
    ProductionEauModule,
    DistributionEauModule,
    KiosqueModule,
    VersementKiosqueModule,
    AbonneModule,
    CompteurModule,
    ReleveModule,
    FactureModule,
    PaimentModule,
    MaintenanceModule,
    CoupureEauModule,
    DepenseModule,
    RecetteModule,
    StockModule,
    DevisModule,
    AuthModule,
    UtilisateursModule,
    UtilisateursSessionsModule,
    DashboardModule,
    ParametreModule,
    AuthSharedModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService]
})
export class AppModule {}
