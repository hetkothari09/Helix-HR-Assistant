import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { HRDashboard } from './components/hr/HRDashboard';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return user.role === 'hr' ? <HRDashboard /> : <EmployeeDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
