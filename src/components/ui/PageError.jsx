import { useNavigate } from 'react-router-dom'

const MESSAGES = {
  404: { icon: '🔍', title: 'Not Found', body: 'This content doesn\'t exist or was removed.' },
  401: { icon: '🔐', title: 'Unauthorized', body: 'You need to be logged in to view this.' },
  403: { icon: '🚫', title: 'Forbidden',   body: 'You don\'t have permission to view this.' },
  500: { icon: '💥', title: 'Server Error', body: 'Something went wrong on our end. Please try again.' },
}

export default function PageError({ status = 500, message, onRetry }) {
  const navigate = useNavigate()
  const info = MESSAGES[status] || MESSAGES[500]

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <p className="text-5xl mb-4">{info.icon}</p>
      <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">
        Error {status}
      </p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h2>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        {message || info.body}
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        {onRetry && (
          <button onClick={onRetry} className="btn-primary rounded-xl px-6 py-2.5 text-sm">
            Try Again
          </button>
        )}
        <button onClick={() => navigate(-1)} className="btn-outline rounded-xl px-6 py-2.5 text-sm">
          Go Back
        </button>
        <button onClick={() => navigate('/')} className="btn-outline rounded-xl px-6 py-2.5 text-sm">
          Home
        </button>
      </div>
    </div>
  )
}