import SEOHead from '../../components/seo/SEOHead.jsx'
import NewsletterForm from '../../components/monetization/NewsletterForm.jsx'

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About WealthTicker"
        description="WealthTicker helps everyday Americans build wealth with practical, actionable personal finance content."
        canonical={`${import.meta.env.VITE_SITE_URL}/about`}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About WealthTicker</h1>

        <div className="prose prose-gray max-w-none">
          <h2>Our Mission</h2>
          <p>
            WealthTicker exists to make personal finance accessible to everyone. We break down
            complex money topics — from index fund investing to tax optimization — into clear,
            actionable steps that real people can implement today.
          </p>

          <h2>What We Cover</h2>
          <ul>
            <li><strong>Investing:</strong> Stock market basics, ETFs, index funds, and building long-term wealth.</li>
            <li><strong>Budgeting:</strong> Practical frameworks for saving more and spending less.</li>
            <li><strong>Crypto:</strong> Objective coverage of digital assets without the hype.</li>
            <li><strong>Tax:</strong> Legal strategies to minimize your tax bill and keep more of your money.</li>
            <li><strong>Credit Cards:</strong> The best cards for rewards, cashback, and building credit.</li>
            <li><strong>Retirement:</strong> 401(k), IRA, Roth, and building a retirement you can count on.</li>
          </ul>

          <h2>Affiliate Disclosure</h2>
          <p>
            WealthTicker participates in the Amazon Services LLC Associates Program, an affiliate
            advertising program designed to provide a means for sites to earn advertising fees by
            advertising and linking to Amazon.com. We may earn a small commission when you click
            links and make purchases — at no extra cost to you. We only recommend products we
            genuinely believe in.
          </p>

          <h2>Not Financial Advice</h2>
          <p>
            The content on WealthTicker is for informational and educational purposes only.
            Nothing here constitutes professional financial, investment, tax, or legal advice.
            Always consult a licensed professional before making financial decisions.
          </p>

          <h2>Get in Touch</h2>
          <p>
            Have a question, correction, or partnership inquiry?{' '}
            <a href="/contact">Contact us here</a>.
          </p>
        </div>

        {/* Newsletter */}
        <div className="bg-brand-50 rounded-2xl p-8 mt-12 border border-brand-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Join Our Newsletter</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Weekly money insights delivered every Thursday. Free forever.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </>
  )
}
