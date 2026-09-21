/* ============================================================================
   LOGIN / CADASTRO — FIO

   Uma tela só, com dois modos:
     /login                 → "Entrar"      (quem já tem conta)
     /login?modo=cadastro   → "Criar conta" (primeira vez)

   COMO ESTÁ ORGANIZADO:
   1. IMPORTS
   2. CONTEÚDO ........ textos de cada modo e opções do formulário (edite aqui)
   3. PÁGINA .......... LoginPage
   4. PEÇAS MENORES ... Field, PasswordField
   ============================================================================ */

/* ============================================================================
   1. IMPORTS
   ============================================================================ */
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Container } from '../components/layout/Container'

/* ============================================================================
   2. CONTEÚDO
   ============================================================================ */

// Mesmo número do rodapé da landing (LandingPage.jsx). Se mudar, mude nos dois.
const WHATSAPP_NUMBER = '5581995718479'
function whatsappLink(origem) {
  const message = `Olá! Vim pelo site do Fio (${origem}) e quero saber mais sobre o sistema.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

// Textos de cada modo
const COPY = {
  login: {
    eyebrow: 'ACESSO À PLATAFORMA',
    title: (
      <>
        Boas-vindas <em>de volta.</em>
      </>
    ),
    text: 'Entre para acompanhar clientes, estoque, produção e financeiro.',
    submit: 'Entrar',
    whatsappOrigin: 'login',
  },
  signup: {
    eyebrow: 'PRIMEIRO ACESSO',
    title: (
      <>
        Comece a organizar <em>sua operação.</em>
      </>
    ),
    text: 'Crie sua conta e centralize clientes, vendas, estoque, produção e financeiro em um só lugar.',
    submit: 'Criar conta',
    whatsappOrigin: 'cadastro',
  },
}

// Opções do campo "Tipo de negócio" (as mesmas da seção "Para quem é")
const businessTypes = ['Lojista', 'Atacadista', 'Confecção', 'Pequena operação']

// Endereço de cada modo (usado para manter a URL certa ao trocar de aba)
const MODE_URL = {
  login: '/login',
  signup: '/login?modo=cadastro',
}

// Abre no modo certo conforme o endereço
function getInitialMode() {
  if (typeof window === 'undefined') return 'login'
  return new URLSearchParams(window.location.search).get('modo') === 'cadastro'
    ? 'signup'
    : 'login'
}

/* ============================================================================
   3. PÁGINA
   ============================================================================ */
export function LoginPage() {
  const [mode, setMode] = useState(getInitialMode)
  const [showNotice, setShowNotice] = useState(false)
  const isSignup = mode === 'signup'
  const copy = COPY[mode]

  function changeMode(next) {
    setMode(next)
    setShowNotice(false)
    window.history.replaceState(null, '', MODE_URL[next])
  }

  function handleSubmit(event) {
    event.preventDefault()

    // TODO: conectar ao backend.
    //   mode === 'login'  → autenticar com e-mail e senha
    //   mode === 'signup' → criar a conta com os campos do formulário
    // Dados do formulário: new FormData(event.currentTarget)
    //
    // Enquanto o acesso não está conectado, avisa o cliente e oferece o WhatsApp.
    setShowNotice(true)
  }

  return (
    <main className="login-page">
      <Container>
        <a className="brand" href="/">
          f<span>i</span>o
        </a>

        <div className="login-card">
          {/* Abas: Entrar | Criar conta */}
          <div className="login-tabs" role="tablist" aria-label="Acesso ao Fio">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignup}
              onClick={() => changeMode('login')}
            >
              Entrar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignup}
              onClick={() => changeMode('signup')}
            >
              Criar conta
            </button>
          </div>

          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.text}</p>

          {/* `key` faz o formulário recomeçar limpo ao trocar de aba */}
          <form className="login-form" key={mode} onSubmit={handleSubmit}>
            {isSignup && (
              <Field
                id="name"
                name="name"
                label="Seu nome"
                autoComplete="name"
                required
              />
            )}

            <Field
              id="email"
              name="email"
              label="E-mail"
              type="email"
              autoComplete={isSignup ? 'email' : 'username'}
              required
            />

            {isSignup && (
              <>
                <Field
                  id="whatsapp"
                  name="whatsapp"
                  label="WhatsApp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(81) 99999-9999"
                  required
                />

                <div className="field">
                  <label htmlFor="business">Tipo de negócio</label>
                  <select id="business" name="business" defaultValue="" required>
                    <option value="" disabled>
                      Selecione
                    </option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <PasswordField
              id="password"
              name="password"
              label="Senha"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={isSignup ? 8 : undefined}
              hint={isSignup ? 'Mínimo de 8 caracteres.' : undefined}
            />

            <button type="submit" className="button button--primary">
              {copy.submit} <ArrowRight size={16} />
            </button>
          </form>

          {/* Aviso enquanto o login/cadastro não estiver conectado (ver TODO acima) */}
          {showNotice && (
            <p className="login-notice" role="status">
              Estamos liberando o acesso à plataforma aos poucos.{' '}
              <a href={whatsappLink(copy.whatsappOrigin)} target="_blank" rel="noreferrer">
                Fale com a gente no WhatsApp
              </a>{' '}
              e avisamos você.
            </p>
          )}

          <a href="/">
            <ArrowLeft size={14} /> Voltar para o site
          </a>
        </div>
      </Container>
    </main>
  )
}

/* ============================================================================
   4. PEÇAS MENORES
   ============================================================================ */

// Campo de texto com rótulo
function Field({ id, label, ...inputProps }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...inputProps} />
    </div>
  )
}

// Campo de senha com botão para mostrar/ocultar
function PasswordField({ id, label, hint, ...inputProps }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="password-field">
        <input id={id} type={visible ? 'text' : 'password'} required {...inputProps} />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint && <small className="field-hint">{hint}</small>}
    </div>
  )
}