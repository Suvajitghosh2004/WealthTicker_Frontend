import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../services/api.js'
import toast from 'react-hot-toast'

export default function CommentForm({ postId }) {
  const [form, setForm] = useState({ name: '', email: '', body: '' })
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/comments', { ...form, postId })
      toast.success('Comment submitted! It will appear after moderation.')
      setForm({ name: '', email: '', body: '' })
      queryClient.invalidateQueries(['comments', postId])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
      <h4 className="text-lg font-bold text-gray-900 mb-5">Leave a Comment</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Not published"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Comment *</label>
          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Share your thoughts..."
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary rounded-xl px-6 py-2.5 text-sm"
        >
          {loading ? 'Submitting...' : 'Post Comment'}
        </button>
        <p className="text-xs text-gray-400">Comments are moderated and may take a few hours to appear.</p>
      </form>
    </div>
  )
}
