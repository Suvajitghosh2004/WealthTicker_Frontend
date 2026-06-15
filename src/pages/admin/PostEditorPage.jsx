import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import api from '../../services/api.js'
import { slugify } from '../../utils/slugify.js'
import { calcReadTime } from '../../utils/readTime.js'
import toast from 'react-hot-toast'

const DEFAULT_FORM = {
  title: '', slug: '', excerpt: '', content: '',
  thumbnail: '', category: '', tags: '',
  status: 'draft', isFeatured: false, allowComments: true,
  metaTitle: '', metaDescription: '', focusKeyword: '',
  scheduledAt: '', affiliateCards: []
}

export default function PostEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const isEdit = !!id
  const editorPopulated = useRef(false)

  const [form, setForm] = useState(DEFAULT_FORM)
  const [activeTab, setActiveTab] = useState('content')
  const [uploading, setUploading] = useState(false)

  // Fetch categories
  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data)
  })
  const categories = catData?.categories || []

  // Fetch existing post by _id via admin route
  const { data: postData, isLoading: postLoading } = useQuery({
    queryKey: ['admin-post', id],
    queryFn: () => api.get(`/admin/posts/${id}`).then(r => r.data),
    enabled: isEdit,
    refetchOnWindowFocus: false
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing your article...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setForm(f => ({ ...f, content: html, readTime: calcReadTime(html) }))
    }
  })

  // Populate form + editor once both are ready — guard prevents re-runs
  useEffect(() => {
    if (!postData?.post || !editor || editorPopulated.current) return
    const p = postData.post
    setForm({
      title:           p.title           || '',
      slug:            p.slug            || '',
      excerpt:         p.excerpt         || '',
      content:         p.content         || '',
      thumbnail:       p.thumbnail       || '',
      category:        p.category?._id   || '',
      tags:            (p.tags || []).join(', '),
      status:          p.status          || 'draft',
      isFeatured:      p.isFeatured      || false,
      allowComments:   p.allowComments   !== false,
      metaTitle:       p.metaTitle       || '',
      metaDescription: p.metaDescription || '',
      focusKeyword:    p.focusKeyword    || '',
      scheduledAt:     p.scheduledAt     || '',
      affiliateCards:  p.affiliateCards  || []
    })
    // false = don't emit onUpdate, prevents overwriting readTime on load
    editor.commands.setContent(p.content || '', false)
    editorPopulated.current = true
  }, [postData, editor])

  const handleTitleChange = (e) => {
    const title = e.target.value
    setForm(f => ({
      ...f,
      title,
      slug:      isEdit ? f.slug : slugify(title),
      metaTitle: f.metaTitle || title
    }))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleThumbnailUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  // Client-side validation
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    toast.error('Only JPG, PNG and WebP images allowed')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image must be under 5MB')
    return
  }

  setUploading(true)
  try {
    const fd = new FormData()
    fd.append('image', file)
    const { data } = await api.post('/admin/media/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000 // 60s for image uploads
    })
    if (data.url) {
      setForm(f => ({ ...f, thumbnail: data.url }))
      toast.success('Thumbnail uploaded!')
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Upload failed')
  } finally {
    setUploading(false)
    e.target.value = ''
  }
}

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      isEdit
        ? api.put(`/admin/posts/${id}`, payload)
        : api.post('/admin/posts', payload),
    onSuccess: () => {
      toast.success(isEdit ? 'Post updated!' : 'Post created!')
      qc.invalidateQueries(['admin-posts'])
      qc.invalidateQueries(['admin-post', id])
      navigate('/admin/posts')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Save failed')
  })

  const handleSave = (status = form.status) => {
    const payload = {
      ...form,
      status,
      tags: typeof form.tags === 'string'
        ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
        : form.tags,
      readTime: calcReadTime(form.content)
    }
    saveMutation.mutate(payload)
  }

  const ToolbarBtn = ({ onClick, active, title, children }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
        active ? 'bg-brand-100 text-brand-700' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )

  if (isEdit && postLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-12 bg-gray-100 rounded" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? `Edit: ${form.title || '...'}` : 'New Post'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave('draft')}
            disabled={saveMutation.isPending}
            className="btn-outline rounded-xl px-4 py-2 text-sm"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saveMutation.isPending}
            className="btn-primary rounded-xl px-4 py-2 text-sm"
          >
            {saveMutation.isPending ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            value={form.title}
            onChange={handleTitleChange}
            placeholder="Post title..."
            className="w-full text-2xl font-bold border-0 border-b-2 border-gray-200 focus:border-brand-400 px-0 py-3 focus:outline-none bg-transparent"
          />

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Slug:</span>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
          </div>

          <div className="flex gap-1 border-b border-gray-100">
            {['content', 'excerpt', 'seo', 'affiliate'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'content' && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {editor && (
                <div className="flex flex-wrap gap-1 p-3 border-b border-gray-100 bg-gray-50">
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                    <strong>B</strong>
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                    <em>I</em>
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
                    <span className="underline">U</span>
                  </ToolbarBtn>
                  <div className="w-px bg-gray-200 mx-1" />
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
                    H2
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
                    H3
                  </ToolbarBtn>
                  <div className="w-px bg-gray-200 mx-1" />
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
                    • List
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">
                    1. List
                  </ToolbarBtn>
                  <div className="w-px bg-gray-200 mx-1" />
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
                    ❝
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
                    {'</>'}
                  </ToolbarBtn>
                  <div className="w-px bg-gray-200 mx-1" />
                  <ToolbarBtn
                    onClick={() => {
                      const url = prompt('Enter URL:')
                      if (url) editor.chain().focus().setLink({ href: url }).run()
                    }}
                    active={editor.isActive('link')}
                    title="Add Link"
                  >
                    🔗
                  </ToolbarBtn>
                  <ToolbarBtn
                    onClick={() => {
                      const url = prompt('Image URL:')
                      if (url) editor.chain().focus().setImage({ src: url }).run()
                    }}
                    title="Insert Image"
                  >
                    🖼️
                  </ToolbarBtn>
                  <div className="w-px bg-gray-200 mx-1" />
                  <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
                    ≡
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Center">
                    ≡
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">↩</ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">↪</ToolbarBtn>
                </div>
              )}
              <div className="min-h-[400px]">
                <EditorContent editor={editor} className="prose prose-gray max-w-none p-4" />
              </div>
              {form.readTime > 0 && (
                <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 bg-gray-50">
                  Estimated read time: {form.readTime} min
                </div>
              )}
            </div>
          )}

          {activeTab === 'excerpt' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt <span className="text-gray-400 font-normal">(max 300 chars)</span>
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={4}
                maxLength={300}
                placeholder="Brief description shown in post cards and search results..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.excerpt.length}/300</p>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-gray-900">SEO Settings</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Meta Title <span className="text-gray-400 font-normal">(max 60 chars)</span>
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={form.metaTitle}
                  onChange={handleChange}
                  maxLength={60}
                  placeholder="SEO title..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
                <div className={`text-xs mt-1 text-right ${form.metaTitle.length > 55 ? 'text-red-400' : 'text-gray-400'}`}>
                  {form.metaTitle.length}/60
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Meta Description <span className="text-gray-400 font-normal">(max 160 chars)</span>
                </label>
                <textarea
                  name="metaDescription"
                  value={form.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  maxLength={160}
                  placeholder="SEO description..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                />
                <div className={`text-xs mt-1 text-right ${form.metaDescription.length > 150 ? 'text-red-400' : 'text-gray-400'}`}>
                  {form.metaDescription.length}/160
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Focus Keyword</label>
                <input
                  type="text"
                  name="focusKeyword"
                  value={form.focusKeyword}
                  onChange={handleChange}
                  placeholder="e.g. best index funds 2024"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
              {(form.metaTitle || form.title) && (
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Google Preview</p>
                  <p className="text-blue-600 text-base font-medium leading-tight">
                    {form.metaTitle || form.title}
                  </p>
                  <p className="text-green-700 text-xs mt-0.5">
                    {import.meta.env.VITE_SITE_URL}/post/{form.slug}
                  </p>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                    {form.metaDescription || form.excerpt || 'No description set.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'affiliate' && (
            <AffiliateCardsEditor
              cards={form.affiliateCards}
              onChange={(cards) => setForm(f => ({ ...f, affiliateCards: cards }))}
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-gray-900">Publish</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            {form.status === 'scheduled' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Schedule Date</label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={form.scheduledAt || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isFeatured" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-brand-500" />
              <label htmlFor="isFeatured" className="text-sm text-gray-700">Feature on homepage</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="allowComments" name="allowComments" checked={form.allowComments} onChange={handleChange} className="w-4 h-4 accent-brand-500" />
              <label htmlFor="allowComments" className="text-sm text-gray-700">Allow comments</label>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="investing, etf, beginner"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Thumbnail</h3>
            {form.thumbnail && (
              <div className="mb-3 rounded-xl overflow-hidden aspect-[16/9] bg-gray-100">
                <img src={form.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-700 file:text-sm file:font-medium hover:file:bg-brand-100 cursor-pointer"
            />
            {uploading && <p className="text-xs text-brand-600 mt-2">Uploading...</p>}
            <div className="mt-2">
              <input
                type="url"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                placeholder="Or paste image URL"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AffiliateCardsEditor({ cards, onChange }) {
  const addCard = () => onChange([...cards, { productName: '', productImage: '', amazonUrl: '', price: '', badge: '' }])
  const removeCard = (i) => onChange(cards.filter((_, idx) => idx !== i))
  const updateCard = (i, field, value) => {
    const updated = [...cards]
    updated[i] = { ...updated[i], [field]: value }
    onChange(updated)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Amazon Affiliate Cards</h3>
        <button type="button" onClick={addCard} className="btn-primary rounded-lg px-3 py-1.5 text-xs">
          + Add Card
        </button>
      </div>
      {cards.length === 0 && (
        <p className="text-sm text-gray-400">No affiliate cards. Add one to embed product recommendations in this post.</p>
      )}
      {cards.map((card, i) => (
        <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-700">Card {i + 1}</p>
            <button type="button" onClick={() => removeCard(i)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
          </div>
          {[
            { field: 'productName',  label: 'Product Name', placeholder: 'The Total Money Makeover' },
            { field: 'amazonUrl',    label: 'Amazon URL',   placeholder: 'https://amazon.com/dp/...' },
            { field: 'productImage', label: 'Image URL',    placeholder: 'https://...' },
            { field: 'price',        label: 'Price',        placeholder: '$14.99' },
            { field: 'badge',        label: 'Badge',        placeholder: 'Best Seller' }
          ].map(({ field, label, placeholder }) => (
            <div key={field}>
              <label className="block text-xs text-gray-500 mb-1">{label}</label>
              <input
                type="text"
                value={card[field]}
                onChange={(e) => updateCard(i, field, e.target.value)}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}