import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api.js'
import SEOHead from '../../components/seo/SEOHead.jsx'
import PostGrid from '../../components/blog/PostGrid.jsx'
import Sidebar from '../../components/layout/Sidebar.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import AdUnit from '../../components/monetization/AdUnit.jsx'

export default function CategoryPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['category-posts', slug, page],
    queryFn: () => api.get(`/posts/category/${slug}?page=${page}`).then(r => r.data)
  })

  const category = data?.category
  const posts = data?.posts || []
  const pagination = data?.pagination

  return (
    <>
      <SEOHead
        title={category?.metaTitle || category?.name}
        description={category?.metaDescription || category?.description}
        canonical={`${import.meta.env.VITE_SITE_URL}/category/${slug}`}
      />

      {/* Category hero */}
      <div className="bg-gradient-to-br from-brand-50 to-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-3">
            {category?.color && (
              <div className="w-3 h-10 rounded-full" style={{ backgroundColor: category.color }} />
            )}
            <h1 className="text-3xl font-bold text-gray-900">{category?.name}</h1>
          </div>
          {category?.description && (
            <p className="text-gray-600 max-w-2xl ml-7">{category.description}</p>
          )}
          {pagination && (
            <p className="text-sm text-gray-400 mt-2 ml-7">
              {pagination.total} articles
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AdUnit slot="5678901234" />
        <div className="flex flex-col lg:flex-row gap-10 mt-4">
          <div className="flex-1 min-w-0">
            <PostGrid
              posts={posts}
              loading={isLoading}
              emptyMessage={`No posts in ${category?.name || 'this category'} yet.`}
            />
            <Pagination page={page} pages={pagination?.pages || 1} onPageChange={setPage} />
          </div>
          <div className="lg:w-80 flex-shrink-0">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  )
}
