import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api.js'
import Spinner from '../../components/ui/Spinner.jsx'
import { formatDateShort } from '../../utils/formatDate.js'
import toast from 'react-hot-toast'

export default function NewsletterPage() {
  const [broadcastForm, setBroadcastForm] = useState({ subject: '', html: '' })
  const [sending, setSending] = useState(false)
  const [showBroadcast, setShowBroadcast] = useState(false)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['subscribers'],
    queryFn: () => api.get('/admin/newsletter').then(r => r.data)
  })

  const unsubscribeMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/newsletter/${id}`),
    onSuccess: () => {
      toast.success('Subscriber removed')
      qc.invalidateQueries(['subscribers'])
    }
  })

  const subscribers = data?.subscribers || []
  const total = data?.total || 0

  const handleExportCSV = () => {
    const rows = [
      ['Email', 'Subscribed At'],
      ...subscribers.map(s => [s.email, formatDateShort(s.createdAt)])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wealthticker-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${subscribers.length} subscribers`)
  }

  const handleSendBroadcast = async (e) => {
    e.preventDefault()
    if (!confirm(`Send to ${total} subscribers?`)) return
    setSending(true)
    try {
      await api.post('/admin/newsletter/send', broadcastForm)
      toast.success(`Broadcast sent to ${total} subscribers!`)
      setBroadcastForm({ subject: '', html: '' })
      setShowBroadcast(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Send failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
          <p className="text-sm text-gray-500 mt-1">{total} active subscribers</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-outline rounded-xl px-4 py-2.5 text-sm">
            ↓ Export CSV
          </button>
          <button
            onClick={() => setShowBroadcast(!showBroadcast)}
            className="btn-primary rounded-xl px-4 py-2.5 text-sm"
          >
            📧 Send Broadcast
          </button>
        </div>
      </div>

      {/* Broadcast form */}
      {showBroadcast && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-5">Send Broadcast Email</h3>
          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
              <input
                type="text"
                value={broadcastForm.subject}
                onChange={(e) => setBroadcastForm(f => ({ ...f, subject: e.target.value }))}
                required
                placeholder="This week's money tips 💰"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">HTML Content *</label>
              <textarea
                value={broadcastForm.html}
                onChange={(e) => setBroadcastForm(f => ({ ...f, html: e.target.value }))}
                required
                rows={10}
                placeholder="<h1>Hello!</h1><p>This week we're covering...</p>"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={sending} className="btn-primary rounded-xl px-6 py-2.5 text-sm">
                {sending ? 'Sending...' : `Send to ${total} subscribers`}
              </button>
              <button type="button" onClick={() => setShowBroadcast(false)} className="btn-outline rounded-xl px-4 py-2.5 text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Subscribers table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p>No subscribers yet.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Subscribers</p>
              <p className="text-xs text-gray-400">{total} active</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subscribed</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subscribers.map((sub) => (
                    <tr key={sub._id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-800">{sub.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDateShort(sub.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Unsubscribe ${sub.email}?`)) unsubscribeMutation.mutate(sub._id)
                          }}
                          className="text-xs text-red-500 hover:text-red-600 font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
