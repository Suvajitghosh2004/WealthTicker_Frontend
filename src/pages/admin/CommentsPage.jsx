import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import Badge from '../../components/ui/Badge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import { timeAgo } from '../../utils/formatDate.js'
import toast from 'react-hot-toast'

const STATUS_VARIANT = { approved: 'success', pending: 'warning', rejected: 'danger' }

export default function CommentsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('pending')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-comments', page, statusFilter],
    queryFn: () =>
      api.get(`/admin/comments?page=${page}${statusFilter ? `&status=${statusFilter}` : ''}`).then(r => r.data)
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/comments/${id}`, { status }),
    onSuccess: () => {
      toast.success('Comment updated')
      qc.invalidateQueries(['admin-comments'])
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/comments/${id}`),
    onSuccess: () => {
      toast.success('Comment deleted')
      qc.invalidateQueries(['admin-comments'])
    }
  })

  const comments = data?.comments || []
  const pagination = data?.pagination

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination?.total || 0} total</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'approved', 'rejected'].map((s) => (
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

      {/* Comments list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : comments.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-2">💬</p>
            <p>No comments found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {comments.map((comment) => (
              <div key={comment._id} className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {comment.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{comment.name}</span>
                      <span className="text-xs text-gray-400">{comment.email}</span>
                      <Badge variant={STATUS_VARIANT[comment.status] || 'default'} className="text-xs">
                        {comment.status}
                      </Badge>
                      <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                    </div>
                    {comment.post && (
                      <p className="text-xs text-brand-600 mb-2">
                        on:{' '}
                        <Link
                          to={`/post/${comment.post.slug}`}
                          target="_blank"
                          className="hover:underline"
                        >
                          {comment.post.title}
                        </Link>
                      </p>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed">{comment.body}</p>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => statusMutation.mutate({ id: comment._id, status: 'approved' })}
                        className="text-xs bg-green-50 text-green-700 hover:bg-green-100 rounded-lg px-3 py-1.5 font-medium transition-colors"
                      >
                        ✓ Approve
                      </button>
                    )}
                    {comment.status !== 'rejected' && (
                      <button
                        onClick={() => statusMutation.mutate({ id: comment._id, status: 'rejected' })}
                        className="text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg px-3 py-1.5 font-medium transition-colors"
                      >
                        ✗ Reject
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Delete this comment?')) deleteMutation.mutate(comment._id)
                      }}
                      className="text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg px-3 py-1.5 font-medium transition-colors"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination page={page} pages={pagination?.pages || 1} onPageChange={setPage} />
    </div>
  )
}
