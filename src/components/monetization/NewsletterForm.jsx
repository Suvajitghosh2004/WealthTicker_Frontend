import { useState } from 'react'
import api from '../../services/api.js'
import toast from 'react-hot-toast'

export default function NewsletterForm({ compact = false }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await api.post('/newsletter/subscribe', { email })
      setSubscribed(true)
      setEmail('')
      toast.success('Welcome! Check your inbox.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed')
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <div className="text-center py-2">
        <p className="text-2xl mb-1">🎉</p>
        <p className={`font-semibold text-gray-900 ${compact ? 'text-sm' : ''}`}>
          You're subscribed!
        </p>
        <p className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'} mt-1`}>
          Check your inbox for a welcome email.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex flex-col ${compact ? 'gap-2' : 'sm:flex-row gap-3'}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className={`flex-1 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-brand-400 ${compact ? 'py-2 text-sm' : 'py-3'}`}
        />
        <button
          type="submit"
          disabled={loading}
          className={`btn-primary rounded-lg whitespace-nowrap ${compact ? 'py-2 text-sm px-4' : 'py-3 px-6'}`}
        >
          {loading ? 'Joining...' : compact ? 'Subscribe' : 'Get Free Tips →'}
        </button>
      </div>
      {!compact && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Free every week. No spam. Unsubscribe anytime.
        </p>
      )}
    </form>
  )
}