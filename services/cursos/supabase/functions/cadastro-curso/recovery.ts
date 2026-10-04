import { createClient } from 'npm:@supabase/supabase-js@2.105.4';
import { ApiError } from './handler.ts';

export function createRecovery(url: string, publicKey: string, transport: typeof fetch = fetch) {
  if (url !== 'https://ydmvbssgiffqrmwigkae.supabase.co' || !publicKey) throw new Error('Projeto invalido');
  // A fresh client per operation avoids sharing Auth sessions between concurrent requests.
  const client = () =>
    createClient(url, publicKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: {
        fetch: (input, init) =>
          transport(input, { ...init, signal: AbortSignal.timeout(8000), redirect: 'error' }),
      },
    });
  return {
    async requestCode(email: string) {
      const { error } = await client().auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
      if (error) throw new ApiError(error.status === 429 ? 429 : 503, 'envio_indisponivel');
    },
    async verifyCode(email: string, code: string): Promise<string> {
      const auth = client().auth;
      const { data, error } = await auth.verifyOtp({ email, token: code, type: 'email' });
      if (error || !data.session) throw new ApiError(401, 'codigo_invalido');
      try {
        const { data: verified, error: userError } = await auth.getUser(data.session.access_token);
        if (
          userError || !verified.user?.email_confirmed_at || !verified.user.email ||
          verified.user.is_anonymous
        ) {
          throw new ApiError(401, 'codigo_invalido');
        }
        return verified.user.email;
      } finally {
        // No Auth access/refresh token is returned to the browser or persisted by this backend.
        await auth.signOut({ scope: 'local' });
      }
    },
  };
}
