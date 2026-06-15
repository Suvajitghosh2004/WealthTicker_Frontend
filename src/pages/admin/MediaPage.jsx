import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api.js'
import Spinner from '../../components/ui/Spinner.jsx'
import toast from 'react-hot-toast'

export default function MediaPage() {
  const [uploading, setUploading] = useState(false)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => api.get('/admin/media').then(r => r.data)
  })

  const deleteMutation = useMutation({
    mutationFn: (public_id) => api.delete('/admin/media/1', { data: { public_id } }),
    onSuccess: () => {
      toast.success('Image deleted')
      qc.invalidateQueries(['media'])
    },
    onError: () => toast.error('Delete failed')
  })

  const handleUpload = async (e) => {
  const files = Array.from(e.target.files)
  if (!files.length) return

  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const invalid = files.filter(f => !allowed.includes(f.type))
  if (invalid.length) {
    toast.error('Only JPG, PNG and WebP images allowed')
    return
  }

  setUploading(true)
  let successCount = 0

  for (const file of files) {
    try {
      const fd = new FormData()
      fd.append('image', file)
      await api.post('/admin/media/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      })
      successCount++
    } catch (err) {
      toast.error(`Failed: ${file.name} — ${err.response?.data?.message || 'Upload error'}`)
    }
  }

  if (successCount > 0) {
    toast.success(`Uploaded ${successCount} image${successCount > 1 ? 's' : ''}`)
    qc.invalidateQueries(['media'])
  }

  setUploading(false)
  e.target.value = ''
}

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied!')
  }

  const media = data?.media || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">{media.length} images</p>
        </div>
        <label className="btn-primary rounded-xl px-5 py-2.5 text-sm cursor-pointer">
          {uploading ? 'Uploading...' : '+ Upload Images'}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : media.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-gray-500 font-medium">No images yet</p>
          <p className="text-sm text-gray-400 mt-1">Upload images to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((img) => (
            <div key={img.public_id} className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="aspect-square">
                <img
                  src={img.secure_url}
                  alt={img.public_id}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <button
                  onClick={() => handleCopy(img.secure_url)}
                  className="w-full text-xs bg-white text-gray-900 rounded-lg py-1.5 font-medium hover:bg-gray-100 transition-colors"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this image from Cloudinary?')) {
                      deleteMutation.mutate(img.public_id)
                    }
                  }}
                  className="w-full text-xs bg-red-500 text-white rounded-lg py-1.5 font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
              {/* Filename */}
              <div className="p-2 border-t border-gray-50">
                <p className="text-xs text-gray-400 truncate">
                  {img.public_id.split('/').pop()}
                </p>
                <p className="text-xs text-gray-300">
                  {img.width}×{img.height}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
