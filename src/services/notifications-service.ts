import 'server-only';
import path from 'path';
import fs from 'fs';
import { sendMail } from '@/lib/email';
import UserModel from '@/lib/db/models/user-model';

type Language = 'es' | 'en';

interface NewAvalInfo {
  _id: { toString(): string };
  proyecto: string;
  montoFiat: number;
  cuotasCantidad: number;
  avaldaoAddress: string;
  solicitanteAddress: string;
}

type ReadyToSignAvalInfo = Omit<NewAvalInfo, 'solicitanteAddress'>;

interface Recipient {
  email: string;
  language: Language;
}

const escapeHtml = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)
  );

const SUBJECTS: Record<Language, string> = {
  es: 'Nuevo aval para evaluar',
  en: 'New guarantee to review',
};

const READY_TO_SIGN_SUBJECTS: Record<Language, string> = {
  es: 'Aval listo para firmar',
  en: 'Guarantee ready to sign',
};

export default class NotificationsService {

  /**
   * Destinatario de las notificaciones de un aval: el usuario cuya address es
   * la del Avaldao del aval (la única que puede registrarlo onchain). Si no hay
   * usuario con email asociado, se usa AVALDAO_NOTIFICATION_EMAIL como respaldo.
   */
  private async _getAvaldaoRecipient(avaldaoAddress: string): Promise<Recipient | null> {
    const user = await UserModel.findOne({
      address: { $regex: `^${avaldaoAddress}$`, $options: 'i' },
      email: { $exists: true, $ne: '' },
    });

    if (user) {
      return { email: user.email, language: user.language === 'en' ? 'en' : 'es' };
    }

    const fallback = process.env.AVALDAO_NOTIFICATION_EMAIL;
    return fallback ? { email: fallback, language: 'es' } : null;
  }

  /**
   * Avisa al Avaldao de un aval recién solicitado. Nunca lanza: una falla de
   * email no debe impedir que el aval se cree.
   */
  async notifyNewAval(aval: NewAvalInfo): Promise<void> {
    try {
      const recipient = await this._getAvaldaoRecipient(aval.avaldaoAddress);
      if (!recipient) {
        console.warn(`[notifications] Sin destinatario para el aval ${aval._id} (avaldao ${aval.avaldaoAddress})`);
        return;
      }

      const solicitante = await UserModel.findOne({
        address: { $regex: `^${aval.solicitanteAddress}$`, $options: 'i' },
      });

      const link = `${process.env.NEXT_PUBLIC_SITE_URL}/avales/${aval._id}`;
      const values: Record<string, string> = {
        PROJECT: escapeHtml(aval.proyecto),
        REQUESTER: escapeHtml(solicitante?.name ?? aval.solicitanteAddress),
        AMOUNT: escapeHtml((aval.montoFiat / 100).toLocaleString(recipient.language === 'en' ? 'en-US' : 'es-AR')),
        INSTALLMENTS: escapeHtml(aval.cuotasCantidad),
        AVAL_LINK: link,
      };

      await sendMail({
        to: recipient.email,
        subject: `${SUBJECTS[recipient.language]}: ${aval.proyecto}`,
        text: `${SUBJECTS[recipient.language]}: ${aval.proyecto}\n${link}`,
        html: this._renderTemplate(recipient.language, 'new-aval-email.html', values),
      });
    } catch (error) {
      console.error(`[notifications] Falló la notificación del aval ${aval._id}`, error);
    }
  }

  /**
   * Avisa al Avaldao que el resto de los participantes ya firmó y solo falta su
   * firma y el envío onchain (sign()) para que el aval pase a Vigente. Nunca
   * lanza: una falla de email no debe impedir el registro de la firma.
   */
  async notifyAvalReadyToSign(aval: ReadyToSignAvalInfo): Promise<void> {
    try {
      const recipient = await this._getAvaldaoRecipient(aval.avaldaoAddress);
      if (!recipient) {
        console.warn(`[notifications] Sin destinatario para el aval ${aval._id} (avaldao ${aval.avaldaoAddress})`);
        return;
      }

      const link = `${process.env.NEXT_PUBLIC_SITE_URL}/avales/${aval._id}`;
      const values: Record<string, string> = {
        PROJECT: escapeHtml(aval.proyecto),
        AMOUNT: escapeHtml((aval.montoFiat / 100).toLocaleString(recipient.language === 'en' ? 'en-US' : 'es-AR')),
        INSTALLMENTS: escapeHtml(aval.cuotasCantidad),
        AVAL_LINK: link,
      };

      await sendMail({
        to: recipient.email,
        subject: `${READY_TO_SIGN_SUBJECTS[recipient.language]}: ${aval.proyecto}`,
        text: `${READY_TO_SIGN_SUBJECTS[recipient.language]}: ${aval.proyecto}\n${link}`,
        html: this._renderTemplate(recipient.language, 'aval-ready-to-sign-email.html', values),
      });
    } catch (error) {
      console.error(`[notifications] Falló la notificación de firmas del aval ${aval._id}`, error);
    }
  }

  private _renderTemplate(language: Language, file: string, values: Record<string, string>): string {
    const templatePath = path.join(process.cwd(), 'emails', language, file);
    return Object.entries(values).reduce(
      (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, value),
      fs.readFileSync(templatePath, 'utf-8')
    );
  }
}
