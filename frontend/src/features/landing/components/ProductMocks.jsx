import { Badge } from '../../../components/ui/Badge'

const lots = [
  ['Lote #0248', '20 peças · M/G', 'Maria Costura', '18 set'],
  ['Lote #0251', '32 peças · P/M/G', 'Ateliê Dany', '20 set'],
]

export function MiniDashboard() {
  return <div className="app-frame hero-frame" aria-label="Prévia do dashboard do Fio">
    <AppTop title="Visão geral" />
    <div className="app-body dashboard-body">
      <aside><b>f<span>i</span>o</b><small>Visão geral</small><small>Pedidos</small><small>Estoque</small><small>Produção</small><small>Financeiro</small></aside>
      <main>
        <div className="app-greeting"><div><small>terça-feira, 16 de setembro</small><h3>Bom dia, Ana <span>✦</span></h3></div><Badge>Operação em dia</Badge></div>
        <div className="metric-row"><Metric label="Vendas hoje" value="R$ 4.280" up="12%"/><Metric label="A receber" value="R$ 12.450"/><Metric label="Produção" value="18 lotes"/></div>
        <div className="chart-card"><div><b>Vendas da semana</b><small>+18,4% em relação à anterior</small></div><div className="bars">{[36, 58, 46, 73, 59, 86, 70].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div></div>
      </main>
    </div>
  </div>
}

export function ProductionBoard() {
  const stages = ['Corte', 'Enviado', 'Em costura', 'Pronto', 'Revisão', 'Estoque']
  return <div className="app-frame kanban-frame"><AppTop title="Produção" /><div className="kanban-toolbar"><div><small>Ordens de produção</small><h3>Produção em andamento</h3></div><Badge tone="sand">18 lotes ativos</Badge></div><div className="kanban">{stages.map((stage, index) => <div className="kanban-column" key={stage}><div className="kanban-heading"><b>{stage}</b><span>{[3, 2, 4, 3, 2, 4][index]}</span></div>{(index === 0 || index === 2 || index === 4) && lots.slice(0, index === 2 ? 2 : 1).map((lot, i) => <LotCard key={i} lot={lot} tone={index === 2 ? 'orange' : 'green'} />)}</div>)}</div></div>
}

export function InventoryMock() {
  return <div className="inventory-mock"><div className="stock-card material"><small>ESTOQUE DE INSUMOS</small><h3>Matéria-prima</h3>{[['Tecido', '248 kg'], ['Zíper', '1.240 un.'], ['Linha', '84 rolos'], ['Tags', '3.500 un.']].map(([item, amount]) => <div className="stock-line" key={item}><span>{item}</span><b>{amount}</b></div>)}</div><div className="stock-card finished"><small>PRODUTOS ACABADOS</small><h3>Vestido Aurora</h3><div className="sizes"><span>P <b>24</b></span><span>M <b>42</b></span><span>G <b>38</b></span></div><div className="availability"><div><small>Disponível</small><b>104</b></div><div><small>Reservado</small><b>20</b></div></div></div></div>
}

export function FinanceMock() {
 return <div className="finance-mock"><div className="finance-heading"><div><small>FLUXO DE CAIXA</small><h3>Setembro</h3></div><Badge>Saldo positivo</Badge></div><div className="finance-metrics"><Metric label="Entradas" value="R$ 24.850"/><Metric label="A receber" value="R$ 12.450"/><Metric label="A pagar" value="R$ 8.320"/><Metric label="Saldo" value="R$ 16.530"/></div><div className="cash-chart"><div className="line-grid" /><svg viewBox="0 0 620 170" preserveAspectRatio="none"><path d="M0 130 C45 123 60 90 105 101 S150 144 190 105 S245 67 285 83 S331 122 370 95 S421 41 466 69 S528 80 570 25 S600 39 620 14" fill="none" stroke="currentColor" strokeWidth="4" vectorEffect="non-scaling-stroke"/><path d="M0 130 C45 123 60 90 105 101 S150 144 190 105 S245 67 285 83 S331 122 370 95 S421 41 466 69 S528 80 570 25 S600 39 620 14 V170 H0Z" fill="url(#fade)"/><defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop stopColor="currentColor" stopOpacity=".22"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs></svg><div className="chart-labels"><span>01 set</span><span>08 set</span><span>15 set</span><span>22 set</span><span>30 set</span></div></div></div>
}

export function FullDashboard() { return <div className="full-dashboard"><MiniDashboard /><div className="dashboard-float"><span>Estoque em atenção</span><b>8 itens abaixo do mínimo</b><small>Ver estoque →</small></div></div> }
function AppTop({ title }) { return <div className="app-top"><span className="app-dot" /><b>{title}</b><div><i/><i/><i/></div></div> }
function Metric({ label, value, up }) { return <div className="metric"><small>{label}</small><b>{value}</b>{up && <em>↑ {up}</em>}</div> }
function LotCard({ lot, tone }) { return <article className="lot-card"><div><b>{lot[0]}</b><Badge tone={tone}>{tone === 'orange' ? 'Em andamento' : 'Aguardando'}</Badge></div><small>{lot[1]}</small><small>✦ {lot[2]}</small><footer>Previsão <b>{lot[3]}</b></footer></article> }
