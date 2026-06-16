import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Toaster } from 'sonner'

// Pages
import Feed from '@/pages/Feed'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Chat from '@/pages/Chat'
import ChatList from '@/pages/ChatList'
import Collection from '@/pages/Collection'
import Explore from '@/pages/Explore'
import Profile from '@/pages/Profile'
import StickerForm from '@/pages/StickerForm'
import ForgotPassword from '@/pages/ForgotPassword'

// Layout
import AppLayout from '@/components/AppLayout'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* App Routes with Layout */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Feed />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/chat" element={<ChatList />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create" element={<StickerForm />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" theme="system" />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
