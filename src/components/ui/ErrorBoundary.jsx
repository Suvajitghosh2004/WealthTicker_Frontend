import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <p className="text-6xl mb-4">⚠️</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md">
            An unexpected error occurred. This has been noted and we're working on it.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-primary rounded-xl px-6 py-2.5 text-sm"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-outline rounded-xl px-6 py-2.5 text-sm"
            >
              Go Home
            </button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <details className="mt-6 text-left w-full max-w-xl">
              <summary className="text-xs text-gray-400 cursor-pointer mb-2">
                Error details (dev only)
              </summary>
              <pre className="text-xs bg-red-50 border border-red-100 rounded-xl p-4 overflow-auto text-red-700 leading-relaxed">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}