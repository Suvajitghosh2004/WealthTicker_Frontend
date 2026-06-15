import { useQuery } from '@tanstack/react-query'
import api from '../services/api.js'

export const usePosts = ({ page = 1, limit = 12 } = {}) => {
  return useQuery({
    queryKey: ['posts', page, limit],
    queryFn: () => api.get(`/posts?page=${page}&limit=${limit}`).then(r => r.data)
  })
}

export const usePost = (slug) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => api.get(`/posts/${slug}`).then(r => r.data),
    enabled: !!slug
  })
}

export const useFeaturedPosts = () => {
  return useQuery({
    queryKey: ['featured'],
    queryFn: () => api.get('/posts/featured').then(r => r.data)
  })
}

export const useTrendingPosts = () => {
  return useQuery({
    queryKey: ['trending'],
    queryFn: () => api.get('/posts/trending').then(r => r.data)
  })
}
