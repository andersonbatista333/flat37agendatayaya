import { getStore } from '@netlify/blobs';

export const handler = async () => {
  try {
    const store = getStore('tayaya-availability');
    const data = await store.get('state', { type: 'json' });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data ?? {}),
    };
  } catch (err) {
    console.error('[get-availability]', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao buscar disponibilidade' }),
    };
  }
};
