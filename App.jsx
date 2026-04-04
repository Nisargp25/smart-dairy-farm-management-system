import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts and Professional SaaS Pages
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Animals from './pages/Animals';
import MilkProduction from './pages/MilkProduction';
import Vaccinations from './pages/Vaccinations';
import FeedManagement from './pages/FeedManagement';
import Workers from './pages/Workers';
import Financial from './pages/Financial';
import Reports from './pages/Reports';
import Shop from './pages/Shop';
import Orders from './pages/Orders';
import Subscriptions from './pages/Subscriptions';
import Billing from './pages/Billing';
import AnimalProfile from './pages/AnimalProfile';

// Global Design System
import './index.css';

// Professional Auth Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Authenticating Session...</p>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={isManagement(user.role) ? '/owner' : '/user'} />;
  }
  return children;
};

const isManagement = (role) => ['admin', 'farmer', 'worker'].includes(role);

const getHomePath = (user) => {
  if (!user) return '/login';
  return isManagement(user.role) ? '/owner' : '/user';
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getHomePath(user)} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Owner & Management Console */}
      <Route path="/owner" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['admin', 'farmer', 'worker']}>
            <DashboardLayout />
          </RoleRoute>
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="animals" element={<Animals />} />
        <Route path="animals/:id" element={<AnimalProfile />} />
        <Route path="milk" element={<MilkProduction />} />
        <Route path="vaccinations" element={<Vaccinations />} />
        <Route path="feed" element={<FeedManagement />} />
        <Route path="workers" element={<Workers />} />
        <Route path="financial" element={<Financial />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Consumer Client routes */}
      <Route path="/user" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['customer']}>
            <DashboardLayout />
          </RoleRoute>
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="shop" element={<Shop />} />
        <Route path="orders" element={<Orders />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="billing" element={<Billing />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
