import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UtilisateursSessionsService } from './utilisateurs-sessions.service.js';


@Controller('utilisateurs-sessions')
export class UtilisateursSessionsController {
  constructor(private readonly utilisateursSessionsService: UtilisateursSessionsService) {}
}
