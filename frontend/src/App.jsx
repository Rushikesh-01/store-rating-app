import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminStoresPage from './pages/admin/AdminStoresPage';
import StoreListingPage from './pages/user/StoreListingPage';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import { NotFoundPage, RootRedirect } from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/admin/dashboard" element={<RoleRoute roles={['ADMIN']}><AdminDashboard /></RoleRoute>} />
          <Route path="/admin/users" element={<RoleRoute roles={['ADMIN']}><AdminUsersPage /></RoleRoute>} />
          <Route path="/admin/stores" element={<RoleRoute roles={['ADMIN']}><AdminStoresPage /></RoleRoute>} />
          <Route path="/stores" element={<RoleRoute roles={['USER']}><StoreListingPage /></RoleRoute>} />
          <Route path="/owner/dashboard" element={<RoleRoute roles={['STORE_OWNER']}><OwnerDashboard /></RoleRoute>} />
          <Route path="/update-password" element={<ProtectedRoute><UpdatePasswordPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
