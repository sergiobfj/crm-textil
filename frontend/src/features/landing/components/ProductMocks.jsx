import { Badge } from '../../../components/ui/Badge'

/* ============================================================================
   PRÉVIAS DO PRODUTO (telas de exemplo usadas na landing)

   1. DADOS ........... números e textos de exemplo (edite aqui)
   2. TELAS ........... MiniDashboard, ProductionBoard, InventoryMock,
                        FinanceMock, FullDashboard
   3. PEÇAS MENORES ... AppTop, Metric, LotCard
   ============================================================================ */

/* ============================================================================
   1. DADOS
   ============================================================================ */

// Lotes de exemplo: [nome, detalhes, responsável, previsão]
const lots = [
  ['Lote #0248', '20 peças · M/G', 'Maria Costura', '18 set'],
  ['Lote #0251', '32 peças · P/M/G', 'Ateliê Dany', '20 set'],
]

// Gráfico "Vendas da semana": [dia, valor de 0 a 100]
const weekSales = [
  ['Seg', 36],
  ['Ter', 58],
  ['Qua', 46],
  ['Qui', 73],
  ['Sex', 59],
  ['Sáb', 86],
  ['Dom', 70],
]

// Quadro de produção: [etapa, quantidade de lotes na etapa]
const productionStages = [
  ['Corte', 3],
  ['Enviado', 2],
  ['Em costura', 4],
  ['Pronto', 3],
  ['Revisão', 2],
  ['Estoque', 4],
]

// Estoque de insumos: [item, quantidade]
const materials = [
  ['Tecido', '248 kg'],
  ['Zíper', '1.240 un.'],
  ['Linha', '84 rolos'],
  ['Tags', '3.500 un.'],
]

// Grade do produto acabado: [tamanho, quantidade]
const sizes = [
  ['P', 24],
  ['M', 42],
  ['G', 38],
]

// Cartões do fluxo de caixa: [rótulo, valor]
const cashMetrics = [
  ['Entradas', 'R$ 24.850'],
  ['A receber', 'R$ 12.450'],
  ['A pagar', 'R$ 8.320'],
  ['Saldo', 'R$ 16.530'],
]

// Quais lotes aparecem em cada coluna do quadro (pelo índice da etapa)
function lotsForStage(index) {
  if (index === 2) return lots.slice(0, 2) // Em costura: 2 lotes
  if (index === 0 || index === 4) return lots.slice(0, 1) // Corte e Revisão: 1 lote
  return []
}

/* ============================================================================
   2. TELAS
   ============================================================================ */

/* ---------- Dashboard (tela "Visão geral") ---------- */
export function MiniDashboard() {
  return (
    <div className="app-frame hero-frame" aria-label="Prévia do dashboard do Fio">
      <AppTop title="Visão geral" />

      <div className="app-body dashboard-body">
        <aside>
          <b>f<span>i</span>o</b>
          <small>Visão geral</small>
          <small>Pedidos</small>
          <small>Estoque</small>
          <small>Produção</small>
          <small>Financeiro</small>
        </aside>

        <main>
          <div className="app-greeting">
            <div>
              <small>terça-feira, 16 de setembro</small>
              <h3>Bom dia, Luan <span>✦</span></h3>
            </div>
            <Badge>Operação em dia</Badge>
          </div>

          <div className="metric-row">
            <Metric label="Vendas hoje" value="R$ 4.280" up="12%" />
            <Metric label="A receber" value="R$ 12.450" />
            <Metric label="Produção" value="18 lotes" />
          </div>

          {/* Gráfico de barras: cada barra tem o dia embaixo */}
          <div className="chart-card">
            <div className="chart-head">
              <b>Vendas da semana</b>
              <small>+18,4% em relação à anterior</small>
            </div>
            <div className="bars">
              {weekSales.map(([day, value]) => (
                <div className="bar" key={day}>
                  <i style={{ height: Math.round(value * 0.6) }} />
                  <span>{day}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

/* ---------- Quadro de produção (kanban) ---------- */
export function ProductionBoard() {
  return (
    <div className="app-frame kanban-frame">
      <AppTop title="Produção" />

      <div className="kanban-toolbar">
        <div>
          <small>Ordens de produção</small>
          <h3>Produção em andamento</h3>
        </div>
        <Badge tone="sand">18 lotes ativos</Badge>
      </div>

      <div className="kanban">
        {productionStages.map(([stage, count], index) => (
          <div className="kanban-column" key={stage}>
            <div className="kanban-heading">
              <b>{stage}</b>
              <span>{count}</span>
            </div>
            {lotsForStage(index).map((lot, i) => (
              <LotCard key={i} lot={lot} tone={index === 2 ? 'orange' : 'green'} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Estoque (insumos + produto acabado) ---------- */
export function InventoryMock() {
  return (
    <div className="inventory-mock">
      <div className="stock-card material">
        <small>ESTOQUE DE INSUMOS</small>
        <h3>Matéria-prima</h3>
        {materials.map(([item, amount]) => (
          <div className="stock-line" key={item}>
            <span>{item}</span>
            <b>{amount}</b>
          </div>
        ))}
      </div>

      <div className="stock-card finished">
        <small>PRODUTOS ACABADOS</small>
        <h3>Vestido Aurora</h3>
        <div className="sizes">
          {sizes.map(([size, qty]) => (
            <span key={size}>{size} <b>{qty}</b></span>
          ))}
        </div>
        <div className="availability">
          <div>
            <small>Disponível</small>
            <b>104</b>
          </div>
          <div>
            <small>Reservado</small>
            <b>20</b>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Fluxo de caixa ---------- */
export function FinanceMock() {
  return (
    <div className="finance-mock">
      <div className="finance-heading">
        <div>
          <small>FLUXO DE CAIXA</small>
          <h3>Setembro</h3>
        </div>
        <Badge>Saldo positivo</Badge>
      </div>

      <div className="finance-metrics">
        {cashMetrics.map(([label, value]) => (
          <Metric key={label} label={label} value={value} />
        ))}
      </div>

      <div className="cash-chart">
        <div className="line-grid" />
        <svg viewBox="0 0 620 170" preserveAspectRatio="none">
          <path
            d="M0 130 C45 123 60 90 105 101 S150 144 190 105 S245 67 285 83 S331 122 370 95 S421 41 466 69 S528 80 570 25 S600 39 620 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0 130 C45 123 60 90 105 101 S150 144 190 105 S245 67 285 83 S331 122 370 95 S421 41 466 69 S528 80 570 25 S600 39 620 14 V170 H0Z"
            fill="url(#fade)"
          />
          <defs>
            <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="currentColor" stopOpacity=".22" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="chart-labels">
          <span>01 set</span>
          <span>08 set</span>
          <span>15 set</span>
          <span>22 set</span>
          <span>30 set</span>
        </div>
      </div>
    </div>
  )
}

/* ---------- Dashboard + aviso flutuante "Estoque em atenção" ---------- */
export function FullDashboard() {
  return (
    <div className="full-dashboard">
      <MiniDashboard />
      <div className="dashboard-float">
        <span>Estoque em atenção</span>
        <b>8 itens abaixo do mínimo</b>
        <small>Ver estoque →</small>
      </div>
    </div>
  )
}

/* ============================================================================
   3. PEÇAS MENORES
   ============================================================================ */

// Barra do topo de cada "janela" (bolinha + título + três pontinhos)
function AppTop({ title }) {
  return (
    <div className="app-top">
      <span className="app-dot" />
      <b>{title}</b>
      <div>
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}

// Cartão de número (ex.: "Vendas hoje  R$ 4.280  ↑ 12%")
function Metric({ label, value, up }) {
  return (
    <div className="metric">
      <small>{label}</small>
      <b>{value}</b>
      {up && <em>↑ {up}</em>}
    </div>
  )
}

// Cartão de lote dentro do quadro de produção
function LotCard({ lot, tone }) {
  return (
    <article className="lot-card">
      <div>
        <b>{lot[0]}</b>
        <Badge tone={tone}>{tone === 'orange' ? 'Em andamento' : 'Aguardando'}</Badge>
      </div>
      <small>{lot[1]}</small>
      <small>✦ {lot[2]}</small>
      <footer>
        Previsão <b>{lot[3]}</b>
      </footer>
    </article>
  )
}