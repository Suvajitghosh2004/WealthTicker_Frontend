// Extract H2/H3 questions from post content for FAQ schema
export const extractFAQs = (html) => {
  if (!html) return []
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const headings = doc.querySelectorAll('h2, h3')
  const faqs = []

  headings.forEach((heading, i) => {
    const question = heading.textContent.trim()
    if (!question.endsWith('?')) return

    // Get the next paragraph as the answer
    let answer = ''
    let next = heading.nextElementSibling
    while (next && !['H2', 'H3'].includes(next.tagName)) {
      answer += next.textContent.trim() + ' '
      next = next.nextElementSibling
    }

    if (answer.trim()) {
      faqs.push({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer.trim().slice(0, 500)
        }
      })
    }
  })

  return faqs.slice(0, 5) // Max 5 FAQs
}