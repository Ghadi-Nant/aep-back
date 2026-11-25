
import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import puppeteer from 'puppeteer';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { FactureService } from './facture.service.js';

@Injectable()
export class FacturePdfService {
  constructor(
    private readonly factureService: FactureService,
  ) {}

  async generatePdf(id: number): Promise<Buffer> {
    let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

    try {
      // 1. Récupérer les données de la facture
      const data = await this.factureService.getFacturePdfData(id);

      // 2. Charger le template HTML
      const templatePath = join(
        process.cwd(),
        'src',
        'facture',
        'templates',
        'facture.template.html',
      );

      let html = await readFile(templatePath, 'utf-8');

      // 3. Charger le logo et le convertir en Base64
      const logoPath = join(
        process.cwd(),
        'src',
        'facture',
        'templates',
        'assets',
        'logo-eclaea.png',
      );

      const logo = await readFile(logoPath);
      const logoBase64 = `data:image/png;base64,${logo.toString('base64')}`;

      html = html.replaceAll('./assets/logo-eclaea.png', logoBase64);

      // 4. Remplacer les variables du template
      const escapeHtml = (value: unknown): string => {
        return String(value ?? '').replace(/[&<>"']/g, (character) => {
          const entities: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          };

          return entities[character];
        });
      };

      html = html.replace(
        /{{\s*([\w.]+)\s*}}/g,
        (_match, key: string) => {
          const value = key.split('.').reduce<unknown>((current, part) => {
            if (
              current !== null &&
              typeof current === 'object' &&
              part in current
            ) {
              return (current as Record<string, unknown>)[part];
            }

            return undefined;
          }, data);

          return escapeHtml(value);
        },
      );

      // 5. Générer le PDF
      browser = await puppeteer.launch({
        headless: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: 'load',
      });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
      });

      return Buffer.from(pdf);
    } catch (error) {
      console.error('Erreur génération PDF :', error);

      throw new InternalServerErrorException(
        'Impossible de générer la facture PDF.',
      );
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
