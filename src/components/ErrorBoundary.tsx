import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Rádio L20] Erro capturado pelo ErrorBoundary:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <section className="content-section page-section" role="alert">
          <div className="admin-empty-state">
            <p className="eyebrow">Erro inesperado</p>
            <h1>Algo deu errado</h1>
            <p>Um erro aconteceu ao carregar esta parte da página.</p>
            {this.state.error?.message ? (
              <p className="admin-feedback is-error">{this.state.error.message}</p>
            ) : null}
            <button
              className="advertise-primary"
              type="button"
              onClick={this.handleReset}
            >
              Tentar novamente
            </button>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
