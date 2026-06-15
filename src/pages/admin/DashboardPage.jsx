import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import { formatDateShort, timeAgo } from '../../utils/formatDate.js'

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value?.toLocaleString() ?? '—'}</p>
    </div>
  </div>
)

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/analytics').then(r => r.data)
  })

  const stats = data?.stats
  const topPosts = data?.topPosts || []
  const recentComments = data?.recentComments || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Published Posts" value={stats?.totalPosts} icon="📝" color="bg-blue-50" />
        <StatCard label="Total Views" value={stats?.totalViews} icon="👁️" color="bg-green-50" />
        <StatCard label="Comments" value={stats?.totalComments} icon="💬" color="bg-purple-50" />
        <StatCard label="Pending" value={stats?.pendingComments} icon="⏳" color="bg-yellow-50" />
        <StatCard label="Subscribers" value={stats?.subscriberCount} icon="📧" color="bg-brand-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Posts */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Top Posts</h2>
            <Link to="/admin/posts" className="text-sm text-brand-600 hover:text-brand-700">View all →</Link>
          </div>
          {topPosts.length === 0 ? (
            <p className="text-sm text-gray-400">No posts yet.</p>
          ) : (
            <div className="space-y-3">
              {topPosts.map((post, i) => (
                <div key={post._id} className="flex items-center gap-3">
                  <span className="text-lg font-black text-gray-200 w-6 text-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/post/${post.slug}`}
                      target="_blank"
                      className="text-sm font-medium text-gray-800 hover:text-brand-600 line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-gray-400">{post.views?.toLocaleString()} views</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Pending Comments */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">
              Pending Comments
              {stats?.pendingComments > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {stats.pendingComments}
                </span>
              )}
            </h2>
            <Link to="/admin/comments" className="text-sm text-brand-600 hover:text-brand-700">Moderate →</Link>
          </div>
          {recentComments.length === 0 ? (
            <p className="text-sm text-gray-400">No pending comments. 🎉</p>
          ) : (
            <div className="space-y-3">
              {recentComments.map((comment) => (
                <div key={comment._id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-800">{comment.name}</span>
                    <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{comment.body}</p>
                  {comment.post && (
                    <p className="text-xs text-brand-600 mt-1 truncate">
                      on: {comment.post.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/posts/new" className="btn-primary rounded-xl px-5 py-2.5 text-sm">
            ✍️ New Post
          </Link>
          <Link to="/admin/media" className="btn-outline rounded-xl px-5 py-2.5 text-sm">
            🖼️ Media Library
          </Link>
          <Link to="/admin/newsletter" className="btn-outline rounded-xl px-5 py-2.5 text-sm">
            📧 Newsletter
          </Link>
          <Link to="/" target="_blank" className="btn-outline rounded-xl px-5 py-2.5 text-sm">
            🌐 View Site
          </Link>
        </div>
      </div>
    </div>
  )
}
