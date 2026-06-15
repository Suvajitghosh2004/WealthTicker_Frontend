import { useQuery } from '@tanstack/react-query'
import api from '../services/api.js'

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
    staleTime: 10 * 60 * 1000
  })
}

export const useCategory = (slug) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => api.get(`/categories/${slug}`).then(r => r.data),
    enabled: !!slug
  })
}
