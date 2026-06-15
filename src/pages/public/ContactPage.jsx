import { useState } from 'react'
import api from '../../services/api.js'
import SEOHead from '../../components/seo/SEOHead.jsx'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      setSent(true)
      toast.success('Message sent! We\'ll reply within 2 business days.')
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEOHead
        title="Contact Us"
        description="Get in touch with the WealthTicker team."
        canonical={`${import.meta.env.VITE_SITE_URL}/contact`}
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
        <p className="text-gray-500 mb-10">
          Questions, corrections, or partnership inquiries? We'd love to hear from you.
        </p>

        {sent ? (
          <div className="text-center py-16 bg-green-50 rounded-2xl border border-green-100">
            <p className="text-4xl mb-3">✉️</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Message Received!</h2>
            <p className="text-gray-600">We'll get back to you within 2 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="How can we help?"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary rounded-xl w-full py-3 text-base"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </>
  )
}
