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

interface IdentityReviewInfo {
  _id: { toString(): string };
  name: string;
  email: string;
  address?: string;
  accountType?: 'personal' | 'business';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  cuit?: string;
  platformRoles?: string[];
}

/** Casilla del equipo que verifica identidades. */
const IDENTITY_REVIEW_EMAIL = process.env.IDENTITY_REVIEW_EMAIL || 'avaldao.sgr@gmail.com';

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

  /**
   * Avisa al equipo de Avaldao que hay un usuario con identidad por verificar.
   * Va siempre a la casilla del equipo, en español. Nunca lanza: una falla de
   * email no debe impedir la activación de la cuenta.
   */
  async notifyIdentityReview(user: IdentityReviewInfo): Promise<void> {
    try {
      const business = user.accountType === 'business';
      const name = business ? user.companyName : [user.firstName, user.lastName].filter(Boolean).join(' ');
      const link = `${process.env.NEXT_PUBLIC_SITE_URL}/staff/users/${user._id}`;
      const values: Record<string, string> = {
        ACCOUNT_TYPE: business ? 'Empresa' : 'Persona',
        NAME: escapeHtml(name || user.name),
        CUIT: escapeHtml(user.cuit || '—'),
        EMAIL: escapeHtml(user.email),
        ADDRESS: escapeHtml(user.address),
        ROLES: escapeHtml(
          (user.platformRoles ?? []).map((r) => r.replace(/_ROLE$/, '').toLowerCase()).join(', ') || '—'
        ),
        USER_LINK: link,
      };

      await sendMail({
        to: IDENTITY_REVIEW_EMAIL,
        subject: `Usuario para verificar: ${name || user.name}`,
        text: `Usuario para verificar: ${name || user.name} (${user.email})\n${link}`,
        html: this._renderTemplate('es', 'identity-review-email.html', values),
      });
    } catch (error) {
      console.error(`[notifications] Falló el aviso de verificación del usuario ${user._id}`, error);
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
