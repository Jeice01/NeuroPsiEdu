import {
  createChallengeVerifier,
  createRpc,
} from "../cadastro-curso/adapters.ts";
import { createInterestHandler } from "./handler.ts";

const required = (name: string): string => {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Configuracao obrigatoria ausente: ${name}`);
  return value;
};

Deno.serve(createInterestHandler({
  origins: required("CURSOS_ALLOWED_ORIGINS").split(",").map((origin) =>
    origin.trim()
  ),
  turmaId: required("CURSOS_INTERESSE_TURMA_ID"),
  rateSecret: required("CURSOS_RATE_SECRET"),
}, {
  rpc: createRpc(
    required("SUPABASE_URL"),
    required("SUPABASE_SERVICE_ROLE_KEY"),
  ),
  verifyChallenge: createChallengeVerifier(
    required("CURSOS_TURNSTILE_SECRET"),
    fetch,
    "interesse_curso",
  ),
}));
