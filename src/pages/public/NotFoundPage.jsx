import { Link, useNavigate } from 'react-router-dom'
import SEOHead from '../../components/seo/SEOHead.jsx'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <>
      <SEOHead title="404 — Page Not Found" description="This page doesn't exist." />
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        {/* Illustration */}
        <div className="relative mb-8">
          <p className="text-[120px] sm:text-[160px] font-black text-gray-100 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl animate-bounce">💸</div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          This page took a bad investment
        </h1>
        <p className="text-gray-500 mb-8 max-w-md text-sm sm:text-base leading-relaxed">
          Looks like this page doesn't exist or was moved. Don't let it affect your portfolio — 
          let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <Link to="/" className="btn-primary rounded-xl px-8 py-3 text-sm font-semibold">
            ← Back to Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="btn-outline rounded-xl px-8 py-3 text-sm font-semibold"
          >
            Go Back
          </button>
          <Link to="/search" className="btn-outline rounded-xl px-8 py-3 text-sm font-semibold">
            Search Articles
          </Link>
        </div>

        {/* Suggested links */}
        <div className="w-full max-w-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Popular Topics
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Investing', slug: 'investing' },
              { label: 'Budgeting', slug: 'budgeting' },
              { label: 'Crypto', slug: 'crypto' },
              { label: 'Tax Tips', slug: 'tax' },
              { label: 'Credit Cards', slug: 'credit-cards' },
              { label: 'Retirement', slug: 'retirement' }
            ].map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="px-3 py-1.5 bg-gray-100 hover:bg-brand-50 hover:text-brand-700 text-gray-600 rounded-full text-xs font-medium transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}