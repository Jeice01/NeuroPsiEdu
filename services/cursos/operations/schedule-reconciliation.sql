-- Optional activation script, NOT an automatic migration. Review/apply only after
-- remote deployment is authorized, functions are healthy and Vault is configured.
-- Requires pg_cron, pg_net and Vault. Does not create or print secrets.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
DO $$ BEGIN
  IF (SELECT count(*) FROM vault.decrypted_secrets WHERE name='cursos_project_url')<>1
    OR (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='cursos_project_url')
      IS DISTINCT FROM 'https://ydmvbssgiffqrmwigkae.supabase.co'
    OR (SELECT count(*) FROM vault.decrypted_secrets WHERE name='cursos_reconciliation_secret'
      AND length(decrypted_secret)>=32)<>1 THEN
    RAISE EXCEPTION 'Configure the courses project URL and reconciliation secret in Vault first';
  END IF;
END $$;
SELECT cron.schedule('cursos-conciliacao','*/5 * * * *',$job$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='cursos_project_url')||'/functions/v1/conciliar-cursos',
    headers := jsonb_build_object('Content-Type','application/json','Authorization',
      'Bearer '||(SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='cursos_reconciliation_secret')),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
$job$);
COMMIT;
