-- Vaultify cleanup (one-time)
-- Remove a tabela public.profiles antiga e incompatível (vazia) e o trigger
-- antigo de auth que falhava no signup. Execute ANTES do schema.sql.

drop trigger if exists on_auth_user_created on auth.users;

drop table if exists public.profiles;

drop function if exists public.handle_new_user();

drop function if exists public.set_updated_at();

-- Diagnóstico: lista triggers não-internos restantes em auth.users.
-- Se aparecer algo aqui, informe o nome antes de continuar.
select tgname
from pg_trigger
where tgrelid = 'auth.users'::regclass
  and not tgisinternal;
