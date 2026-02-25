import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { RoutesPage } from './pages/Routes';
import { Attendance } from './pages/Attendance';
import { Communication } from './pages/Communication';
import { Reports } from './pages/Reports';
import { Incidents } from './pages/Incidents';

export default function App() {
  return (
    <AppProvider>
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
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
