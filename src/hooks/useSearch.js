import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api.js'

export const useSearch = () => {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const result = useQuery({
    queryKey: ['search', query, page],
    queryFn: () =>
      api.get(`/posts/search?q=${encodeURIComponent(query)}&page=${page}`).then(r => r.data),
    enabled: query.length >= 2
  })

  const search = useCallback((q) => {
    setQuery(q)
    setPage(1)
  }, [])

  return {
    query,
    page,
    setPage,
    search,
    ...result
  }
}
