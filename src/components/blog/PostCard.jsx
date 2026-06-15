import { Link } from 'react-router-dom'
import { formatDateShort } from '../../utils/formatDate.js'
import { formatReadTime } from '../../utils/readTime.js'

export default function PostCard({ post, featured = false }) {
  return (
    <article className={`card group hover:shadow-md transition-shadow ${featured ? 'md:flex' : ''}`}>
      {/* Thumbnail */}
      <Link to={`/post/${post.slug}`} className={`block overflow-hidden ${featured ? 'md:w-2/5 flex-shrink-0' : 'aspect-[16/9]'}`}>
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${featured ? 'md:h-full h-56' : 'h-48 sm:h-52'}`}
            loading="lazy"
          />
        ) : (
          <div className={`w-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center ${featured ? 'h-56 md:h-full' : 'h-48 sm:h-52'}`}>
            <span className="text-4xl">💰</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category badge */}
        {post.category && (
          <Link
            to={`/category/${post.category.slug}`}
            className="badge text-xs font-semibold text-white w-fit mb-3"
            style={{ backgroundColor: post.category.color || '#F59E0B' }}
          >
            {post.category.name}
          </Link>
        )}

        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h2 className={`font-bold text-gray-900 group-hover:text-brand-600 transition-colors leading-snug ${featured ? 'text-xl md:text-2xl' : 'text-lg'} line-clamp-2`}>
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
          {post.author?.name && (
            <span className="font-medium text-gray-600">{post.author.name}</span>
          )}
          <span>·</span>
          <time>{formatDateShort(post.createdAt)}</time>
          {post.readTime && (
            <>
              <span>·</span>
              <span>{formatReadTime(post.readTime)}</span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
