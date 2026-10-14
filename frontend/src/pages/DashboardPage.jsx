import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Boxes,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Factory,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  Search,
  ShoppingBag,
  UsersRound,
  X,
} from 'lucide-react'

const STORAGE_KEY = 'fio-dashboard-demo-orders'
const RESOURCE_STORAGE_KEY = 'fio-dashboard-demo-resources'

const navigation = [
  [LayoutDashboard, 'Visão geral'],
  [ShoppingBag, 'Pedidos'],
  [UsersRound, 'Clientes'],
  [Package, 'Produtos'],
  [Boxes, 'Estoque'],
  [Factory, 'Produção'],
  [CircleDollarSign, 'Financeiro'],
]

const metrics = [
  { label: 'Vendas hoje', value: 'R$ 4.280', trend: '+12,5%', positive: true, icon: ShoppingBag },
  { label: 'A receber', value: 'R$ 12.450', trend: '+8,2%', positive: true, icon: CircleDollarSign },
  { label: 'Produção ativa', value: '18 lotes', trend: '4 para hoje', positive: true, icon: Factory },
  { label: 'Estoque baixo', value: '8 itens', trend: 'Ver itens', positive: false, icon: Boxes },
]

const salesBars = [42, 59, 48, 78, 66, 91, 76]

const production = [
  ['Lote #0251', 'Vestido Aurora · 32 peças', 'Em costura', 'Ateliê Dany', 'amber'],
  ['Lote #0248', 'Conjunto Lume · 20 peças', 'Revisão', 'Maria Costura', 'violet'],
  ['Lote #0244', 'Blusa Íris · 48 peças', 'Pronto', 'Ateliê Jô', 'green'],
]

const activities = [
  ['Pedido #1048 foi pago', 'há 8 min', 'payment'],
  ['Lote #0251 avançou para costura', 'há 24 min', 'production'],
  ['Estoque de Tecido Linho atualizado', 'há 1 h', 'inventory'],
  ['Novo cliente: Loja Solar', 'há 2 h', 'customer'],
]

const searchableItems = [
  { label: 'Loja Mimo', type: 'Cliente' },
  { label: 'Boutique Solar', type: 'Cliente' },
  { label: 'Moda Viva', type: 'Cliente' },
  { label: 'Vestido Aurora', type: 'Produto' },
  { label: 'Conjunto Lume', type: 'Produto' },
  { label: 'Tecido Linho Natural', type: 'Insumo' },
  { label: 'Pedido #1048', type: 'Pedido' },
]

const periodOptions = {
  week: { label: 'Esta semana', sales: 18760, change: '18,4%', bars: salesBars },
  month: { label: 'Este mês', sales: 64820, change: '12,1%', bars: [55, 72, 63, 81, 74, 91, 86] },
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

function parseCurrency(value) {
  const normalized = value.replace(/[^\d,]/g, '').replace(',', '.')
  return Number(normalized) || 0
}

function loadDemoOrders() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function loadDemoResources() {
  try {
    return JSON.parse(window.localStorage.getItem(RESOURCE_STORAGE_KEY)) || { Clientes: [], Produtos: [], Estoque: [], Produção: [], Financeiro: [] }
  } catch {
    return { Clientes: [], Produtos: [], Estoque: [], Produção: [], Financeiro: [] }
  }
}

export function DashboardPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('Visão geral')
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [period, setPeriod] = useState('week')
  const [orders, setOrders] = useState(loadDemoOrders)
  const [activityFeed, setActivityFeed] = useState(activities)
  const [search, setSearch] = useState('')
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [resourceDialog, setResourceDialog] = useState(null)
  const [resources, setResources] = useState(loadDemoResources)
  const [orderClient, setOrderClient] = useState('')

  const selectedPeriod = periodOptions[period]
  const orderTotal = orders.reduce((total, order) => total + order.value, 0)
  const searchResults = useMemo(
    () => searchableItems.filter((item) => item.label.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 5),
    [search],
  )
  const dashboardMetrics = [
    { ...metrics[0], value: formatCurrency(4280 + orderTotal) },
    { ...metrics[1], value: formatCurrency(12450 + orderTotal) },
    ...metrics.slice(2),
  ]
  const productCatalog = useMemo(() => {
    const created = resources.Produtos.map((item) => ({
      name: item.name,
      category: item.category,
      price: parseCurrency(item.price),
      stock: Number(item.stock) || 0,
    }))
    const defaults = moduleRecords.Produtos.map(([name, category, price, stock]) => ({
      name,
      category,
      price: parseCurrency(price),
      stock: Math.max(0, Number(stock.replace(/\D/g, '')) - orders.filter((order) => order.product === name).reduce((total, order) => total + order.quantity, 0)),
    }))
    return [...created, ...defaults]
  }, [orders, resources.Produtos])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    window.localStorage.setItem(RESOURCE_STORAGE_KEY, JSON.stringify(resources))
  }, [resources])

  function selectNavigation(label) {
    setActiveItem(label)
    setIsMenuOpen(false)
  }

  function openOrder(client = '') {
    setOrderClient(client)
    setIsOrderOpen(true)
  }

  function submitOrder(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const client = form.get('client').trim()
    const product = form.get('product')
    const quantity = Number(form.get('quantity')) || 1
    const value = parseCurrency(form.get('value'))

    const productData = productCatalog.find((item) => item.name === product)
    if (!productData || quantity > productData.stock) {
      setNotice(`Estoque insuficiente para ${product}. Disponível: ${productData?.stock ?? 0} unidade(s).`)
      return
    }

    if (!value) {
      setNotice('Informe um valor válido para criar o pedido.')
      return
    }

    const order = {
      id: `#${1050 + orders.length}`,
      client,
      value,
      product,
      quantity,
    }

    setOrders((currentOrders) => [order, ...currentOrders])
    setActivityFeed((currentFeed) => [
      [`Pedido ${order.id} criado para ${client}`, 'agora', 'payment'],
      ...currentFeed,
    ])
    setResources((current) => ({
      ...current,
      Produtos: current.Produtos.map((item) => item.name === product ? { ...item, stock: Math.max(0, Number(item.stock) - quantity) } : item),
      Estoque: current.Estoque.map((item) => item.name === product ? { ...item, amount: `${Math.max(0, Number(String(item.amount).replace(/\D/g, '')) - quantity)} un.` } : item),
    }))
    setIsOrderOpen(false)
    setOrderClient('')
    setNotice(`${order.id} criado para ${client}. Os dados ficam salvos neste navegador até a API entrar.`)
  }

  function submitResource(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const type = resourceDialog
    const entry = Object.fromEntries(form.entries())
    setResources((current) => {
      const next = { ...current, [type]: [{ ...entry, id: `${type}-${Date.now()}` }, ...current[type]] }
      if (type === 'Produtos') {
        next.Estoque = [{ id: `estoque-${Date.now()}`, name: entry.name, category: 'Produtos acabados', amount: `${entry.stock} un.`, minimum: '0 un.' }, ...current.Estoque]
      }
      return next
    })
    setResourceDialog(null)
    setNotice(`${type.slice(0, -1)} cadastrado(a) com sucesso. O dado está salvo neste navegador até a API entrar.`)
  }

  return (
    <main className="dashboard-page">
      <aside className={`dashboard-sidebar ${isMenuOpen ? 'is-open' : ''}`}>
        <a className="dashboard-brand" href="/">
          f<span>i</span>o
        </a>

        <nav className="dashboard-nav" aria-label="Navegação do sistema">
          <p>GESTÃO</p>
          {navigation.map(([Icon, label]) => (
            <button
              className={activeItem === label ? 'is-active' : ''}
              key={label}
              onClick={() => selectNavigation(label)}
              type="button"
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-help">
          <span>✦</span>
          <strong>Precisa de ajuda?</strong>
          <p>Fale com a equipe da Secco.</p>
          <a href="https://wa.me/5581995718479" target="_blank" rel="noreferrer">
            Abrir WhatsApp →
          </a>
        </div>

        <div className="sidebar-company">
          <span>AM</span>
          <div>
            <b>Ateliê Morena</b>
            <small>Plano inicial</small>
          </div>
          <ChevronDown size={15} />
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-topbar">
          <button className="dashboard-menu-button" type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Abrir menu">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
          <div className="dashboard-search-wrap">
            <label className="dashboard-search">
              <Search size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar clientes, pedidos ou produtos" />
              <kbd>⌘ K</kbd>
            </label>
            {search && <div className="search-results">{searchResults.length ? searchResults.map((item) => <button key={item.label} type="button" onClick={() => { setSearch(''); setNotice(`${item.label} selecionado(a) — ${item.type}.`) }}><span>{item.label}</span><small>{item.type}</small></button>) : <p>Nenhum resultado encontrado.</p>}</div>}
          </div>
          <div className="topbar-actions">
            <div className="notification-wrap">
            <button className="notification-button" type="button" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} aria-label="Notificações">
              <Bell size={19} />
              <i />
            </button>
            {isNotificationsOpen && <div className="notification-panel"><div><b>Notificações</b><button type="button" onClick={() => setIsNotificationsOpen(false)}><X size={14} /></button></div><p><strong>8 itens</strong> estão abaixo do estoque mínimo.</p><p><strong>Lote #0251</strong> precisa de revisão até amanhã.</p><a href="#estoque" onClick={() => setIsNotificationsOpen(false)}>Ver pendências →</a></div>}
            </div>
            <button className="profile-button" type="button">
              <span>AM</span>
              <div><b>Luan Felipe</b><small>Administrador</small></div>
              <ChevronDown size={15} />
            </button>
          </div>  
        </header>

        <div className="dashboard-main">
          {notice && <div className="dashboard-notice" role="status"><span>✓</span>{notice}<button type="button" onClick={() => setNotice('')} aria-label="Fechar aviso"><X size={15} /></button></div>}

          {activeItem === 'Visão geral' ? <>
          <div className="dashboard-intro">
            <div>
              <p>TERÇA-FEIRA, 16 DE SETEMBRO</p>
              <h1>Bom dia, Luan <span>✦</span></h1>
              <small>Acompanhe o que importa para a sua operação hoje.</small>
            </div>
            <button className="new-order-button" type="button" onClick={() => openOrder()}>
              <Plus size={18} /> Novo pedido
            </button>
          </div>

          <section className="metric-grid" aria-label="Indicadores de hoje">
            {dashboardMetrics.map(({ label, value, trend, positive, icon: Icon }) => (
              <article className="dashboard-metric" key={label}>
                <div className="metric-icon"><Icon size={19} /></div>
                <p>{label}</p>
                <strong>{value}</strong>
                <span className={positive ? 'positive' : 'attention'}>{positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{trend}</span>
              </article>
            ))}
          </section>

          <section className="dashboard-grid dashboard-grid--wide">
            <article className="dashboard-card sales-card">
              <div className="card-heading"><div><p>DESEMPENHO</p><h2>Vendas da semana</h2></div><label className="period-select"><select value={period} onChange={(event) => setPeriod(event.target.value)}><option value="week">Esta semana</option><option value="month">Este mês</option></select><ChevronDown size={14} /></label></div>
              <div className="sales-summary"><strong>{formatCurrency(selectedPeriod.sales + orderTotal)}</strong><span><ArrowUpRight size={14} /> {selectedPeriod.change} <small>vs. período anterior</small></span></div>
              <div className="sales-chart" aria-label="Gráfico de vendas da semana">
                <div className="chart-lines" />
                <div className="chart-bars">{selectedPeriod.bars.map((height, index) => <div key={index}><i className={index === 5 ? 'is-highlighted' : ''} style={{ height: `${height}%` }} /><span>{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]}</span></div>)}</div>
              </div>
            </article>

            <article className="dashboard-card receiving-card">
              <div className="card-heading"><div><p>PRÓXIMOS 7 DIAS</p><h2>A receber</h2></div><CircleDollarSign size={20} /></div>
              <strong>R$ 6.420</strong>
              <div className="receiving-list"><div><span className="avatar avatar--peach">LM</span><p>Loja Mimo <small>Hoje · R$ 1.850</small></p><b>Hoje</b></div><div><span className="avatar avatar--green">BS</span><p>Boutique Solar <small>Amanhã · R$ 2.120</small></p><b>Amanhã</b></div><div><span className="avatar avatar--lilac">MV</span><p>Moda Viva <small>18 set · R$ 2.450</small></p><b>18 set</b></div></div>
              <button className="card-link" type="button" onClick={() => selectNavigation('Financeiro')}>Ver financeiro <ArrowRight size={14} /></button>
            </article>
          </section>

          <section className="dashboard-grid dashboard-grid--split">
            <article className="dashboard-card production-card"><div className="card-heading"><div><p>ACOMPANHAMENTO</p><h2>Produção</h2></div><button className="card-link" type="button" onClick={() => selectNavigation('Produção')}>Ver todos <ArrowRight size={14} /></button></div><div className="production-list">{production.map(([lot, description, status, provider, tone]) => <div className="production-row" key={lot}><span className={`production-dot production-dot--${tone}`} /><div><b>{lot}</b><small>{description}</small></div><p>{provider}</p><em className={`status-pill status-pill--${tone}`}>{status}</em></div>)}</div></article>
            <article className="dashboard-card stock-card" id="estoque"><div className="card-heading"><div><p>ATENÇÃO NECESSÁRIA</p><h2>Estoque baixo</h2></div><button className="card-link" type="button" onClick={() => selectNavigation('Estoque')}>Ver estoque <ArrowRight size={14} /></button></div><div className="stock-alert"><div><span className="stock-swatch stock-swatch--beige" /><p><b>Tecido Linho Natural</b><small>Restam 18 kg · mínimo: 30 kg</small></p><i>60%</i></div><div><span className="stock-swatch stock-swatch--black" /><p><b>Zíper invisível preto</b><small>Restam 86 un. · mínimo: 120 un.</small></p><i>72%</i></div><div><span className="stock-swatch stock-swatch--orange" /><p><b>Tag Fio coleção verão</b><small>Restam 480 un. · mínimo: 1.000 un.</small></p><i>48%</i></div></div></article>
          </section>

          <section className="dashboard-grid dashboard-grid--split dashboard-grid--last">
            <article className="dashboard-card activity-card"><div className="card-heading"><div><p>EM TEMPO REAL</p><h2>Atividade recente</h2></div><ClipboardList size={19} /></div><div className="activity-list">{activityFeed.slice(0, 4).map(([text, time, type]) => <div key={`${text}-${time}`}><span className={`activity-icon activity-icon--${type}`}>✦</span><p>{text}<small>{time}</small></p></div>)}</div></article>
            <article className="dashboard-card calendar-card"><div><p>ORGANIZAÇÃO</p><h2>Seu dia em ordem.</h2><span>Você tem <b>4 tarefas</b> e <b>2 entregas</b> para acompanhar hoje.</span><button type="button" onClick={() => setNotice('Agenda demonstrativa. Ela será conectada ao módulo de pedidos e produção.')}>Abrir agenda <CalendarDays size={16} /></button></div><div className="calendar-art"><i /><i /><i /><i /><i /><i /><i /></div></article>
          </section>
          </> : <ModuleWorkspace module={activeItem} orders={orders} resources={resources} productCatalog={productCatalog} onNewOrder={openOrder} onOpenResource={setResourceDialog} onNotice={setNotice} />}
        </div>
      </section>

      {isOrderOpen && <OrderDialog onClose={() => { setIsOrderOpen(false); setOrderClient('') }} onSubmit={submitOrder} defaultClient={orderClient} clients={[...resources.Clientes.map((item) => item.name), ...moduleRecords.Clientes.map((item) => item[0])]} products={productCatalog} />}
      {resourceDialog && <ResourceDialog type={resourceDialog} onClose={() => setResourceDialog(null)} onSubmit={submitResource} />}
    </main>
  )
}

const moduleRecords = {
  Clientes: [
    ['Loja Mimo', 'Recife, PE', '12 pedidos', 'R$ 18.420'],
    ['Boutique Solar', 'Caruaru, PE', '8 pedidos', 'R$ 12.850'],
    ['Moda Viva', 'Olinda, PE', '6 pedidos', 'R$ 9.240'],
    ['Ateliê Nuvem', 'Recife, PE', '4 pedidos', 'R$ 6.780'],
  ],
  Produtos: [
    ['Vestido Aurora', 'Vestidos', 'R$ 289,00', '32 un.'],
    ['Conjunto Lume', 'Conjuntos', 'R$ 239,00', '20 un.'],
    ['Blusa Íris', 'Blusas', 'R$ 119,00', '48 un.'],
    ['Saia Brisa', 'Saias', 'R$ 159,00', '14 un.'],
  ],
  Estoque: [
    ['Tecido Linho Natural', 'Tecidos', '18 kg', 'Mínimo: 30 kg', 'Baixo'],
    ['Zíper invisível preto', 'Aviamentos', '86 un.', 'Mínimo: 120 un.', 'Baixo'],
    ['Tag Fio coleção verão', 'Embalagens', '480 un.', 'Mínimo: 1.000 un.', 'Baixo'],
    ['Botão madrepérola', 'Aviamentos', '640 un.', 'Mínimo: 400 un.', 'Em dia'],
  ],
}

const productionColumns = [
  ['Corte', ['Lote #0254', 'Saia Brisa · 24 peças'], ['Lote #0256', 'Vestido Nara · 16 peças']],
  ['Em costura', ['Lote #0251', 'Vestido Aurora · 32 peças'], ['Lote #0253', 'Blusa Íris · 48 peças']],
  ['Revisão', ['Lote #0248', 'Conjunto Lume · 20 peças']],
  ['Pronto', ['Lote #0244', 'Blusa Íris · 48 peças']],
]

function ModuleWorkspace({ module, orders, resources, productCatalog, onNewOrder, onOpenResource, onNotice }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Todos')
  const normalizedQuery = query.trim().toLowerCase()
  const filterRows = (rows) => rows.filter((row) => row.join(' ').toLowerCase().includes(normalizedQuery))

  if (module === 'Pedidos') {
    const baseOrders = [
      ['#1048', 'Loja Mimo', '16 set', 'R$ 1.850', 'Pago'],
      ['#1047', 'Boutique Solar', '15 set', 'R$ 2.120', 'A receber'],
      ['#1046', 'Moda Viva', '14 set', 'R$ 2.450', 'Em produção'],
    ]
    const createdOrders = orders.map((order) => [order.id, order.client, 'Hoje', formatCurrency(order.value), 'Novo'])
    const rows = filterRows([...createdOrders, ...baseOrders]).filter((row) => status === 'Todos' || row[4] === status)
    return <ModuleShell eyebrow="VENDAS" title="Pedidos" description="Acompanhe cada venda do orçamento à entrega." action="Novo pedido" onAction={onNewOrder}>
      <ModuleControls query={query} setQuery={setQuery} status={status} setStatus={setStatus} options={['Todos', 'Novo', 'Pago', 'A receber', 'Em produção']} />
      <article className="module-card"><div className="module-table"><div className="module-row module-row--head"><span>Pedido</span><span>Cliente</span><span>Data</span><span>Valor</span><span>Status</span></div>{rows.length ? rows.map((row) => <div className="module-row" key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><span>{row[2]}</span><strong>{row[3]}</strong><em className={`module-status module-status--${row[4].replaceAll(' ', '-').toLowerCase()}`}>{row[4]}</em></div>) : <EmptyState text="Nenhum pedido encontrado com estes filtros." />}</div></article>
    </ModuleShell>
  }

  if (module === 'Clientes' || module === 'Produtos') {
    const newRows = module === 'Clientes'
      ? resources.Clientes.map((item) => {
        const clientOrders = orders.filter((order) => order.client === item.name)
        return [item.name, item.city, `${clientOrders.length} pedido${clientOrders.length === 1 ? '' : 's'}`, formatCurrency(clientOrders.reduce((total, order) => total + order.value, 0))]
      })
      : productCatalog.map((item) => [item.name, item.category, formatCurrency(item.price), `${item.stock} un.`])
    const rows = filterRows(module === 'Clientes' ? [...newRows, ...moduleRecords.Clientes] : newRows)
    const labels = module === 'Clientes' ? ['Cliente', 'Localização', 'Histórico', 'Total comprado', 'Ação'] : ['Produto', 'Categoria', 'Preço', 'Disponível']
    return <ModuleShell eyebrow={module === 'Clientes' ? 'RELACIONAMENTO' : 'CATÁLOGO'} title={module} description={module === 'Clientes' ? 'Tenha a história de compra de cada cliente à mão.' : 'Organize o catálogo e acompanhe o saldo dos seus produtos.'} action={module === 'Clientes' ? 'Novo cliente' : 'Novo produto'} onAction={() => onOpenResource(module)}>
      <ModuleControls query={query} setQuery={setQuery} />
      <article className={`module-card ${module === 'Clientes' ? 'module-card--clients' : 'module-card--four'}`}><div className="module-table"><div className="module-row module-row--head">{labels.map((label) => <span key={label}>{label}</span>)}</div>{rows.map((row) => <div className="module-row" key={row[0]}><b>{row[0]}</b>{row.slice(1).map((cell) => <span key={cell}>{cell}</span>)}{module === 'Clientes' && <button className="client-order-button" type="button" onClick={() => onNewOrder(row[0])}>Criar pedido</button>}</div>)}</div></article>
    </ModuleShell>
  }

  if (module === 'Estoque') {
    const newRows = resources.Estoque.map((item) => [item.name, item.category, item.amount, `Mínimo: ${item.minimum}`, 'Em dia'])
    const rows = filterRows([...newRows, ...moduleRecords.Estoque])
    return <ModuleShell eyebrow="SUPRIMENTOS" title="Estoque" description="Veja o que precisa ser reposto antes de parar a produção." action="Entrada de estoque" onAction={() => onOpenResource('Estoque')}>
      <ModuleControls query={query} setQuery={setQuery} status={status} setStatus={setStatus} options={['Todos', 'Baixo', 'Em dia']} />
      <article className="module-card"><div className="module-table"><div className="module-row module-row--head"><span>Item</span><span>Grupo</span><span>Saldo atual</span><span>Ponto de reposição</span><span>Situação</span></div>{rows.filter((row) => status === 'Todos' || row[4] === status).map((row) => <div className="module-row" key={row[0]}><b>{row[0]}</b>{row.slice(1, 4).map((cell) => <span key={cell}>{cell}</span>)}<em className={`module-status module-status--${row[4].toLowerCase().replaceAll(' ', '-')}`}>{row[4]}</em></div>)}</div></article>
    </ModuleShell>
  }

  if (module === 'Produção') {
    return <ModuleShell eyebrow="CHÃO DE FÁBRICA" title="Produção" description="Acompanhe o andamento dos lotes e priorize o que vence hoje." action="Novo lote" onAction={() => onOpenResource('Produção')}>
      <div className="kanban-board">{productionColumns.map(([stage, ...lots]) => { const createdLots = resources.Produção.filter((item) => item.stage === stage).map((item) => [item.lot, `${item.product} · ${item.quantity} peças`]); const items = [...createdLots, ...lots]; return <section className="kanban-column" key={stage}><header><b>{stage}</b><span>{items.length}</span></header>{items.map(([lot, description]) => <button type="button" className="kanban-card" key={lot} onClick={() => onNotice(`${lot} selecionado. Ao integrar a API, aqui abrirá os detalhes do lote.`)}><strong>{lot}</strong><small>{description}</small><i>Ver detalhes →</i></button>)}</section> })}</div>
    </ModuleShell>
  }

  return <ModuleShell eyebrow="FLUXO DE CAIXA" title="Financeiro" description="Entenda o que entra, o que sai e o que precisa de atenção." action="Novo lançamento" onAction={() => onOpenResource('Financeiro')}>
    <div className="finance-summary"><article><p>A receber</p><strong>R$ 12.450</strong><span>7 próximos dias</span></article><article><p>Disponível hoje</p><strong>R$ 8.720</strong><span>Conta principal</span></article><article><p>Despesas previstas</p><strong>R$ 3.180</strong><span>Até 23 set</span></article></div>
    <article className="module-card"><div className="module-card-heading"><div><p>PRÓXIMOS RECEBIMENTOS</p><h2>Contas a receber</h2></div><button type="button" className="card-link" onClick={() => onNotice('Filtros financeiros serão alimentados pelos lançamentos reais.')}>Ver relatório <ArrowRight size={14} /></button></div><div className="module-table"><div className="module-row module-row--head"><span>Cliente</span><span>Vencimento</span><span>Origem</span><span>Valor</span><span>Status</span></div>{[['Loja Mimo', 'Hoje', 'Pedido #1048', 'R$ 1.850', 'A receber'], ['Boutique Solar', 'Amanhã', 'Pedido #1047', 'R$ 2.120', 'A receber'], ['Moda Viva', '18 set', 'Pedido #1046', 'R$ 2.450', 'A receber']].map((row) => <div className="module-row" key={row[0]}><b>{row[0]}</b>{row.slice(1, 4).map((cell) => <span key={cell}>{cell}</span>)}<em className="module-status module-status--a-receber">{row[4]}</em></div>)}</div></article>
  </ModuleShell>
}

function ModuleShell({ eyebrow, title, description, action, onAction, children }) {
  return <section className="module-workspace"><div className="module-heading"><div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div><button type="button" className="new-order-button" onClick={onAction}><Plus size={18} /> {action}</button></div>{children}</section>
}

function ModuleControls({ query, setQuery, status, setStatus, options }) {
  return <div className="module-controls"><label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar nesta tela" /></label>{options && <select value={status} onChange={(event) => setStatus(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select>}</div>
}

function EmptyState({ text }) {
  return <div className="module-empty">{text}</div>
}

function ResourceDialog({ type, onClose, onSubmit }) {
  const content = {
    Clientes: { title: 'Novo cliente', text: 'Cadastre quem compra de você para usar nos pedidos.', fields: <><DialogField name="name" label="Nome ou empresa" placeholder="Ex.: Loja Mimo" /><DialogField name="city" label="Cidade" placeholder="Ex.: Recife, PE" /><DialogField name="phone" label="WhatsApp" placeholder="(81) 99999-9999" /></> },
    Produtos: { title: 'Novo produto', text: 'Inclua um produto no catálogo da sua operação.', fields: <><DialogField name="name" label="Nome do produto" placeholder="Ex.: Vestido Aurora" /><DialogField name="category" label="Categoria" placeholder="Ex.: Vestidos" /><DialogField name="price" label="Preço de venda" placeholder="Ex.: 289,00" /><DialogField name="stock" label="Quantidade inicial" type="number" placeholder="0" /></> },
    Estoque: { title: 'Entrada de estoque', text: 'Registre uma nova matéria-prima ou insumo.', fields: <><DialogField name="name" label="Item" placeholder="Ex.: Tecido Linho Natural" /><DialogField name="category" label="Grupo" placeholder="Ex.: Tecidos" /><DialogField name="amount" label="Quantidade recebida" placeholder="Ex.: 50 kg" /><DialogField name="minimum" label="Estoque mínimo" placeholder="Ex.: 30 kg" /></> },
    Produção: { title: 'Novo lote', text: 'Crie um lote para acompanhar o fluxo de produção.', fields: <><DialogField name="lot" label="Código do lote" placeholder="Ex.: Lote #0257" /><DialogField name="product" label="Produto" placeholder="Ex.: Vestido Aurora" /><DialogField name="quantity" label="Quantidade de peças" type="number" placeholder="0" /><label>Etapa inicial<select name="stage" defaultValue="Corte"><option>Corte</option><option>Em costura</option><option>Revisão</option><option>Pronto</option></select></label></> },
    Financeiro: { title: 'Novo lançamento', text: 'Registre um recebimento ou despesa para o seu controle.', fields: <><DialogField name="description" label="Descrição" placeholder="Ex.: Pedido Loja Mimo" /><DialogField name="dueDate" label="Vencimento" type="date" /><DialogField name="amount" label="Valor" placeholder="Ex.: 1.850,00" /><label>Tipo<select name="type" defaultValue="Recebimento"><option>Recebimento</option><option>Despesa</option></select></label></> },
  }[type]

  return <div className="dashboard-dialog-backdrop" role="presentation" onMouseDown={onClose}><section className="dashboard-dialog" role="dialog" aria-modal="true" aria-labelledby="resource-dialog-title" onMouseDown={(event) => event.stopPropagation()}><button className="dialog-close" type="button" onClick={onClose} aria-label="Fechar"><X size={19} /></button><p>CADASTRO</p><h2 id="resource-dialog-title">{content.title}</h2><span>{content.text} Os dados ficam salvos neste navegador até a API entrar.</span><form onSubmit={onSubmit}>{content.fields}<button className="new-order-button" type="submit">Salvar <ArrowRight size={17} /></button></form></section></div>
}

function DialogField({ name, label, type = 'text', placeholder }) {
  return <label>{label}<input name={name} type={type} placeholder={placeholder} required /></label>
}

function OrderDialog({ onClose, onSubmit, defaultClient, clients, products }) {
  const [productName, setProductName] = useState(products[0]?.name || '')
  const [quantity, setQuantity] = useState(1)
  const product = products.find((item) => item.name === productName)
  const available = product?.stock || 0
  const orderValue = (product?.price || 0) * quantity

  return <div className="dashboard-dialog-backdrop" role="presentation" onMouseDown={onClose}><section className="dashboard-dialog" role="dialog" aria-modal="true" aria-labelledby="new-order-title" onMouseDown={(event) => event.stopPropagation()}><button className="dialog-close" type="button" onClick={onClose} aria-label="Fechar"><X size={19} /></button><p>NOVO PEDIDO</p><h2 id="new-order-title">Registre uma venda.</h2><span>Selecione um cliente e um produto já cadastrados. O valor é calculado automaticamente conforme a quantidade.</span><form onSubmit={onSubmit}><label>Cliente<select name="client" defaultValue={defaultClient} required><option value="" disabled>Selecione um cliente</option>{clients.map((client) => <option key={client}>{client}</option>)}</select></label><label>Produto<select name="product" value={productName} onChange={(event) => { setProductName(event.target.value); setQuantity(1) }} required>{products.map((item) => <option key={item.name} value={item.name}>{item.name} · {item.stock} un.</option>)}</select></label><small className="stock-available">Disponível para venda: <b>{available} unidade(s)</b></small><label>Quantidade<input name="quantity" type="number" min="1" max={available} value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(available, Number(event.target.value) || 1)))} required /></label><label>Valor do pedido<input name="value" value={formatCurrency(orderValue)} readOnly /></label><button className="new-order-button" type="submit" disabled={!available}>Criar pedido <ArrowRight size={17} /></button></form></section></div>
}
