# Vaultify

## Objetivo

Vaultify é um gerenciador de senhas desenvolvido para fins de portfólio.
O foco é demonstrar boas práticas de desenvolvimento Front-end e Full Stack.

---

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Framer Motion
- Supabase
- PostgreSQL

---

## Arquitetura

- Utilizar App Router.
- Componentes reutilizáveis.
- Evitar lógica de negócio dentro dos componentes.
- Utilizar Server Components sempre que possível.
- Client Components apenas quando necessário.

---

## Estilo de código

- TypeScript strict.
- Componentes pequenos.
- Funções curtas.
- Nomes em inglês.
- Comentários apenas quando realmente necessários.

---

## UI

Tema escuro.

Paleta:

Background: #070B19

Sidebar: #141C2F

Card: #273247

Hover: #33425C

Border: #394860

Primary: #5A84FF

Text: #F4F6FA

Muted: #9AA4B7

Bordas arredondadas de 12px.

Usar espaçamento de múltiplos de 4.

---

## Componentes

Cada componente deve possuir apenas uma responsabilidade.

Exemplo:

components/

    sidebar/

    password-card/

    search-input/

    profile-menu/

    topbar/

---

## Convenções

- Não duplicar código.
- Preferir composição.
- Usar Tailwind.
- Evitar CSS Modules.
- Não utilizar bibliotecas pesadas sem necessidade.

---

## UX

Todas as animações devem durar entre 150ms e 250ms.

Botões possuem hover.

Inputs possuem focus visível.

Cards possuem animação de hover.

---

## Responsividade

Desktop:
3 colunas.

Tablet:
2 colunas.

Mobile:
1 coluna.

Sidebar vira Drawer.

---

## Objetivo do projeto

O código deve parecer profissional e servir como portfólio para vagas de Desenvolvedor Front-end.