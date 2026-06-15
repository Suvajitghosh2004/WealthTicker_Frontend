import { Link } from 'react-router-dom'

const LINKS = {
  Topics: [
    { label: 'Investing', to: '/category/investing' },
    { label: 'Budgeting', to: '/category/budgeting' },
    { label: 'Crypto', to: '/category/crypto' },
    { label: 'Tax', to: '/category/tax' },
    { label: 'Credit Cards', to: '/category/credit-cards' },
    { label: 'Retirement', to: '/category/retirement' }
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy' }
  ]
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-bold text-xl text-white">
                Wealth<span className="text-brand-400">Ticker</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Smart money insights for everyday investors. We help you grow your wealth
              with practical, actionable financial advice.
            </p>
            <p className="text-xs mt-4 text-gray-500">
              <strong>Disclosure:</strong> WealthTicker participates in the Amazon
              Associates Program. We may earn commissions from qualifying purchases.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold text-sm mb-4">{heading}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm hover:text-brand-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} WealthTicker. All rights reserved.</p>
          <p>Not financial advice. Always consult a licensed professional.</p>
        </div>
      </div>
    </footer>
  )
}
