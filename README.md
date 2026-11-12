# Portfólio — Paulo Artur Pereira

Site pessoal de Paulo Artur Pereira, desenvolvedor Full Stack. Página única com Hero animado, sobre, projetos (Urban Burgers, Urban Organization e Urban Training), tecnologias, trajetória e contato.

Feito com **Vue 3 + Vite + TypeScript**, animações com **GSAP** (ScrollTrigger, SplitText) e rolagem suave com **Lenis**. CSS próprio, organizado em tokens e cascade layers.

## Instalar

```bash
npm install
```

## Rodar

```bash
npm run dev
```

Abre em http://localhost:5173.

## Gerar a versão final

```bash
npm run build
npm run preview
```

O build checa os tipos (`vue-tsc`) e gera a pasta `dist/`.

## Deploy (Vercel)

1. Importe o repositório na Vercel. Ela detecta o Vite sozinha (build `npm run build`, saída `dist`).
2. Publique primeiro como **preview** e confira o link.
3. Depois de aprovado, promova para produção.

## Onde mexer

- Textos, projetos, links e trajetória: `src/data/content.ts`
- Cores, fontes, espaçamentos e curvas de animação: `src/styles/tokens.css`
- Seções: `src/components/sections/`
- Imagens dos projetos (WebP): `src/assets/projects/`
- Fotos do Hero e do contato: `public/images/`
