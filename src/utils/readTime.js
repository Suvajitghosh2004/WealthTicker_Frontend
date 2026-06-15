/**
 * Estimate reading time from HTML or plain text
 * @param {string} content - HTML or text content
 * @param {number} wpm - Words per minute (default 200)
 */
export const calcReadTime = (content, wpm = 200) => {
  if (!content) return 1
  const text = content.replace(/<[^>]*>/g, ' ')
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wpm))
}

export const formatReadTime = (minutes) => {
  return `${minutes} min read`
}
