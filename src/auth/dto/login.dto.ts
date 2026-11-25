import { IsNotEmpty, IsString } from 'class-validator';

export class ConnexionDto {
  @IsString({ message: "L'identifiant (email ou téléphone) est requis" })
  @IsNotEmpty({ message: "L'identifiant ne peut pas être vide" })
  identifiant: string; // Peut être l'email ou le téléphone

  @IsString({ message: "Le mot de passe est requis" })
  @IsNotEmpty({ message: "Le mot de passe ne peut pas être vide" })
  motDePasse: string;
}