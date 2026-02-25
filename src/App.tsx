import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { RoutesPage } from './pages/Routes';
import { Attendance } from './pages/Attendance';
import { Communication } from './pages/Communication';
import { Reports } from './pages/Reports';
import { Incidents } from './pages/Incidents';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

const AppRoutes = () => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Auth />;
  }

  if (!currentUser.role) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="communication" element={<Communication />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
