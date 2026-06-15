import { useQuery } from '@tanstack/react-query'
import api from '../../services/api.js'
import CommentItem from './CommentItem.jsx'
import Spinner from '../ui/Spinner.jsx'

export default function CommentList({ postId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => api.get(`/comments/${postId}`).then(r => r.data)
  })

  const comments = data?.comments || []

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        {isLoading ? 'Comments' : `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`}
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm py-4">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  )
}
