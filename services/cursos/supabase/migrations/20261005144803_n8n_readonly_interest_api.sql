BEGIN;

CREATE SCHEMA automacao_privada;
REVOKE ALL ON SCHEMA automacao_privada FROM PUBLIC,anon,authenticated;
GRANT USAGE ON SCHEMA automacao_privada TO authenticated,service_role;

CREATE TABLE automacao_privada.permissoes (
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recurso text NOT NULL CHECK (recurso IN ('interesses_curso')),
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY(usuario_id,recurso)
);
ALTER TABLE automacao_privada.permissoes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON automacao_privada.permissoes FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE ON automacao_privada.permissoes TO service_role;

-- This private, fixed query is the only privileged bridge. Every request checks
-- the server-managed allowlist; clients cannot grant themselves access through
-- user metadata. Revocation takes effect even for an unexpired access token.
CREATE FUNCTION automacao_privada.ler_interesses_curso()
RETURNS SETOF public.lista_interesses_curso
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM automacao_privada.permissoes p
    WHERE p.usuario_id=auth.uid() AND p.recurso='interesses_curso' AND p.ativo
  ) THEN
    RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='automacao_nao_autorizada';
  END IF;
  RETURN QUERY SELECT * FROM public.lista_interesses_curso;
END;
$$;
REVOKE ALL ON FUNCTION automacao_privada.ler_interesses_curso() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION automacao_privada.ler_interesses_curso() TO authenticated;

CREATE VIEW public.automacao_interesses_curso WITH (security_invoker=true) AS
SELECT * FROM automacao_privada.ler_interesses_curso();
REVOKE ALL ON public.automacao_interesses_curso FROM PUBLIC,anon,authenticated,service_role;
GRANT SELECT ON public.automacao_interesses_curso TO authenticated;

NOTIFY pgrst,'reload schema';
COMMIT;
