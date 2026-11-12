import burgersHome from '@/assets/projects/burgers/desk-home.webp'
import burgersMenu from '@/assets/projects/burgers/desk-cardapio.webp'
import burgersItem from '@/assets/projects/burgers/desk-cardapio-1.webp'
import burgersLogin from '@/assets/projects/burgers/desk-login.webp'
import burgersMobHome from '@/assets/projects/burgers/mob-home.webp'
import burgersMobItem from '@/assets/projects/burgers/mob-cardapio-1.webp'
import orgHome from '@/assets/projects/organization/desk-home.webp'
import orgKanban from '@/assets/projects/organization/desk-kanban.webp'
import orgChat from '@/assets/projects/organization/desk-chat.webp'
import orgReports from '@/assets/projects/organization/desk-relatorios.webp'
import orgMobHome from '@/assets/projects/organization/mob-home.webp'
import orgMobChat from '@/assets/projects/organization/mob-chat.webp'
import trainingHome from '@/assets/projects/training/desk-home.webp'
import trainingProgress from '@/assets/projects/training/desk-progresso.webp'
import trainingHistory from '@/assets/projects/training/desk-historico.webp'
import trainingLogin from '@/assets/projects/training/desk-login.webp'
import trainingMobHome from '@/assets/projects/training/mob-home.webp'
import trainingMobPlan from '@/assets/projects/training/mob-plano.webp'

export const profile = {
  name: 'Paulo Artur Pereira',
  firstName: 'Paulo Artur',
  lastName: 'Pereira',
  role: 'Desenvolvedor Full Stack',
  location: 'Santa Catarina, Brasil',
  email: 'pauloartur.ifc@gmail.com',
  github: 'https://github.com/Pauloartur-23',
  githubUser: 'Pauloartur-23',
  linkedin: 'https://www.linkedin.com/in/paulo-artur-pereira-1748172b8',
}

// Fundos da cor contínua no scroll (hex porque o GSAP não interpola oklch). Espelham os tokens.
export const scene = {
  paper: '#F4F1EB',
  paperDeep: '#E6E2DB',
  ink: '#0B0C10',
}

export interface Shot {
  src: string
  alt: string
}

export interface Project {
  id: string
  index: string
  name: string
  kind: string
  tagline: string
  summary: string
  features: string[]
  stack: string[]
  cover: Shot
  desktop: Shot[]
  mobile: Shot[]
}

export const projects: Project[] = [
  {
    id: 'urban-burgers',
    index: '01',
    name: 'Urban Burgers',
    kind: 'Delivery · e-commerce',
    tagline: 'Uma hamburgueria que dá fome antes do primeiro clique.',
    summary:
      'Site e loja de uma hamburgueria artesanal: cardápio vivo vindo da API, carrinho, conta do cliente e pedido fechado direto no WhatsApp. A identidade escura e neon foi pensada para parecer o salão da casa.',
    features: [
      'Cardápio por categoria com busca, filtros e página de cada item',
      'Carrinho, favoritos e finalização do pedido pelo WhatsApp',
      'Cadastro, login com JWT e recuperação de senha',
      'Painel administrativo para a equipe da loja',
    ],
    stack: ['Vue 3', 'Pinia', 'Vue Router', 'Django REST', 'SimpleJWT', 'PostgreSQL', 'Cloudinary'],
    cover: { src: burgersHome, alt: 'Página inicial do Urban Burgers com hambúrguer em destaque e o título Mais que um lanche' },
    desktop: [
      { src: burgersHome, alt: 'Hero do Urban Burgers com chamada para o cardápio' },
      { src: burgersMenu, alt: 'Cardápio do Urban Burgers com filtros e cards de lanches' },
      { src: burgersItem, alt: 'Página de detalhe do lanche Urban Classic com preço e botão de adicionar' },
      { src: burgersLogin, alt: 'Tela de login do Urban Burgers com foto de hambúrguer e letreiro neon' },
    ],
    mobile: [
      { src: burgersMobHome, alt: 'Urban Burgers no celular: página inicial' },
      { src: burgersMobItem, alt: 'Urban Burgers no celular: detalhe do lanche' },
    ],
  },
  {
    id: 'urban-organization',
    index: '02',
    name: 'Urban Organization',
    kind: 'SaaS · gestão de equipes',
    tagline: 'O escritório inteiro de uma equipe, dentro de uma aba.',
    summary:
      'Plataforma de gestão para organizações: quadros Kanban por projeto, setores e times com cargos, chat em tempo real, calendário, reuniões gravadas, relatórios e um assistente de IA. Funciona como app instalável (PWA) no celular.',
    features: [
      'Quadros Kanban com etiquetas, checklists, prazos e histórico de atividade',
      'Organizações, setores e times com convites e permissões por cargo',
      'Chat, notificações e chamadas em tempo real (WebSockets + LiveKit)',
      'Relatórios com gráficos, calendário, arquivos e assistente de IA',
    ],
    stack: ['Vue 3', 'TypeScript', 'Tailwind 4', 'Django REST', 'Channels', 'Celery', 'PWA'],
    cover: { src: orgKanban, alt: 'Quadro Kanban do Urban Organization com colunas A fazer, Em andamento e Concluído' },
    desktop: [
      { src: orgHome, alt: 'Dashboard do Urban Organization com projetos recentes e tarefas do dia' },
      { src: orgKanban, alt: 'Quadro Kanban do projeto Lançamento do App' },
      { src: orgChat, alt: 'Chat em tempo real do Urban Organization' },
      { src: orgReports, alt: 'Relatórios com gráficos de tarefas concluídas e atraso por setor' },
    ],
    mobile: [
      { src: orgMobHome, alt: 'Urban Organization no celular: dashboard' },
      { src: orgMobChat, alt: 'Urban Organization no celular: conversa no chat' },
    ],
  },
  {
    id: 'urban-training',
    index: '03',
    name: 'Urban Training',
    kind: 'App web · treino e evolução',
    tagline: 'Sua ficha de treino, agora com memória e progressão.',
    summary:
      'App de registro de treinos: monte a semana, anote cada série e veja a carga subir. Tem regras de progressão automática, histórico completo e um painel de evolução com mapa dos músculos trabalhados. Baseado no openGym, com catálogo de mais de 5 mil exercícios.',
    features: [
      'Plano semanal com rotinas por dia e planos prontos',
      'Treino ao vivo com séries, carga, repetições e RIR',
      'Progressão de carga automática e recordes pessoais',
      'Painel de progresso: frequência anual, músculos e peso corporal',
    ],
    stack: ['Vue 3', 'TypeScript', 'Vue Router', 'Django REST', 'SQLite', 'Vitest'],
    cover: { src: trainingHome, alt: 'Tela inicial do Urban Training com o treino do dia Costas e bíceps' },
    desktop: [
      { src: trainingHome, alt: 'Treino do dia no Urban Training com lista de exercícios e semana' },
      { src: trainingProgress, alt: 'Painel de progresso com mapa de músculos trabalhados nos últimos 30 dias' },
      { src: trainingHistory, alt: 'Histórico de treinos agrupado por mês' },
      { src: trainingLogin, alt: 'Tela de login do Urban Training com o título Evolução real' },
    ],
    mobile: [
      { src: trainingMobHome, alt: 'Urban Training no celular: treino do dia' },
      { src: trainingMobPlan, alt: 'Urban Training no celular: plano da semana' },
    ],
  },
]

export interface SkillGroup {
  title: string
  note: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Interface',
    note: 'O que a pessoa vê e toca.',
    items: ['Vue.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML & CSS', 'GSAP'],
  },
  {
    title: 'Servidor',
    note: 'O que sustenta tudo por trás.',
    items: ['Python', 'Django', 'Django REST', 'APIs REST', 'WebSockets', 'PostgreSQL'],
  },
  {
    title: 'Ofício',
    note: 'Como o trabalho chega ao fim.',
    items: ['Git & GitHub', 'Vite', 'Docker', 'Vercel & Render', 'Testes', 'Design de UI'],
  },
]

export const marqueeWords = ['Vue.js', 'React', 'TypeScript', 'Django', 'Python', 'Tailwind', 'JavaScript', 'Full Stack']
