import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api.js'
import NewsletterForm from '../monetization/NewsletterForm.jsx'
import { formatDateShort } from '../../utils/formatDate.js'

export default function Sidebar() {
  const { data: trendingData } = useQuery({
    queryKey: ['trending'],
    queryFn: () => api.get('/posts/trending').then(r => r.data)
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data)
  })

  const trending = trendingData?.posts?.slice(0, 5) || []
  const categories = categoriesData?.categories || []

  return (
    <aside className="space-y-8">
      {/* Newsletter */}
      <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100">
        <h3 className="font-bold text-gray-900 text-lg mb-1">💰 Weekly Money Tips</h3>
        <p className="text-sm text-gray-600 mb-4">
          Practical personal finance insights every week. Free.
        </p>
        <NewsletterForm compact />
      </div>

      {/* Popular Posts */}
      {trending.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-4 pb-2 border-b border-gray-100">
            🔥 Popular Posts
          </h3>
          <ul className="space-y-4">
            {trending.map((post, i) => (
              <li key={post._id} className="flex gap-3">
                <span className="text-2xl font-black text-gray-200 leading-none w-7 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <Link
                    to={`/post/${post.slug}`}
                    className="text-sm font-medium text-gray-800 hover:text-brand-600 leading-snug line-clamp-2"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDateShort(post.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-4 pb-2 border-b border-gray-100">
            Browse Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="badge text-white text-xs px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}