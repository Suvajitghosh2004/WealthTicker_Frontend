import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  return format(parseISO(date), 'MMMM d, yyyy')
}

export const formatDateShort = (date) => {
  if (!date) return ''
  return format(parseISO(date), 'MMM d, yyyy')
}

export const timeAgo = (date) => {
  if (!date) return ''
  return formatDistanceToNow(parseISO(date), { addSuffix: true })
}
