import { Injectable } from "@nestjs/common";
import * as React from 'react';
import { render } from '@react-email/render'; 
import * as nodemailer from 'nodemailer';
import { ConfigService } from "@nestjs/config";
import PasswordResetEmail from "./templates/reset-password.template";

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        
        this.transporter = nodemailer.createTransport({
            host: this.configService.getOrThrow<string>('SMTP_HOST'), 
            port: this.configService.getOrThrow<number>('SMTP_PORT'), 
            secure: this.configService.get<string>('SMTP_SECURE') === 'true', 
            auth: {
                user: this.configService.getOrThrow<string>('SMTP_USER'),
                pass: this.configService.getOrThrow<string>('SMTP_PASS'),
            },
        });
    }


    async sendResetPasswordEmail(to: string, options: { resetLink?: string; otpCode?: string }) {
        try {
            const { resetLink, otpCode } = options;
            const isMobile = !!otpCode;

            const subject = 'Réinitialisation de votre mot de passe - ECLA EA';
            
            let htmlContent = '';

            if (isMobile) {
                htmlContent = `
                    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                        <h2 style="color: #10B981;">ECLA EA - Réinitialisation</h2>
                        <p>Voici votre code de vérification à 6 chiffres pour réinitialiser votre mot de passe :</p>
                        <div style="background: #f4f4f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; margin: 20px 0;">
                            ${otpCode}
                        </div>
                        <p style="font-size: 12px; color: #71717a;">Ce code est valide pendant 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
                    </div>
                `;
            } else {
                htmlContent = await render(
                    React.createElement(PasswordResetEmail, {
                        companyName: 'ECLA EA',
                        url: resetLink,
                    })
                );
            }

            await this.transporter.sendMail({
                from: `"ECLA EA" <${this.configService.get<string>('SMTP_USER')}`,
                to,
                subject,
                html: htmlContent,
            });

            console.log(`Email de réinitialisation (${isMobile ? 'Mobile - OTP' : 'Desktop - Link'}) envoyé à ${to}`);

        } catch (error: any) {
            throw new Error(`Erreur d'envoi SMTP: ${error.message}`);
        }
    }
}