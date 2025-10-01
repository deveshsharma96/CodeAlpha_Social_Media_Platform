import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import { UserPlus } from 'lucide-react'

const UserSuggestions: React.FC = () => {
  const { users, currentUser, followUser } = useAuth()

  // Filter out current user and already followed users
  const suggestedUsers = users.filter(
    user => user.id !== currentUser?.id && !currentUser?.following.includes(user.id)
  ).slice(0, 4)

  if (suggestedUsers.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <UserPlus className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-white">Suggested for you</h3>
      </div>

      <div className="space-y-4">
        {suggestedUsers.map(user => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Link to={`/profile/${user.id}`} className="flex-shrink-0">
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/profile/${user.id}`}
                  className="font-medium text-white hover:text-blue-400 transition-colors block truncate"
                >
                  {user.fullName}
                </Link>
                <p className="text-sm text-gray-400 truncate">@{user.username}</p>
                <p className="text-xs text-gray-500">{user.followers.length} followers</p>
              </div>
            </div>
            <button
              onClick={() => followUser(user.id)}
              className="px-4 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              Follow
            </button>
          </div>
        ))}
      </div>

      <Link
        to="/discover"
        className="block w-full mt-4 text-blue-400 text-sm font-medium hover:text-blue-500 transition-colors text-center"
      >
        See all suggestions
      </Link>
    </div>
  )
}

export default UserSuggestions
