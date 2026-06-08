import { getStore } from '@netlify/blobs';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Netlify Identity: verifica JWT automaticamente e popula context.clientContext.user
  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Não autorizado — faça login como admin' }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    const store = getStore('tayaya-availability');
    await store.set('state', JSON.stringify(data));
    console.log(`[save-availability] Salvo por: ${user.email}`);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, savedBy: user.email }),
    };
  } catch (err) {
    console.error('[save-availability]', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao salvar disponibilidade' }),
    };
  }
};
