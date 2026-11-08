import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout'

// 组件懒加载
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WorksPage = lazy(() => import('./pages/WorksPage'));
const EditorPage = lazy(() => import('./pages/EditorPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
import LandingPage from './pages/LandingPage'
// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg text-muted-foreground">加载中...</div>
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes（工作台由 / 迁移至 /dashboard，原有保护逻辑不变） */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/works" element={
            <ProtectedRoute>
              <Layout>
                <WorksPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/editor" element={
            <ProtectedRoute>
              <Layout>
                <EditorPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
