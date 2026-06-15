import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api.js'
import SEOHead from '../../components/seo/SEOHead.jsx'
import PostCard from '../../components/blog/PostCard.jsx'
import PostGrid from '../../components/blog/PostGrid.jsx'
import Sidebar from '../../components/layout/Sidebar.jsx'
import NewsletterForm from '../../components/monetization/NewsletterForm.jsx'
import AdUnit from '../../components/monetization/AdUnit.jsx'
import Pagination from '../../components/ui/Pagination.jsx'

const CATEGORIES = [
  { name: 'All', slug: null },
  { name: 'Investing', slug: 'investing' },
  { name: 'Budgeting', slug: 'budgeting' },
  { name: 'Crypto', slug: 'crypto' },
  { name: 'Tax', slug: 'tax' },
  { name: 'Credit Cards', slug: 'credit-cards' },
  { name: 'Retirement', slug: 'retirement' }
]

export default function HomePage() {
  const [page, setPage] = useState(1)
  const [activeCategory, setActiveCategory] = useState(null)
  const navigate = useNavigate()

  const { data: featuredData } = useQuery({
    queryKey: ['featured'],
    queryFn: () => api.get('/posts/featured').then(r => r.data)
  })

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts', page, activeCategory],
    queryFn: () => {
      const url = activeCategory
        ? `/posts/category/${activeCategory}?page=${page}`
        : `/posts?page=${page}`
      return api.get(url).then(r => r.data)
    }
  })

  const featured = featuredData?.posts?.[0]
  const posts = postsData?.posts || []
  const pagination = postsData?.pagination

  const handleCategoryChange = (slug) => {
    setActiveCategory(slug)
    setPage(1)
  }

  return (
    <>
      <SEOHead
        title="WealthTicker — Smart Money. Better Life."
        description="Actionable personal finance tips on investing, budgeting, crypto, tax, credit cards, and retirement planning for everyday Americans."
        canonical={import.meta.env.VITE_SITE_URL}
      />

      {/* Hero */}
      {featured && (
        <section className="bg-gradient-to-br from-brand-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <PostCard post={featured} featured />
          </div>
        </section>
      )}

      {/* Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdUnit slot="1234567890" format="horizontal" />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Posts column */}
          <div className="flex-1 min-w-0">
            {/* Category filter tabs */}
            <div className="flex gap-2 flex-wrap mb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug ?? 'all'}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.slug
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <PostGrid posts={posts} loading={isLoading} />
            <Pagination
              page={page}
              pages={pagination?.pages || 1}
              onPageChange={setPage}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Newsletter CTA section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-wide mb-3">
            Free Weekly Newsletter
          </p>
          <h2 className="text-3xl font-bold mb-4">
            Build Wealth One Email at a Time
          </h2>
          <p className="text-gray-400 mb-8">
            Practical money tips delivered every week. No fluff, no spam, no fake numbers.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  )
}
