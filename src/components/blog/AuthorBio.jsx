export default function AuthorBio({ author }) {
  if (!author) return null

  return (
    <div className="flex gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 mt-10">
      <div className="flex-shrink-0">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-white text-2xl font-bold">
            {author.name?.[0]?.toUpperCase()}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-1">Written by</p>
        <h4 className="font-bold text-gray-900 text-lg">{author.name}</h4>
        {author.bio && (
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{author.bio}</p>
        )}
      </div>
    </div>
  )
}
