import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api.js'
import SEOHead from '../../components/seo/SEOHead.jsx'
import PostGrid from '../../components/blog/PostGrid.jsx'
import Pagination from '../../components/ui/Pagination.jsx'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [page, setPage] = useState(1)
  const query = searchParams.get('q') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['search', query, page],
    queryFn: () => api.get(`/posts/search?q=${encodeURIComponent(query)}&page=${page}`).then(r => r.data),
    enabled: !!query
  })

  const handleSearch = (e) => {
    e.preventDefault()
    if (q.trim()) {
      setSearchParams({ q: q.trim() })
      setPage(1)
    }
  }

  const posts = data?.posts || []
  const pagination = data?.pagination

  return (
    <>
      <SEOHead
        title={query ? `Search: "${query}"` : 'Search'}
        description="Search WealthTicker articles on investing, budgeting, crypto, and more."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search bar */}
        <div className="max-w-2xl mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Articles</h1>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for topics, tips, strategies..."
              className="flex-1 border border-gray-300 rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button type="submit" className="btn-primary rounded-xl px-6 py-3">
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {query && (
          <div>
            <p className="text-sm text-gray-500 mb-6">
              {isLoading
                ? 'Searching...'
                : `${pagination?.total || 0} results for "${query}"`
              }
            </p>
            <PostGrid
              posts={posts}
              loading={isLoading}
              emptyMessage={`No results found for "${query}". Try different keywords.`}
            />
            <Pagination page={page} pages={pagination?.pages || 1} onPageChange={setPage} />
          </div>
        )}
      </div>
    </>
  )
}
