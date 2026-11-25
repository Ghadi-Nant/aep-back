import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { RoleUtilisateur } from '../../generated/prisma/enums.js';

export class CreateUtilisateurDto {
  @IsString({ message: "Le nom doit être une chaîne de caractères" })
  @IsOptional()
  nom?: string;

  @IsEmail({}, { message: "L'adresse email n'est pas valide" })
  @IsOptional()
  email?: string;

  @IsString({ message: "Le téléphone doit être une chaîne de caractères" })
  @IsOptional()
  telephone?: string;

  /*@IsString({ message: "Le mot de passe est requis" })
  @MinLength(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
  motDePasse: string;*/

  @IsEnum(RoleUtilisateur, { message: "Le rôle spécifié n'est pas valide" })
  @IsOptional()
  roleUtilisateur?: RoleUtilisateur;
}

export class ChangerMotDePasseDto {
  @IsString({ message: "L'ancien mot de passe est requis" })
  ancienMotDePasse: string;

  @IsString({ message: "Le nouveau mot de passe est requis" })
  @MinLength(6, { message: "Le nouveau mot de passe doit contenir au moins 6 caractères" })
  nouveauMotDePasse: string;
}