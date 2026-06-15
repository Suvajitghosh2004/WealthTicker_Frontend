export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null

  const items = []
  const delta = 2

  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
      items.push(i)
    } else if (i === page - delta - 1 || i === page + delta + 1) {
      items.push('...')
    }
  }

  // Dedupe consecutive '...'
  const deduped = items.filter((v, i) => !(v === '...' && items[i - 1] === '...'))

  return (
    <nav className="flex items-center justify-center gap-1 mt-10" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn btn-outline px-3 py-2 text-sm disabled:opacity-40"
      >
        ← Prev
      </button>

      {deduped.map((item, i) =>
        item === '...' ? (
          <span key={`ellipsis-${i}`} className="px-3 py-2 text-gray-400">…</span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              item === page
                ? 'bg-brand-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="btn btn-outline px-3 py-2 text-sm disabled:opacity-40"
      >
        Next →
      </button>
    </nav>
  )
}
