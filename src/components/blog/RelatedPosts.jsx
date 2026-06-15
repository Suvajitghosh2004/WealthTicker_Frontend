import { Link } from 'react-router-dom'
import { formatDateShort } from '../../utils/formatDate.js'

export default function RelatedPosts({ posts = [] }) {
  if (!posts.length) return null

  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-6">You Might Also Like</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post._id} to={`/post/${post.slug}`} className="group">
            <div className="aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-gray-100">
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-brand-100 flex items-center justify-center text-3xl">💰</div>
              )}
            </div>
            {post.category && (
              <span
                className="badge text-xs text-white mb-2"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </span>
            )}
            <h4 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors text-sm leading-snug line-clamp-2">
              {post.title}
            </h4>
            <p className="text-xs text-gray-400 mt-1">{formatDateShort(post.createdAt)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
