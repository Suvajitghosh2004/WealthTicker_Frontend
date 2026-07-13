import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api.js'
import SEOHead from '../../components/seo/SEOHead.jsx'
import ReadingProgress from '../../components/blog/ReadingProgress.jsx'
import AuthorBio from '../../components/blog/AuthorBio.jsx'
import RelatedPosts from '../../components/blog/RelatedPosts.jsx'
import AffiliateCard from '../../components/monetization/AffiliateCard.jsx'
import AdUnit from '../../components/monetization/AdUnit.jsx'
import NativeBanner from '../../components/monetization/NativeBanner.jsx'
import ShareButtons from '../../components/ui/ShareButtons.jsx'
import Sidebar from '../../components/layout/Sidebar.jsx'
import CommentList from '../../components/comments/CommentList.jsx'
import CommentForm from '../../components/comments/CommentForm.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import PageError from '../../components/ui/PageError.jsx'
import { formatDate } from '../../utils/formatDate.js'
import { formatReadTime } from '../../utils/readTime.js'

export default function PostPage() {
  const { slug } = useParams()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => api.get(`/posts/${slug}`).then(r => r.data),
    retry: 1
  })

  const post = data?.post

  const { data: relatedData } = useQuery({
    queryKey: ['related', post?.category?.slug],
    queryFn: () =>
      api.get(`/posts/category/${post.category.slug}`).then(r => r.data),
    enabled: !!post?.category?.slug
  })
  const related = relatedData?.posts?.filter(p => p._id !== post?._id).slice(0, 3) || []

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !post) {
    const status = error?.response?.status || 404
    return <PageError status={status} onRetry={refetch} />
  }

  const canonicalUrl = `${import.meta.env.VITE_SITE_URL}/post/${post.slug}`

  return (
    <>
      <SEOHead
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        ogImage={post.ogImage || post.thumbnail}
        canonical={post.canonicalUrl || canonicalUrl}
        type="article"
        article={{
          title: post.title,
          ogImage: post.ogImage || post.thumbnail,
          author: post.author?.name,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          excerpt: post.excerpt
        }}
      />
      <ReadingProgress />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── Article ── */}
          <article className="flex-1 min-w-0 max-w-3xl">

            {/* Breadcrumb */}
            <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2 flex-wrap">
              <Link to="/" className="hover:text-brand-600">Home</Link>
              <span>/</span>
              {post.category && (
                <>
                  <Link
                    to={`/category/${post.category.slug}`}
                    className="hover:text-brand-600"
                  >
                    {post.category.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-gray-600 truncate">{post.title}</span>
            </nav>

            {/* Category badge */}
            {post.category && (
              <Link
                to={`/category/${post.category.slug}`}
                className="badge text-white mb-4 inline-block"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 flex-wrap">
              {post.author && (
                <span className="font-medium text-gray-700">{post.author.name}</span>
              )}
              <time>{formatDate(post.createdAt)}</time>
              {post.readTime && <span>{formatReadTime(post.readTime)}</span>}
              <span>{post.views?.toLocaleString()} views</span>
            </div>

            {/* Thumbnail */}
            {post.thumbnail && (
              <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            )}

            {/* Ad after intro */}
            <AdUnit slot="2345678901" />

            {/* Article content */}
            <div
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Affiliate cards */}
            {post.affiliateCards?.map((card, i) => (
              <AffiliateCard key={i} {...card} />
            ))}

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {post.tags.map((tag) => (
                  <span key={tag} className="badge bg-gray-100 text-gray-600 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share buttons */}
            <div className="border-t border-b border-gray-100 py-6 my-8">
              <ShareButtons
                url={`/post/${post.slug}`}
                title={post.title}
                image={post.thumbnail}
              />
            </div>

            {/* Author bio */}
            <AuthorBio author={post.author} />

            {/* Related posts */}
            <RelatedPosts posts={related} />

            {/* ── End of post — Native Banner ── */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">
                Sponsored
              </p>
              <NativeBanner />
            </div>

            {/* Ad before comments */}
            <AdUnit slot="4567890123" />

            {/* Comments */}
            {post.allowComments && (
              <div className="mt-12">
                <CommentList postId={post._id} />
                <CommentForm postId={post._id} />
              </div>
            )}
          </article>

          {/* ── Sidebar ── */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}