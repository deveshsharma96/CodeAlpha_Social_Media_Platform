import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../App'
import { Edit3, Calendar, MessageCircleDashed as MessageCircle, Camera } from 'lucide-react'
import PostCard from '../components/PostCard'
import { formatDistanceToNow } from 'date-fns'

const ProfilePage: React.FC = () => {
  const { userId } = useParams()
  const { users, posts, currentUser, updateProfile, followUser, unfollowUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'posts' | 'followers' | 'following'>('posts')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ fullName: '', bio: '', avatar: '' })

  const profileUser = userId ? users.find(u => u.id === userId) : currentUser
  const isOwnProfile = !userId || userId === currentUser?.id

  // Apply dark background to the entire body
  useEffect(() => {
    document.body.style.backgroundColor = '#1F2937' // Tailwind bg-gray-900
    return () => {
      document.body.style.backgroundColor = '' // cleanup on unmount
    }
  }, [])

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <h2 className="text-2xl font-bold text-white">User not found</h2>
      </div>
    )
  }

  const userPosts = posts.filter(post => post.userId === profileUser.id)
  const followers = users.filter(user => profileUser.followers.includes(user.id))
  const following = users.filter(user => profileUser.following.includes(user.id))
  const isFollowing = currentUser?.following.includes(profileUser.id) || false

  const handleEditProfile = () => {
    setEditForm({
      fullName: profileUser.fullName,
      bio: profileUser.bio,
      avatar: profileUser.avatar
    })
    setIsEditing(true)
  }

  const handleSaveProfile = () => {
    updateProfile(editForm)
    setIsEditing(false)
  }

  const handleFollow = () => {
    if (isFollowing) unfollowUser(profileUser.id)
    else followUser(profileUser.id)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = event => {
        const result = event.target?.result as string
        setEditForm(prev => ({ ...prev, avatar: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
  <div className="min-h-screen w-full bg-gray-900 text-white px-4 py-8">
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Your profile header and content cards */}
    
        <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              {isEditing ? (
                <div className="relative">
                  <img src={editForm.avatar} alt={profileUser.fullName} className="w-24 h-24 rounded-full object-cover" />
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>
              ) : (
                <img src={profileUser.avatar} alt={profileUser.fullName} className="w-24 h-24 rounded-full object-cover" />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={e => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="text-2xl font-bold border-b border-gray-600 focus:border-blue-500 outline-none bg-transparent text-white"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full p-2 border border-gray-600 rounded-lg focus:border-blue-500 outline-none resize-none bg-gray-700 text-white"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{profileUser.fullName}</h1>
                  <p className="text-gray-400">@{profileUser.username}</p>
                  <p className="text-gray-300 mt-2">{profileUser.bio}</p>
                </>
              )}

              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDistanceToNow(new Date(profileUser.createdAt))} ago</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 mt-4">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`text-sm ${activeTab === 'posts' ? 'text-blue-400 font-semibold' : 'text-gray-400'}`}
                >
                  <span className="font-bold">{userPosts.length}</span> Posts
                </button>
                <button
                  onClick={() => setActiveTab('followers')}
                  className={`text-sm ${activeTab === 'followers' ? 'text-blue-400 font-semibold' : 'text-gray-400'}`}
                >
                  <span className="font-bold">{profileUser.followers.length}</span> Followers
                </button>
                <button
                  onClick={() => setActiveTab('following')}
                  className={`text-sm ${activeTab === 'following' ? 'text-blue-400 font-semibold' : 'text-gray-400'}`}
                >
                  <span className="font-bold">{profileUser.following.length}</span> Following
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {isOwnProfile ? (
                isEditing ? (
                  <>
                    <button onClick={handleSaveProfile} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )
              ) : (
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isFollowing ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="space-y-6">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {userPosts.length === 0 ? (
                <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <MessageCircle className="mx-auto w-16 h-16" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No posts yet</h3>
                  <p className="text-gray-300">{isOwnProfile ? 'Share your first post!' : `${profileUser.fullName} hasn't posted anything yet.`}</p>
                </div>
              ) : (
                userPosts.map(post => <PostCard key={post.id} post={post} />)
              )}
            </div>
          )}
          {/* Followers Tab */}
          {activeTab === 'followers' && (
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Followers</h3>
              {followers.length === 0 ? (
                <p className="text-gray-400">No followers yet.</p>
              ) : (
                <div className="space-y-3">
                  {followers.map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-white">{user.fullName}</p>
                          <p className="text-sm text-gray-400">@{user.username}</p>
                        </div>
                      </div>
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => (currentUser?.following.includes(user.id) ? unfollowUser(user.id) : followUser(user.id))}
                          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                            currentUser?.following.includes(user.id) ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {currentUser?.following.includes(user.id) ? 'Unfollow' : 'Follow'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Following Tab */}
          {activeTab === 'following' && (
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Following</h3>
              {following.length === 0 ? (
                <p className="text-gray-400">Not following anyone yet.</p>
              ) : (
                <div className="space-y-3">
                  {following.map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-white">{user.fullName}</p>
                          <p className="text-sm text-gray-400">@{user.username}</p>
                        </div>
                      </div>
                      {isOwnProfile && (
                        <button onClick={() => unfollowUser(user.id)} className="px-4 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
                          Unfollow
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
