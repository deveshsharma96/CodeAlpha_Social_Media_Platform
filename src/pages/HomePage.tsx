import React, { useState } from 'react'
import { useAuth } from '../App'
import PostCard from '../components/PostCard'
import CreatePost from '../components/CreatePost'
import UserSuggestions from '../components/UserSuggestions'





const HomePage: React.FC = () => {
  const { posts, currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'feed' | 'following'>('feed')

  // Filter posts based on active tab
  const filteredPosts = activeTab === 'following'
    ? posts.filter(post => currentUser?.following.includes(post.userId) || post.userId === currentUser?.id)
    : posts

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 flex">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'feed'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'following'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Following
            </button>
          </div>

          {/* Create Post */}
          <CreatePost />

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
                <div className="text-gray-500 mb-4">
                  <svg className="mx-auto w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No posts yet</h3>
                <p className="text-gray-400">
                  {activeTab === 'following'
                    ? "Follow some users to see their posts here!"
                    : "Be the first to share something amazing!"
                  }
                </p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <UserSuggestions />

          {/* Quick Stats */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Your Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Posts</span>
                <span className="font-semibold">{posts.filter(p => p.userId === currentUser?.id).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Following</span>
                <span className="font-semibold">{currentUser?.following.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Followers</span>
                <span className="font-semibold">{currentUser?.followers.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HomePage


