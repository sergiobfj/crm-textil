import { useState } from 'react'
import { ArrowRight, Boxes, Factory, Mail, Menu, PackageCheck, Phone, UsersRound, WalletCards, X } from 'lucide-react'
import { Container } from '../components/layout/Container'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { FinanceMock, FullDashboard, InventoryMock, ProductionBoard } from '../features/landing/components/ProductMocks'

const problems = [
  ['◌', 'WhatsApp', 'Pedidos espalhados'], ['▤', 'Planilhas', 'Estoque difícil de acompanhar'],
  ['⌁', 'Papel', 'Produção sem visibilidade'], ['↗', 'Financeiro', 'Dinheiro sem clareza'],
]
const modules = [
  [UsersRound, 'Clientes', 'Saiba quem compra de você.'], [Boxes, 'Estoque', 'Saiba exatamente o que você tem.'],
  [Factory, 'Produção', 'Saiba onde está cada lote.'], [PackageCheck, 'Vendas', 'Venda com mais organização.'],
  [WalletCards, 'Financeiro', 'Saiba para onde vai o dinheiro.'],
]
const audiences = [
  ['Lojistas', 'Organize clientes, vendas e estoque.'], ['Atacadistas', 'Tenha controle de pedidos e produtos.'],
  ['Confecções', 'Acompanhe produção e insumos.'], ['Pequenas operações', 'Troque planilhas e papel por uma operação organizada.'],
]

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return <>
    <Header isMenuOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} onClose={() => setIsMenuOpen(false)} />
    <main>
      <Hero />
      <Problems />
      <Modules />
      <Showcase dark id="producao" eyebrow="PRODUÇÃO" title={<>Do corte à entrega,<br /><em>sem perder nenhum lote.</em></>} text="Acompanhe cada ordem de produção e saiba exatamente o que está acontecendo, quem está produzindo e o que ainda precisa ser feito." visual={<ProductionBoard />} />
      <Inventory />
      <Showcase eyebrow="VISÃO GERAL" title={<>Abra o sistema e saiba como está<br /><em>o seu negócio.</em></>} text="Uma visão clara para você agir com rapidez — vendas, estoque, produção e contas importantes em uma única tela." visual={<FullDashboard />} />
      <Finance />
      <Audience />
      <Steps />
      <Benefits />
      <FinalCta />
    </main>
    <Footer />
  </>
}

function Header({ isMenuOpen, onToggle, onClose }) {
  return <header className="site-header"><Container className="nav"><a className="brand" href="#inicio">f<span>i</span>o</a><nav className={isMenuOpen ? 'nav-links is-open' : 'nav-links'}><a onClick={onClose} href="#funcionalidades">Funcionalidades</a><a onClick={onClose} href="#como-funciona">Como funciona</a><a onClick={onClose} href="#para-quem">Para quem é</a><a className="mobile-login" href="/login">Entrar</a><Button href="#comece" className="mobile-cta">Começar agora <ArrowRight size={16} /></Button></nav><div className="nav-actions"><a href="/login">Entrar</a><Button href="#comece">Começar agora <ArrowRight size={16} /></Button></div><button className="menu-toggle" onClick={onToggle} aria-label="Abrir menu">{isMenuOpen ? <X /> : <Menu />}</button></Container></header>
}

function Hero() {
  return <section className="hero" id="inicio"><Container><div className="hero-copy"><p className="eyebrow">GESTÃO FEITA PARA O TÊXTIL</p><h1>Sua operação têxtil,<br /><em>finalmente</em> sob controle.</h1><p className="lead">Clientes, vendas, estoque, produção e caixa em um só lugar. Sem depender de planilhas, cadernos ou dezenas de conversas no WhatsApp.</p><div className="hero-actions"><Button href="#comece">Começar agora <ArrowRight size={18} /></Button><Button variant="ghost" href="#como-funciona">Ver como funciona <span>↓</span></Button></div><p className="microcopy"><i>✓</i> Feito para lojistas, atacadistas e pequenas confecções.</p></div><div className="hero-product"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><FullDashboard /></div></Container></section>
}

function Problems() { return <section className="section problem-section"><Container><div className="section-heading centered"><p className="eyebrow">A REALIDADE DE HOJE</p><h2>Você não precisa trabalhar mais.<br />Precisa ter <em>mais controle.</em></h2></div><div className="problem-grid">{problems.map(([symbol, label, text]) => <article className="problem-card" key={label}><span>{symbol}</span><small>{label}</small><h3>{text}</h3></article>)}</div></Container></section> }
function Modules() { return <section className="section solution-section" id="funcionalidades"><Container><div className="split-heading"><div><p className="eyebrow">TUDO CONECTADO</p><h2>Tudo o que sua operação precisa.<br /><em>Em um só lugar.</em></h2></div><p>Do primeiro contato com o cliente até o dinheiro entrando no caixa, você acompanha a operação sem precisar trocar de ferramenta.</p></div><div className="module-grid">{modules.map(([Icon, title, description]) => <article className="module-card" key={title}><div className="module-icon"><Icon size={22} /></div><h3>{title}</h3><p>{description}</p><span>Conhecer módulo <ArrowRight size={15} /></span></article>)}</div></Container></section> }
function Inventory() { return <section className="section inventory-section"><Container className="feature-two-col"><div className="feature-copy"><p className="eyebrow">ESTOQUE INTELIGENTE</p><h2>Do tecido à peça pronta.<br /><em>Você sabe o que tem.</em></h2><p>Controle matéria-prima e produtos acabados separadamente, com visão clara de disponibilidade, reservas e produção.</p><div className="check-list"><span>✓ Estoques conectados à produção</span><span>✓ Grades e variações organizadas</span><span>✓ Alertas para reposição</span></div></div><InventoryMock /></Container></section> }
function Finance() { return <section className="section finance-section"><Container className="feature-two-col reverse"><FinanceMock /><div className="feature-copy"><p className="eyebrow">FINANCEIRO</p><h2>Venda hoje. Saiba<br /><em>o que entra amanhã.</em></h2><p>Tenha uma visão simples das entradas, saídas e compromissos financeiros da operação.</p><a className="text-link" href="#comece">Organize seu caixa <ArrowRight size={17} /></a></div></Container></section> }
function Audience() { return <section className="section audience-section" id="para-quem"><Container><div className="section-heading"><p className="eyebrow">PARA QUEM É</p><h2>Feito para quem vive<br /><em>o mercado têxtil.</em></h2></div><div className="audience-grid">{audiences.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></Container></section> }
function Steps() { const items = [['Cadastre', 'Clientes, produtos, fornecedores e insumos.'], ['Registre', 'Pedidos, vendas e ordens de produção.'], ['Acompanhe', 'Estoque, produção e financeiro em tempo real.'], ['Decida', 'Use os números para saber onde sua operação precisa de atenção.']]; return <section className="section steps-section" id="como-funciona"><Container><div className="section-heading centered"><p className="eyebrow">COMO FUNCIONA</p><h2>Comece simples.<br /><em>Tenha controle rápido.</em></h2></div><div className="steps">{items.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></Container></section> }
function Benefits() { const items = [['Tudo conectado', 'Cliente, pedido, estoque, produção e financeiro conversam entre si.'], ['Feito para sua realidade', 'Pensado para o dia a dia do comércio e da produção têxtil.'], ['Simples de usar', 'Sem precisar transformar sua operação em um projeto de TI.']]; return <section className="section benefits-section"><Container><div className="benefit-intro"><p className="eyebrow">POR QUE FIO</p><h2>Menos tempo procurando informação.<br /><em>Mais tempo cuidando do negócio.</em></h2></div><div className="benefit-grid">{items.map(([title, text]) => <article key={title}><span>✦</span><h3>{title}</h3><p>{text}</p></article>)}</div></Container></section> }
function FinalCta() { return <section className="final-cta" id="comece"><Container><div><Badge tone="sand">O próximo passo é mais simples</Badge><h2>Sua operação merece<br /><em>mais controle.</em></h2><p>Centralize clientes, vendas, estoque, produção e financeiro em um único lugar.</p><Button href="/login">Começar agora <ArrowRight size={18} /></Button></div><div className="cta-art"><span>f</span><i /><b>i</b><i /><span>o</span></div></Container></section> }
function Showcase({ eyebrow, title, text, visual, dark, id }) { return <section id={id} className={`section showcase ${dark ? 'showcase--dark' : ''}`}><Container className="showcase-layout"><div className="showcase-intro"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{text}</p></div><div className="showcase-visual">{visual}</div></Container></section> }
function Footer() { return <footer><Container><div className="footer-main"><div><a className="brand" href="#inicio">f<span>i</span>o</a><p>Gestão simples para negócios têxteis.</p></div><FooterGroup title="Produto" items={['Funcionalidades', 'Como funciona', 'Para quem é']} /><FooterGroup title="Empresa" items={['Sobre', 'Contato']} /><div className="footer-contact"><b>Contato</b><a href="mailto:contato@seccolab.com.br"><Mail size={14} />contato@seccolab.com.br</a><a href="tel:+5581995718479"><Phone size={14} />(81) 99571-8479</a></div></div><div className="footer-bottom"><span>© 2026 Fio. Todos os direitos reservados.</span><a className="secco-credit" href="https://seccolab.com.br" target="_blank" rel="noreferrer">Criado por <strong>Secco</strong> <ArrowRight size={13} /></a><span>Feito no Brasil para o mercado têxtil.</span></div></Container></footer> }
function FooterGroup({ title, items }) { return <div><b>{title}</b>{items.map((item) => <a key={item} href="#inicio">{item}</a>)}</div> }
