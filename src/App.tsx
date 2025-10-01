
import React, { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'

// Types
export interface User {
  id: string
  username: string
  email: string
  fullName: string
  avatar: string
  bio: string
  followers: string[]
  following: string[]
  createdAt: string
}

export interface Post {
  id: string
  userId: string
  content: string
  image?: string
  likes: string[]
  createdAt: string
  comments: Comment[]
}

export interface Comment {
  id: string
  postId: string
  userId: string
  content: string
  createdAt: string
}

// Auth Context
interface AuthContextType {
  currentUser: User | null
  users: User[]
  posts: Post[]
  login: (email: string, password: string) => boolean
  logout: () => void
  register: (userData: Omit<User, 'id' | 'followers' | 'following' | 'createdAt'>) => void
  updateProfile: (updates: Partial<User>) => void
  createPost: (content: string, image?: string) => void
  deletePost: (postId: string) => void
  likePost: (postId: string) => void
  addComment: (postId: string, content: string) => void
  deleteComment: (postId: string, commentId: string) => void
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  searchUsers: (query: string) => User[]
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

// Default unisex profile image
const DEFAULT_AVATAR = 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?w=150'

// Sample data with unisex profile images
const initialUsers: User[] = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    fullName: 'John Doe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
    bio: 'Love photography and travel ✈️📸',
    followers: ['2', '3'],
    following: ['2'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    username: 'sarahsmith',
    email: 'sarah@example.com',
    fullName: 'Sarah Smith',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150',
    bio: 'Designer & coffee enthusiast ☕',
    followers: ['1', '3'],
    following: ['1', '3'],
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    username: 'mikejohnson',
    email: 'mike@example.com',
    fullName: 'Mike Johnson',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=150',
    bio: 'Tech enthusiast & gamer 🎮',
    followers: ['1', '2'],
    following: ['1', '2'],
    createdAt: '2024-01-05'
  },
  {
    id: '4',
    username: 'emilydavis',
    email: 'emily@example.com',
    fullName: 'Emily Davis',
    avatar: DEFAULT_AVATAR,
    bio: 'Artist and nature lover 🎨🌿',
    followers: ['1'],
    following: ['2', '3'],
    createdAt: '2024-01-08'
  },
  {
    id: '5',
    username: 'alexchen',
    email: 'alex@example.com',
    fullName: 'Alex Chen',
    avatar: DEFAULT_AVATAR,
    bio: 'Fitness enthusiast and chef 💪🍳',
    followers: ['2', '3'],
    following: ['1'],
    createdAt: '2024-01-12'
  },
  {
    id: '6',
    username: 'jordantaylor',
    email: 'jordan@example.com',
    fullName: 'Jordan Taylor',
    avatar: DEFAULT_AVATAR,
    bio: 'Music producer and world traveler 🎵🌍',
    followers: [],
    following: ['1', '2'],
    createdAt: '2024-01-18'
  }
]

const initialPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    content: 'Just captured this amazing sunset! 🌅 Nature never fails to amaze me.',
    image: 'https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg?w=500',
    likes: ['2', '3'],
    createdAt: '2024-01-20T10:30:00Z',
    comments: [
      {
        id: '1',
        postId: '1',
        userId: '2',
        content: 'Absolutely stunning! Where was this taken?',
        createdAt: '2024-01-20T11:00:00Z'
      }
    ]
  },
  {
    id: '2',
    userId: '2',
    content: 'Working on a new design project. Love the creative process! 🎨',
    likes: ['1', '3'],
    createdAt: '2024-01-19T14:15:00Z',
    comments: []
  },
  {
    id: '3',
    userId: '3',
    content: 'Just finished an amazing gaming session. Anyone else playing the new RPG that came out?',
    likes: ['1'],
    createdAt: '2024-01-18T20:45:00Z',
    comments: [
      {
        id: '2',
        postId: '3',
        userId: '1',
        content: 'Yes! I\'m totally hooked. The storyline is incredible.',
        createdAt: '2024-01-18T21:00:00Z'
      }
    ]
  },
  {
    id: '4',
    userId: '4',
    content: 'Spent the day painting in the park. There\'s something magical about creating art surrounded by nature 🎨🌳',
    image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?w=500',
    likes: ['1', '2'],
    createdAt: '2024-01-17T16:20:00Z',
    comments: []
  },
  {
    id: '5',
    userId: '5',
    content: 'New recipe experiment: fusion tacos with Asian flavors! The combination of Korean BBQ and Mexican spices is incredible 🌮🔥',
    likes: ['2', '3', '4'],
    createdAt: '2024-01-16T19:30:00Z',
    comments: [
      {
        id: '3',
        postId: '5',
        userId: '2',
        content: 'This looks amazing! Would love the recipe!',
        createdAt: '2024-01-16T20:00:00Z'
      }
    ]
  }
]

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [posts, setPosts] = useState<Post[]>(initialPosts)

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email)
    if (user) {
      setCurrentUser(user)
      localStorage.setItem('currentUser', JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
  }

  const register = (userData: Omit<User, 'id' | 'followers' | 'following' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      avatar: userData.avatar || DEFAULT_AVATAR,
      followers: [],
      following: [],
      createdAt: new Date().toISOString()
    }
    setUsers(prev => [...prev, newUser])
    setCurrentUser(newUser)
    localStorage.setItem('currentUser', JSON.stringify(newUser))
  }

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return
    
    const updatedUser = { ...currentUser, ...updates }
    setCurrentUser(updatedUser)
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u))
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
  }

  const createPost = (content: string, image?: string) => {
    if (!currentUser) return
    
    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content,
      image,
      likes: [],
      createdAt: new Date().toISOString(),
      comments: []
    }
    setPosts(prev => [newPost, ...prev])
  }

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  const likePost = (postId: string) => {
    if (!currentUser) return
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(currentUser.id)
        return {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== currentUser.id)
            : [...post.likes, currentUser.id]
        }
      }
      return post
    }))
  }

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return
    
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      userId: currentUser.id,
      content,
      createdAt: new Date().toISOString()
    }
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ))
  }

  const deleteComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments.filter(c => c.id !== commentId) }
        : post
    ))
  }

  const followUser = (userId: string) => {
    if (!currentUser) return
    
    // Update current user's following list
    const updatedCurrentUser = {
      ...currentUser,
      following: [...currentUser.following, userId]
    }
    setCurrentUser(updatedCurrentUser)
    localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser))
    
    // Update users array
    setUsers(prev => prev.map(user => {
      if (user.id === currentUser.id) {
        return { ...user, following: [...user.following, userId] }
      }
      if (user.id === userId) {
        return { ...user, followers: [...user.followers, currentUser.id] }
      }
      return user
    }))
  }

  const unfollowUser = (userId: string) => {
    if (!currentUser) return
    
    // Update current user's following list
    const updatedCurrentUser = {
      ...currentUser,
      following: currentUser.following.filter(id => id !== userId)
    }
    setCurrentUser(updatedCurrentUser)
    localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser))
    
    // Update users array
    setUsers(prev => prev.map(user => {
      if (user.id === currentUser.id) {
        return { ...user, following: user.following.filter(id => id !== userId) }
      }
      if (user.id === userId) {
        return { ...user, followers: user.followers.filter(id => id !== currentUser.id) }
      }
      return user
    }))
  }

  const searchUsers = (query: string): User[] => {
    if (!query.trim()) return []
    
    const lowercaseQuery = query.toLowerCase()
    return users.filter(user => 
      user.fullName.toLowerCase().includes(lowercaseQuery) ||
      user.username.toLowerCase().includes(lowercaseQuery) ||
      user.bio.toLowerCase().includes(lowercaseQuery)
    )
  }

  const authValue: AuthContextType = {
    currentUser,
    users,
    posts,
    login,
    logout,
    register,
    updateProfile,
    createPost,
    deletePost,
    likePost,
    addComment,
    deleteComment,
    followUser,
    unfollowUser,
    searchUsers
  }

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {currentUser && <Header />}
          <Routes>
            <Route 
              path="/login" 
              element={currentUser ? <Navigate to="/" /> : <LoginPage />} 
            />
            <Route 
              path="/" 
              element={currentUser ? <HomePage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile/:userId?" 
              element={currentUser ? <ProfilePage /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
