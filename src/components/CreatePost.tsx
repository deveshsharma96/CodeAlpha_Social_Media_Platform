import React, { useState } from 'react'
import { Image, X } from 'lucide-react'
import { useAuth } from '../App'

const CreatePost: React.FC = () => {
  const { currentUser, createPost } = useAuth()
  const [content, setContent] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setSelectedImage(event.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() && !selectedImage) return

    setIsSubmitting(true)
    try {
      createPost(content.trim(), selectedImage || undefined)
      setContent('')
      setSelectedImage(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeImage = () => setSelectedImage(null)

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-white">{currentUser?.fullName}</p>
            <p className="text-sm text-gray-400">Share something with your followers</p>
          </div>
        </div>

        {/* Content Input */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm ${content.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
              {content.length}/500
            </span>
          </div>
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors">
              <Image className="w-5 h-5" />
              <span className="text-sm">Add Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={(!content.trim() && !selectedImage) || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost
