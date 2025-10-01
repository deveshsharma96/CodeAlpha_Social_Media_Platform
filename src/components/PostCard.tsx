import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircleDashed as MessageCircle, Share2, MoreHorizontal, Trash2 } from 'lucide-react'
import { useAuth, Post } from '../App'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: Post
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { users, currentUser, likePost, addComment, deletePost, deleteComment } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [showMenu, setShowMenu] = useState(false)

  const postUser = users.find(u => u.id === post.userId)
  const isLiked = post.likes.includes(currentUser?.id || '')
  const isOwnPost = post.userId === currentUser?.id

  if (!postUser) return null

  const handleLike = () => likePost(post.id)
  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      addComment(post.id, newComment.trim())
      setNewComment('')
    }
  }
  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) deletePost(post.id)
  }
  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) deleteComment(post.id, commentId)
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${postUser.id}`} className="flex-shrink-0">
            <img
              src={postUser.avatar}
              alt={postUser.fullName}
              className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
            />
          </Link>
          <div>
            <Link 
              to={`/profile/${postUser.id}`}
              className="font-semibold text-white hover:text-blue-400 transition-colors"
            >
              {postUser.fullName}
            </Link>
            <p className="text-sm text-gray-400">
              @{postUser.username} • {formatDistanceToNow(new Date(post.createdAt))} ago
            </p>
          </div>
        </div>

        {isOwnPost && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                <button
                  onClick={handleDeletePost}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-700 hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-200 leading-relaxed">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="px-4 pb-3">
          <img
            src={post.image}
            alt="Post content"
            className="w-full rounded-lg object-cover max-h-96"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{post.likes.length}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments.length}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-700">
          {post.comments.map(comment => {
            const commentUser = users.find(u => u.id === comment.userId)
            if (!commentUser) return null
            const isOwnComment = comment.userId === currentUser?.id

            return (
              <div key={comment.id} className="px-4 py-3 border-b border-gray-700 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <Link to={`/profile/${commentUser.id}`} className="flex-shrink-0">
                    <img
                      src={commentUser.avatar}
                      alt={commentUser.fullName}
                      className="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/profile/${commentUser.id}`}
                          className="font-medium text-white hover:text-blue-400 transition-colors"
                        >
                          {commentUser.fullName}
                        </Link>
                        <span className="text-sm text-gray-400">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                      </div>
                      {isOwnComment && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-300 mt-1">{comment.content}</p>
                  </div>
                </div>
              </div>
            )
          })}

          <form onSubmit={handleComment} className="px-4 py-3 bg-gray-700 rounded-b-lg">
            <div className="flex items-center space-x-3">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.fullName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default PostCard
