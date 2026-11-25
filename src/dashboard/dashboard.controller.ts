import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard() {
    return this.dashboardService.getDashboard();
  }

  @Get('gerant')
  getGerantDashboard() {
    return this.dashboardService.getGerantDashboard();
  }


  @Get('technicien')
  getTechnicienDashboard() {
    return this.dashboardService.getTechnicienDashboard();
  }

}