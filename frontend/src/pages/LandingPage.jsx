/* ============================================================================
   LANDING PAGE — FIO

   COMO ESTÁ ORGANIZADO (use Ctrl+F no número/nome para achar cada parte):

   1. IMPORTS
   2. CONTEÚDO ........ todos os textos e listas da página (edite aqui)
   3. PÁGINA .......... ordem das seções (mude a ordem aqui)
   4. SEÇÕES .......... uma por bloco, na mesma ordem em que aparecem
        4.01 Header          4.08 Finance (Financeiro)
        4.02 Hero            4.09 Audience (Para quem é)
        4.03 Problems        4.10 Steps (Como funciona)
        4.04 Modules + modal 4.11 Benefits (Por que Fio)
        4.05 Production      4.12 FinalCta
        4.06 Inventory       4.13 Footer
        4.07 Overview
   5. BLOCO REUTILIZÁVEL: Showcase
   ============================================================================ */

/* ============================================================================
   1. IMPORTS
   ============================================================================ */
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowRight,
  Boxes,
  Check,
  Factory,
  Mail,
  Menu,
  PackageCheck,
  Phone,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react'
import { Container } from '../components/layout/Container'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import {
  FinanceMock,
  FullDashboard,
  InventoryMock,
  ProductionBoard,
} from '../features/landing/components/ProductMocks'

/* ============================================================================
   2. CONTEÚDO — edite os textos aqui, sem mexer nas seções
   ============================================================================ */

// "Entrar" abre o login. "Começar agora" abre a mesma tela já no modo "Criar conta".
const LOGIN_HREF = '/login'
const SIGNUP_HREF = '/login?modo=cadastro'

// WhatsApp: número com país + DDD, só dígitos.
// `origem` entra na mensagem para você saber de onde o cliente veio.
const WHATSAPP_NUMBER = '5581995718479'
function whatsappLink(origem) {
  const message = `Olá! Vim pelo site do Fio (${origem}) e quero saber mais sobre o sistema.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

// Seção "A realidade de hoje": [símbolo, rótulo, texto]
const problems = [
  ['◌', 'WhatsApp', 'Pedidos espalhados'],
  ['▤', 'Planilhas', 'Estoque difícil de acompanhar'],
  ['⌁', 'Papel', 'Produção sem visibilidade'],
  ['↗', 'Financeiro', 'Dinheiro sem clareza'],
]

// Cards da seção "Tudo conectado": [ícone, título, descrição curta]
const modules = [
  [UsersRound, 'Clientes', 'Saiba quem compra de você.'],
  [Boxes, 'Estoque', 'Saiba exatamente o que você tem.'],
  [Factory, 'Produção', 'Saiba onde está cada lote.'],
  [PackageCheck, 'Vendas', 'Venda com mais organização.'],
  [WalletCards, 'Financeiro', 'Saiba para onde vai o dinheiro.'],
]

// Conteúdo do modal aberto por "Conhecer módulo".
// A chave precisa ser IGUAL ao título do módulo na lista acima.
// Confira se cada item existe de fato no produto hoje.
const moduleDetails = {
  Clientes: {
    headline: 'Saiba quem compra de você, e quanto.',
    bullets: [
      'Cadastro completo de clientes com contato e endereço',
      'Histórico de pedidos e compras de cada cliente',
      'Veja quem compra mais e quem sumiu',
    ],
    highlight: 'Chega de procurar o contato na conversa do WhatsApp.',
  },
  Estoque: {
    headline: 'Saiba exatamente o que você tem.',
    bullets: [
      'Matéria-prima e produtos acabados controlados separadamente',
      'Grades e variações organizadas (P, M, G e cores)',
      'Alertas quando um item fica abaixo do mínimo',
    ],
    highlight: 'Estoque conectado à produção: o que é usado sai do saldo.',
  },
  Produção: {
    headline: 'Do corte à entrega, sem perder nenhum lote.',
    bullets: [
      'Ordens de produção acompanhadas etapa por etapa',
      'Saiba quem está produzindo cada lote e a data prevista',
      'Visão de todos os lotes ativos em um quadro só',
    ],
    highlight: 'Acabou o caderno: cada lote tem status e responsável.',
  },
  Vendas: {
    headline: 'Venda com mais organização.',
    bullets: [
      'Registre pedidos e vendas em poucos cliques',
      'Acompanhe as vendas do dia e da semana',
      'Pedidos ligados ao cliente e ao estoque',
    ],
    highlight: 'Todo pedido em um lugar só, não espalhado em conversas.',
  },
  Financeiro: {
    headline: 'Saiba para onde vai o dinheiro.',
    bullets: [
      'Entradas, saídas e compromissos em uma visão simples',
      'Veja o que você tem a receber e a pagar',
      'Fluxo de caixa do mês com o saldo atualizado',
    ],
    highlight: 'Venda hoje e saiba o que entra amanhã.',
  },
}

// Seção "Para quem é": [título, texto]
const audiences = [
  ['Lojistas', 'Organize clientes, vendas e estoque.'],
  ['Atacadistas', 'Tenha controle de pedidos e produtos.'],
  ['Confecções', 'Acompanhe produção e insumos.'],
  ['Pequenas operações', 'Troque planilhas e papel por uma operação organizada.'],
]

// Seção "Como funciona": [título, texto] (a numeração 01, 02... é automática)
const steps = [
  ['Cadastre', 'Clientes, produtos, fornecedores e insumos.'],
  ['Registre', 'Pedidos, vendas e ordens de produção.'],
  ['Acompanhe', 'Estoque, produção e financeiro em tempo real.'],
  ['Decida', 'Use os números para saber onde sua operação precisa de atenção.'],
]

// Seção "Por que Fio": [título, texto]
const benefits = [
  ['Tudo conectado', 'Cliente, pedido, estoque, produção e financeiro conversam entre si.'],
  ['Feito para sua realidade', 'Pensado para o dia a dia do comércio e da produção têxtil.'],
  ['Simples de usar', 'Sem precisar transformar sua operação em um projeto de TI.'],
]

// Links do rodapé: [rótulo, destino]
const footerProductLinks = [
  ['Funcionalidades', '#funcionalidades'],
  ['Como funciona', '#como-funciona'],
  ['Para quem é', '#para-quem'],
]
const footerCompanyLinks = [
  ['Sobre', '#inicio'],
  ['Contato', 'mailto:contato@seccolab.com.br'],
]

/* ============================================================================
   3. PÁGINA — a ordem abaixo é a ordem em que as seções aparecem
   ============================================================================ */
export function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problems />
        <Modules />
        <Production />
        <Inventory />
        <Overview />
        <Finance />
        <Audience />
        <Steps />
        <Benefits />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}

/* ============================================================================
   4. SEÇÕES
   ============================================================================ */

/* ---------- 4.01 Header (menu do topo) ---------- */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="site-header">
      <Container className="nav">
        <a className="brand" href="#inicio">
          f<span>i</span>o
        </a>

        {/* Menu (no celular abre como painel) */}
        <nav className={isMenuOpen ? 'nav-links is-open' : 'nav-links'}>
          <a onClick={closeMenu} href="#funcionalidades">Funcionalidades</a>
          <a onClick={closeMenu} href="#como-funciona">Como funciona</a>
          <a onClick={closeMenu} href="#para-quem">Para quem é</a>
          <a className="mobile-login" href={LOGIN_HREF}>Entrar</a>
          <Button href={SIGNUP_HREF} className="mobile-cta">
            Começar agora <ArrowRight size={16} />
          </Button>
        </nav>

        {/* Botões do canto direito (desktop) */}
        <div className="nav-actions">
          <a href={LOGIN_HREF}>Entrar</a>
          <Button href={SIGNUP_HREF}>
            Começar agora <ArrowRight size={16} />
          </Button>
        </div>

        {/* Botão hambúrguer (celular) */}
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </Container>
    </header>
  )
}

/* ---------- 4.02 Hero (primeira dobra) ---------- */
function Hero() {
  return (
    <section className="hero" id="inicio">
      <Container>
        <div className="hero-copy">
          <p className="eyebrow">GESTÃO FEITA PARA O TÊXTIL</p>
          <h1>
            Sua operação têxtil,
            <br />
            <em>finalmente</em> sob controle.
          </h1>
          <p className="lead">
            Clientes, vendas, estoque, produção e caixa em um só lugar. Sem depender de
            planilhas, cadernos ou dezenas de conversas no WhatsApp.
          </p>

          <div className="hero-actions">
            <Button href={SIGNUP_HREF}>
              Começar agora <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" href="#como-funciona">
              Ver como funciona <span>↓</span>
            </Button>
          </div>

          <p className="microcopy">
            <i>✓</i> Feito para lojistas, atacadistas e pequenas confecções.
          </p>
        </div>

        <div className="hero-product">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <FullDashboard />
        </div>
      </Container>
    </section>
  )
}

/* ---------- 4.03 Problems (A realidade de hoje) ---------- */
function Problems() {
  return (
    <section className="section problem-section">
      <Container>
        <div className="section-heading centered">
          <p className="eyebrow">A REALIDADE DE HOJE</p>
          <h2>
            Você não precisa trabalhar mais.
            <br />
            Precisa ter <em>mais controle.</em>
          </h2>
        </div>

        <div className="problem-grid">
          {problems.map(([symbol, label, text]) => (
            <article className="problem-card" key={label}>
              <span>{symbol}</span>
              <small>{label}</small>
              <h3>{text}</h3>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ---------- 4.04 Modules (Tudo conectado) + modal "Conhecer módulo" ---------- */
function Modules() {
  const [active, setActive] = useState(null) // título do módulo aberto, ou null
  const closeModal = useCallback(() => setActive(null), [])
  const current = modules.find(([, title]) => title === active)

  return (
    <section className="section solution-section" id="funcionalidades">
      <Container>
        <div className="split-heading">
          <div>
            <p className="eyebrow">TUDO CONECTADO</p>
            <h2>
              Tudo o que sua operação precisa.
              <br />
              <em>Em um só lugar.</em>
            </h2>
          </div>
          <p>
            Do primeiro contato com o cliente até o dinheiro entrando no caixa, você
            acompanha a operação sem precisar trocar de ferramenta.
          </p>
        </div>

        <div className="module-grid">
          {modules.map(([Icon, title, description]) => (
            <article
              className="module-card is-clickable"
              key={title}
              onClick={() => setActive(title)}
            >
              <div className="module-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <button
                type="button"
                className="module-link"
                aria-haspopup="dialog"
                aria-label={`Conhecer módulo ${title}`}
              >
                Conhecer módulo <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </div>
      </Container>

      {current && (
        <ModuleModal Icon={current[0]} title={current[1]} onClose={closeModal} />
      )}
    </section>
  )
}

// Modal do módulo. Fecha com o X, com Esc ou clicando fora.
function ModuleModal({ Icon, title, onClose }) {
  const closeRef = useRef(null)
  const details = moduleDetails[title]

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden' // trava o scroll da página
    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus?.() // devolve o foco ao card
    }
  }, [onClose])

  if (!details) return null

  return createPortal(
    <div
      className="module-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="module-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="module-modal-title"
      >
        <button
          ref={closeRef}
          type="button"
          className="module-modal-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <div className="module-icon">
          <Icon size={22} />
        </div>
        <h3 id="module-modal-title">{title}</h3>
        <p className="module-modal-headline">{details.headline}</p>

        <ul className="module-modal-list">
          {details.bullets.map((item) => (
            <li key={item}>
              <Check size={16} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="module-modal-highlight">{details.highlight}</p>

        <a className="module-modal-cta" href={SIGNUP_HREF} onClick={onClose}>
          Começar agora <ArrowRight size={16} />
        </a>
      </div>
    </div>,
    document.body
  )
}

/* ---------- 4.05 Production (fundo escuro) ---------- */
function Production() {
  return (
    <Showcase
      dark
      id="producao"
      eyebrow="PRODUÇÃO"
      title={
        <>
          Do corte à entrega,
          <br />
          <em>sem perder nenhum lote.</em>
        </>
      }
      text="Acompanhe cada ordem de produção e saiba exatamente o que está acontecendo, quem está produzindo e o que ainda precisa ser feito."
      visual={<ProductionBoard />}
    />
  )
}

/* ---------- 4.06 Inventory (Estoque inteligente) ---------- */
function Inventory() {
  return (
    <section className="section inventory-section">
      <Container className="feature-two-col">
        <div className="feature-copy">
          <p className="eyebrow">ESTOQUE INTELIGENTE</p>
          <h2>
            Do tecido à peça pronta.
            <br />
            <em>Você sabe o que tem.</em>
          </h2>
          <p>
            Controle matéria-prima e produtos acabados separadamente, com visão clara de
            disponibilidade, reservas e produção.
          </p>
          <div className="check-list">
            <span>✓ Estoques conectados à produção</span>
            <span>✓ Grades e variações organizadas</span>
            <span>✓ Alertas para reposição</span>
          </div>
        </div>

        <InventoryMock />
      </Container>
    </section>
  )
}

/* ---------- 4.07 Overview (Visão geral) ---------- */
function Overview() {
  return (
    <Showcase
      eyebrow="VISÃO GERAL"
      title={
        <>
          Abra o sistema e saiba como está
          <br />
          <em>o seu negócio.</em>
        </>
      }
      text="Uma visão clara para você agir com rapidez — vendas, estoque, produção e contas importantes em uma única tela."
      visual={<FullDashboard />}
    />
  )
}

/* ---------- 4.08 Finance (Financeiro) ---------- */
function Finance() {
  return (
    <section className="section finance-section">
      <Container className="feature-two-col reverse">
        <FinanceMock />

        <div className="feature-copy">
          <p className="eyebrow">FINANCEIRO</p>
          <h2>
            Venda hoje. Saiba
            <br />
            <em>o que entra amanhã.</em>
          </h2>
          <p>
            Tenha uma visão simples das entradas, saídas e compromissos financeiros da
            operação.
          </p>
          <a className="text-link" href="#comece">
            Organize seu caixa <ArrowRight size={17} />
          </a>
        </div>
      </Container>
    </section>
  )
}

/* ---------- 4.09 Audience (Para quem é) ---------- */
function Audience() {
  return (
    <section className="section audience-section" id="para-quem">
      <Container>
        <div className="section-heading">
          <p className="eyebrow">PARA QUEM É</p>
          <h2>
            Feito para quem vive
            <br />
            <em>o mercado têxtil.</em>
          </h2>
        </div>

        <div className="audience-grid">
          {audiences.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ---------- 4.10 Steps (Como funciona) ---------- */
function Steps() {
  return (
    <section className="section steps-section" id="como-funciona">
      <Container>
        <div className="section-heading centered">
          <p className="eyebrow">COMO FUNCIONA</p>
          <h2>
            Comece simples.
            <br />
            <em>Tenha controle rápido.</em>
          </h2>
        </div>

        <div className="steps">
          {steps.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ---------- 4.11 Benefits (Por que Fio) ---------- */
function Benefits() {
  return (
    <section className="section benefits-section">
      <Container>
        <div className="benefit-intro">
          <p className="eyebrow">POR QUE FIO</p>
          <h2>
            Menos tempo procurando informação.
            <br />
            <em>Mais tempo cuidando do negócio.</em>
          </h2>
        </div>

        <div className="benefit-grid">
          {benefits.map(([title, text]) => (
            <article key={title}>
              <span>✦</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ---------- 4.12 FinalCta (chamada final) ---------- */
function FinalCta() {
  return (
    <section className="final-cta" id="comece">
      <Container>
        <div>
          <Badge tone="sand">O próximo passo é mais simples</Badge>
          <h2>
            Sua operação merece
            <br />
            <em>mais controle.</em>
          </h2>
          <p>Centralize clientes, vendas, estoque, produção e financeiro em um único lugar.</p>
          <Button href={SIGNUP_HREF}>
            Começar agora <ArrowRight size={18} />
          </Button>
        </div>

        <div className="cta-art">
          <span>f</span>
          <i />
          <b>i</b>
          <i />
          <span>o</span>
        </div>
      </Container>
    </section>
  )
}

/* ---------- 4.13 Footer (rodapé) ---------- */
function Footer() {
  return (
    <footer>
      <Container>
        <div className="footer-main">
          <div>
            <a className="brand" href="#inicio">
              f<span>i</span>o
            </a>
            <p>Gestão simples para negócios têxteis.</p>
          </div>

          <FooterGroup title="Produto" links={footerProductLinks} />
          <FooterGroup title="Empresa" links={footerCompanyLinks} />

          <div className="footer-contact">
            <b>Contato</b>
            <a href="mailto:contato@seccolab.com.br">
              <Mail size={14} />contato@seccolab.com.br
            </a>
            <a href={whatsappLink('rodapé')} target="_blank" rel="noreferrer">
              <Phone size={14} />(81) 99571-8479
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Fio. Todos os direitos reservados.</span>
          <a
            className="secco-credit"
            href="https://seccolab.com.br"
            target="_blank"
            rel="noreferrer"
          >
            Criado por <strong>Secco</strong> <ArrowRight size={13} />
          </a>
          <span>Feito no Brasil para o mercado têxtil.</span>
        </div>
      </Container>
    </footer>
  )
}

function FooterGroup({ title, links }) {
  return (
    <div>
      <b>{title}</b>
      {links.map(([label, href]) => (
        <a key={label} href={href}>{label}</a>
      ))}
    </div>
  )
}

/* ============================================================================
   5. BLOCO REUTILIZÁVEL
   ============================================================================ */

// Texto de um lado, visual do produto do outro.
// Usado em Production (dark) e Overview.
function Showcase({ eyebrow, title, text, visual, dark, id }) {
  return (
    <section id={id} className={`section showcase ${dark ? 'showcase--dark' : ''}`}>
      <Container className="showcase-layout">
        <div className="showcase-intro">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="showcase-visual">{visual}</div>
      </Container>
    </section>
  )
}