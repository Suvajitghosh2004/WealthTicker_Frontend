import { timeAgo } from '../../utils/formatDate.js'

export default function CommentItem({ comment }) {
  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
        {comment.name?.[0]?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-900 text-sm">{comment.name}</span>
          <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{comment.body}</p>
      </div>
    </div>
  )
}
