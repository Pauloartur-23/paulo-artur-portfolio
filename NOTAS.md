# NOTAS — Portfólio

## Feito (11/11/2026)
- Projeto Vue 3 + Vite + TS em `Documents/portfolio`, branch `feat/portfolio-inicial`.
- Direção: "prancheta de engenharia editorial": papel claro + grafite, um laranja de sinal (`--signal-500`), Bricolage Grotesque (display/texto), Instrument Serif itálico (palavras de destaque) e JetBrains Mono (rótulos). Assinatura: grade de prancheta com marcas de corte no Hero e preloader de terminal (`$ npm run paulo`).
- Referência: Dennis Snellenberg (composição, cursor, botões magnéticos, menu redondo). Receitas de motion da skill motion-transicoes (nk.studio, landonorris.com).
- Seções: Hero (foto recortada sem fundo, nome gigante com profundidade), Sobre, Projetos (índice com miniatura que segue o mouse + 3 estudos de caso com colagem de notebook/celular e faixa de telas), Stack (marquee ligado ao scroll), Trajetória (linha que se preenche), Contato.
- Prints tirados rodando cada projeto localmente (Playwright, 1440×900 e 390×844), convertidos para WebP.
- Foto 3 recortada com máscara por cor de fundo (PIL + scipy); foto 2 recortada para tirar o borrão.
- Acessibilidade: skip link, menu com foco preso e Esc, reduced motion desliga animações e preloader, alt em todas as imagens.
- Lighthouse (build de produção): Acessibilidade 100, Boas práticas 100, SEO 100 (mobile e desktop).
- Desempenho (celular simulado, 4G lenta, CPU 4x): CLS 0; LCP ~6,8s, travado pela abertura (preloader) e não pelo download (a foto chega em ~2,1s). O preloader só roda na 1ª visita da sessão.

## Feito (11/11/2026, branch feat/motion-v2)
- Cor contínua: cada seção mistura a cor da anterior até a própria enquanto entra (scrub). Cada projeto tem um tom próprio (`bg` em `content.ts`).
- Cortina laranja com o nome da seção ao navegar para longe (menu, índice, botões).
- Hero: letras entram por elipse, profundidade com o mouse e, no computador, fica preso enquanto o nome se abre e a foto se afasta.
- Hover com letras rolando (`RollText.vue`) em menu, nomes de projetos, botões e links do contato.
- Projetos: tela que cresce presa ao scroll até virar uma moldura grande com legenda; faixa de telas e marquee inclinam com a velocidade do scroll.
- Títulos com bloco laranja (`data-reveal="block"`), barra de progresso, contador da seção no cabeçalho, cursor com 3 estados e grão animado.
- Paleta refinada (grafite mais fundo, papel mais quente). Lighthouse segue 100/100/100 (acessibilidade, boas práticas, SEO).

## Feito (12/11/2026, branch feat/motion-v2)
- Hero: mesma composição, com entrada nova (foto sai do desfoque, "Pereira" tomba letra a letra, textos por máscara), luz laranja e inclinação 3D seguindo o mouse, saída em "cartão" arredondado e selo circular "role para conhecer" que acelera com a rolagem.
- Sobre: sem foto; no lugar, "Full Stack" tipográfico com parallax. Botão "Ver projetos" agora é pílula com seta (`MagneticButton.vue` reescrito).
- Lista de projetos: cartão grande que segue o mouse com atraso, inclina com a velocidade e troca de projeto por cortina; a linha ganha faixa no tom do projeto e mostra as tecnologias.
- Projetos: removida a tela que crescia presa à rolagem.
- Trajetória: removidos PAE/SEPE e Mutirão Hackathon.
- Rodapé novo: "Vamos conversar?" gigante, e-mail enorme clicável + copiar, links grandes (E-mail, LinkedIn, GitHub) e nome gigante correndo com a rolagem. Sem foto.
- `src/assets/images/paulo-sorriso.webp` ficou sem uso (não entra no build); pode ser apagado.

## Ajustes (12/11/2026, depois)
- Abertura: a página começa a animar junto com a cortina do 100%, sem esperar.
- Foto do Hero não se mexe com o mouse (só o nome e a grade têm profundidade).
- Rastro do mouse: linha laranja em canvas que some em ~0,45s (SiteCursor.vue), só no computador.
- Projetos sem cor de fundo própria nem brilho; detalhes de cor só no laranja do site (campos `hue`/`bg` removidos de content.ts).
- Transição do menu: cortina laranja + grafite, número da seção, nome letra a letra e linha de carregamento (useMotion.scrollToTarget + effects.css).
- Removidos os pontos de luz: brilho atrás da foto, brilho dos projetos e halos das bolinhas de "disponível".

## Dados para o Paulo confirmar
- E-mail público no site: pauloartur.ifc@gmail.com (está em `src/data/content.ts`).
- Localização "Santa Catarina, Brasil".
- Trajetória: a frase sobre a monitoria foi deduzida do nome da pasta. Conferir. Não há anos, de propósito.
- Link "Código no GitHub" de cada projeto aponta para o perfil (github.com/Pauloartur-23), não para o repositório específico. O Organization está na org URBAN-SITES.

## Falta / ideias
- Deploy na Vercel (preview → aprovação → produção).
- Imagem Open Graph (og:image) para compartilhamento.
- Links diretos de repositório/demo de cada projeto quando estiverem públicos.
- Opcional: incluir Urban Connect e Urban IA como projetos menores.

## Observações
- No banco local do Urban Training foi criado o usuário `demo` com treinos fictícios só para os prints.
- `referencias/prints/` (PNGs originais) fica fora do git.
