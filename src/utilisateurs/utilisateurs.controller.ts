import { Controller, Get, Post, Body, Patch, UseGuards, Param, Delete } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service.js';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto.js';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto.js';
import { ChangerMotDePasseDto } from './dto/create-utilisateur.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('utilisateurs')
export class UtilisateursController {
  constructor(private readonly utilisateursService: UtilisateursService) {}

  @Post()
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateursService.create(createUtilisateurDto);
  }

  @Get()
  findAll() {
    return this.utilisateursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utilisateursService.findOne(+id);
  }

  @Patch(':id')
  update(@CurrentUser('idUtilisateur') id: number, @Body() updateUtilisateurDto: UpdateUtilisateurDto) {
    return this.utilisateursService.update(id, updateUtilisateurDto);
  }

  @Patch(':id/mot-de-passe')
  changerMotDePasse(@CurrentUser('idUtilisateur') id: number, @Body() changerMotDePasseDto: ChangerMotDePasseDto,
  ) {
    return this.utilisateursService.changePassword(id, changerMotDePasseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilisateursService.remove(+id);
  }
}
