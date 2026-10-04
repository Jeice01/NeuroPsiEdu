import { createRecovery } from './recovery.ts';

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

Deno.test('Auth adapter requests OTP, verifies server user and revokes its temporary session', async () => {
  const paths: string[] = [];
  const user = {
    id: '10000000-0000-4000-8000-000000000001',
    email: 'test@example.test',
    email_confirmed_at: '2026-01-01T00:00:00Z',
    aud: 'authenticated',
    is_anonymous: false,
  };
  const recovery = createRecovery(
    'https://ydmvbssgiffqrmwigkae.supabase.co',
    'synthetic-key',
    async (input, init) => {
      const path = new URL(String(input)).pathname;
      paths.push(path);
      assert(init?.signal instanceof AbortSignal, 'Auth requests must have a timeout');
      if (path.endsWith('/otp')) {
        const body = JSON.parse(String(init?.body));
        assert(
          body.email === user.email && body.create_user === true,
          'OTP must support legacy participants without Auth users',
        );
        return Response.json({});
      }
      if (path.endsWith('/verify')) {
        return Response.json({
          user,
          access_token: 'synthetic-access',
          refresh_token: 'synthetic-refresh',
          expires_in: 3600,
          token_type: 'bearer',
        });
      }
      if (path.endsWith('/user')) return Response.json(user);
      if (path.endsWith('/logout')) return new Response(null, { status: 204 });
      throw new Error('Unexpected Auth request');
    },
  );
  await recovery.requestCode(user.email);
  assert(
    await recovery.verifyCode(user.email, '123456') === user.email,
    'Only verified email may be returned',
  );
  assert(
    paths.includes('/auth/v1/user') && paths.includes('/auth/v1/logout'),
    'Must verify identity and revoke session',
  );
});

Deno.test('Auth adapter rejects invalid OTP and does not return a capability or provider error', async () => {
  const recovery = createRecovery(
    'https://ydmvbssgiffqrmwigkae.supabase.co',
    'synthetic-key',
    async () =>
      Response.json({ error_code: 'otp_expired', msg: 'sensitive-provider-detail' }, { status: 403 }),
  );
  try {
    await recovery.verifyCode('test@example.test', '000000');
    throw new Error('Expected rejection');
  } catch (error) {
    assert(error instanceof Error && error.message === 'codigo_invalido', 'Expose only safe error');
  }
});
