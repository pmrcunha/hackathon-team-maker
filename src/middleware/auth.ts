import type { Context, Next } from 'hono'
import { auth } from '../auth.js'

export async function requireAuth(c: Context, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.redirect('/login');
  }

  c.set('user', session.user);
  c.set('session', session.session);
  await next();
}

export async function optionalAuth(c: Context, next: Next) {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (session) {
      c.set('user', session.user);
      c.set('session', session.session);
    }
  } catch (error) {
  }

  await next();
}
