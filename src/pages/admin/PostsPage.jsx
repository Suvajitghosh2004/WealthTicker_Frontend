import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api.js'
import Badge from '../../components/ui/Badge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import { formatDateShort } from '../../utils/formatDate.js'
import toast from 'react-hot-toast'

const STATUS_VARIANT = { published: 'success', draft: 'default', scheduled: 'info' }

export default function PostsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts', page, statusFilter],
    queryFn: () =>
      api.get(`/admin/posts/all?page=${page}${statusFilter ? `&status=${statusFilter}` : ''}`)
        .then(r => r.data)
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/posts/${id}`),
    onSuccess: () => {
      toast.success('Post deleted')
      qc.invalidateQueries(['admin-posts'])
    },
    onError: () => toast.error('Delete failed')
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/posts/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Status updated')
      qc.invalidateQueries(['admin-posts'])
    }
  })

  const posts = data?.posts || []
  const pagination = data?.pagination

  const handleDelete = (post) => {
    if (confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(post._id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination?.total || 0} total posts</p>
        </div>
        <Link to="/admin/posts/new" className="btn-primary rounded-xl px-5 py-2.5 text-sm">
          + New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['', 'published', 'draft', 'scheduled'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === s ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p>No posts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Views</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{post.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{post.category?.name || '—'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={STATUS_VARIANT[post.status] || 'default'}>
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {post.views?.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDateShort(post.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        {post.status === 'draft' ? (
                          <button
                            onClick={() => statusMutation.mutate({ id: post._id, status: 'published' })}
                            className="text-xs text-green-600 hover:text-green-700 font-medium"
                          >
                            Publish
                          </button>
                        ) : (
                          <button
                            onClick={() => statusMutation.mutate({ id: post._id, status: 'draft' })}
                            className="text-xs text-yellow-600 hover:text-yellow-700 font-medium"
                          >
                            Unpublish
                          </button>
                        )}
                        <Link
                          to={`/admin/posts/edit/${post._id}`}
                          className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post)}
                          className="text-xs text-red-500 hover:text-red-600 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} pages={pagination?.pages || 1} onPageChange={setPage} />
    </div>
  )
}