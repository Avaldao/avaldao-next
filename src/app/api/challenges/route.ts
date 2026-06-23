import { getAddress } from 'ethers';
import crypto from 'crypto';
import ChallengeModel from '@/lib/db/models/challenge-model';
import { translations } from '@/translations';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawAddress = searchParams.get('address');
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'es';

    if (!rawAddress) {
      return new Response(JSON.stringify({ error: 'Address parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(rawAddress)) {
      return new Response(JSON.stringify({ error: 'Invalid Ethereum address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const address = getAddress(rawAddress);
    const nonce = crypto.randomUUID();
    const expirationDate = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const t = (key: string) => translations[key]?.[lang] ?? key;
    const message = t('challenge.message.body')
      .replace('{{nonce}}', nonce)
      .replace('{{expiry}}', expirationDate.toISOString());

    await ChallengeModel.findOneAndUpdate(
      { address },
      { message, expirationDate },
      { upsert: true }
    );

    return new Response(JSON.stringify({ message, address }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Error generating challenge:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
