# Vaultify

Um gerenciador de senhas **end-to-end encrypted** desenvolvido como projeto de portfólio para demonstrar boas práticas de desenvolvimento Front-end.

As senhas são cifradas no navegador antes de chegarem ao banco — o servidor nunca vê os dados em texto puro.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org) (strict)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Supabase](https://supabase.com) (Auth + PostgreSQL)
- [Lucide](https://lucide.dev) (ícones)

## Funcionalidades

- Autenticação por e-mail/senha com Supabase Auth (sessão via cookies)
- CRUD de senhas com criptografia AES-GCM no cliente
- Busca, copiar e revelar senha
- Perfil editável
- Troca de senha com re-embrulho automático da chave de dados
- Layout responsivo (3 colunas no desktop, 2 no tablet, 1 no mobile; sidebar vira drawer)
- Proteção de rotas no servidor (Server Components) + refresh de sessão via proxy

## Arquitetura de segurança

O cofre usa **envelope encryption**: a chave que cifra os dados é protegida por uma chave derivada da sua senha de acesso.

```
Senha do usuário
      │  PBKDF2-SHA256 (310.000 iterações) + salt aleatório
      ▼
   KEK (Key Encryption Key)   ──▶   protege (AES-GCM) o DEK
      │
      ▼
   DEK (Data Encryption Key)  ──▶   cifra cada senha (AES-GCM, IV aleatório)
```

- **KEK**: derivada da senha no login, via PBKDF2-SHA256 com salt de 16 bytes por usuário. Nunca é armazenada.
- **DEK**: chave AES-GCM de 256 bits gerada no cadastro, **embrulhada** pelo KEK e persistida em `profiles.wrapped_key`. Só existe desembrulhada em memória.
- **Dados**: `username` e `password` são cifrados no navegador com o DEK. `site` fica em texto puro para permitir busca/filtro no servidor (trade-off documentado).
- **Sessão**: o DEK é mantido em `sessionStorage` — sobrevive a recarregamentos, mas é descartado ao fechar a aba (auto-lock).
- **Autorização**: Row Level Security do PostgreSQL restringe cada linha ao dono (`auth.uid()`).
- **Troca de senha**: a senha atual é verificada localmente e o DEK é re-embrulhado com o novo KEK.

> Nota: a troca de senha pressupõe que **Secure password change** esteja desativado no Supabase (padrão). Com ele ativo, é necessário um fluxo de OTP por e-mail via `reauthenticate()`.

## Estrutura do projeto

```
app/
  (app)/               # rotas autenticadas (passwords, settings)
  login/               # autenticação
components/
  auth/                # formulário de login/cadastro
  password-card/       # cartão de senha
  password-form/       # modal de criação/edição
  password-list/       # grade + busca + estados de loading/erro
  sidebar/             # navegação (drawer no mobile)
  settings/            # perfil, segurança e sessão
  vault/               # provider que restaura a chave do cofre
lib/
  crypto.ts            # envelope encryption (Web Crypto)
  vault-key.ts         # cache do DEK (sessionStorage)
  passwords.ts         # hooks + CRUD de senhas
  profile.ts           # perfil e configuração do cofre
  supabase/            # clients (browser e servidor)
supabase/
  schema.sql           # tabelas, RLS e triggers
proxy.ts               # refresh de sessão (Next 16)
```

## Como rodar

### 1. Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Authentication → Sign In / Providers → Email**, desative **Confirm email** (ambiente de desenvolvimento).
3. No **SQL Editor**, execute `supabase/schema.sql`.

### 2. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com as credenciais do projeto em **Project Settings → API**:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

### 3. Instalar e rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando            | Descrição              |
| ------------------ | ---------------------- |
| `npm run dev`      | Servidor de desenvolvimento |
| `npm run build`    | Build de produção      |
| `npm run start`    | Servidor de produção   |
| `npm run lint`     | ESLint                 |

## Limitações conhecidas

- `site` armazenado em texto puro (busca no servidor).
- DEK mantido em `sessionStorage` (pragmatismo para evitar re-login a cada refresh); para maior segurança, manter apenas em memória.
- Sem recuperação de conta: perder a senha de acesso impossibilita desembrulhar o cofre (propriedade inerente à criptografia client-side).

## Licença

MIT — livre para estudo e uso como referência.
