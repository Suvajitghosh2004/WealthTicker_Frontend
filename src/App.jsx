import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/layout/Layout.jsx'
import PublicRoutes from './routes/PublicRoutes.jsx'
import AdminRoutes from './routes/AdminRoutes.jsx'

// Public pages
import HomePage from './pages/public/HomePage.jsx'
import PostPage from './pages/public/PostPage.jsx'
import CategoryPage from './pages/public/CategoryPage.jsx'
import SearchPage from './pages/public/SearchPage.jsx'
import AboutPage from './pages/public/AboutPage.jsx'
import PrivacyPage from './pages/public/PrivacyPage.jsx'
import ContactPage from './pages/public/ContactPage.jsx'
import NotFoundPage from './pages/public/NotFoundPage.jsx'

// Admin pages
import LoginPage from './pages/admin/LoginPage.jsx'
import DashboardPage from './pages/admin/DashboardPage.jsx'
import PostsPage from './pages/admin/PostsPage.jsx'
import PostEditorPage from './pages/admin/PostEditorPage.jsx'
import CategoriesPage from './pages/admin/CategoriesPage.jsx'
import CommentsPage from './pages/admin/CommentsPage.jsx'
import NewsletterPage from './pages/admin/NewsletterPage.jsx'
import MediaPage from './pages/admin/MediaPage.jsx'

export default function App() {
  return (
    <>
      <Routes>
        {/* Public layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Admin auth */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected admin routes */}
        <Route path="/admin" element={<AdminRoutes />}>
          <Route index element={<DashboardPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="posts/new" element={<PostEditorPage />} />
          <Route path="posts/edit/:id" element={<PostEditorPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="comments" element={<CommentsPage />} />
          <Route path="newsletter" element={<NewsletterPage />} />
          <Route path="media" element={<MediaPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Analytics />
    </>
  )
}
