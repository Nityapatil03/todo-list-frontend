import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import { Register } from './pages/Register';
import { Login } from './pages/login';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { useAppSelector } from './store/hooks';
import type { RootState } from './store/store';

function App() {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  return (
    <>
      <Navbar />
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />




      </Routes>
    </>
  );
}

export default App
