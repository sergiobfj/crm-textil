import { Button } from '../components/ui/Button'
import { Container } from '../components/layout/Container'

export function LoginPage() { return <main className="login-page"><Container><a className="brand" href="/">f<span>i</span>o</a><section className="login-card"><p className="eyebrow">ACESSO À PLATAFORMA</p><h1>Boas-vindas de volta.</h1><p>O fluxo de autenticação será conectado aqui, reutilizando a base visual da plataforma.</p><label>E-mail<input type="email" placeholder="voce@empresa.com" /></label><label>Senha<input type="password" placeholder="••••••••" /></label><Button>Entrar →</Button><a href="/">← Voltar para o site</a></section></Container></main> }
