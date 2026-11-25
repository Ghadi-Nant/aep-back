import { Controller, Body, UseGuards, Get, Patch } from '@nestjs/common';
import { ParametreService } from './parametre.service';
import { CreateParametreDto } from './dto/create-parametre.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('parametre')
export class ParametreController {
  constructor(private readonly parametreService: ParametreService) {}

  @Get()
  //@Roles('ADMIN')
  async getParametres() {
    return this.parametreService.obtenirParametres();
  }
  
  @Patch()
  //@Roles('ADMIN')
  async updateParametres(@Body() body: CreateParametreDto) {
    return this.parametreService.mettreAJour(body);
  }
}
