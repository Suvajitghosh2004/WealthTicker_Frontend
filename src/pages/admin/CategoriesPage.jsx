import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api.js'
import { slugify } from '../../utils/slugify.js'
import toast from 'react-hot-toast'
import Spinner from '../../components/ui/Spinner.jsx'

const EMPTY = { name: '', slug: '', description: '', color: '#F59E0B', metaTitle: '', metaDescription: '' }

export default function CategoriesPage() {
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data)
  })

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editing
        ? api.put(`/admin/categories/${editing}`, payload)
        : api.post('/admin/categories', payload),
    onSuccess: () => {
      toast.success(editing ? 'Category updated!' : 'Category created!')
      qc.invalidateQueries(['categories'])
      resetForm()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed')
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => {
      toast.success('Category deleted')
      qc.invalidateQueries(['categories'])
    }
  })

  const categories = data?.categories || []

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({
      ...f,
      [name]: value,
      ...(name === 'name' && !editing ? { slug: slugify(value) } : {})
    }))
  }

  const handleEdit = (cat) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      color: cat.color || '#F59E0B',
      metaTitle: cat.metaTitle || '',
      metaDescription: cat.metaDescription || ''
    })
    setEditing(cat._id)
    setShowForm(true)
  }

  const resetForm = () => {
    setForm(EMPTY)
    setEditing(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    saveMutation.mutate(form)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="btn-primary rounded-xl px-5 py-2.5 text-sm"
        >
          + New Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category list */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center py-12"><Spinner /></div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No categories yet.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                    <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Slug</th>
                    <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Color</th>
                    <th className="px-4 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="font-medium text-gray-900 text-sm">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">{cat.slug}</td>
                      <td className="px-4 py-4">
                        <code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{cat.color}</code>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3 justify-end">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${cat.name}"?`)) deleteMutation.mutate(cat._id)
                            }}
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
            )}
          </div>
        </div>

        {/* Form panel */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">{editing ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Investing"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  placeholder="investing"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={form.metaTitle}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={form.metaDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary rounded-xl flex-1 py-2.5 text-sm">
                  {saveMutation.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={resetForm} className="btn-outline rounded-xl px-4 py-2.5 text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
