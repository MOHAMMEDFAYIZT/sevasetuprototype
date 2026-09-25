import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Direct Full-Screen Onboarding & Auth Pages (Exact matches to reference designs)
import { SplashIntroPage } from './pages/SplashIntroPage';
import { LoginPage } from './pages/LoginPage';
import { OtpPage } from './pages/OtpPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';

// Responsive Core Website Pages (With standard Header, Footer, Breadcrumbs, Modals)
import { HomePage } from './pages/HomePage';
import { WorkersListPage } from './pages/WorkersListPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { MyJobsPage } from './pages/MyJobsPage';
import { FavouritesPage } from './pages/FavouritesPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Standalone Visual Onboarding / Auth Routes */}
          <Route path="/splash" element={<SplashIntroPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<OtpPage />} />
          <Route path="/setup-profile" element={<ProfileSetupPage />} />

          {/* Standard Responsive Website Layout Routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-job" element={<Navigate to="/" replace />} />
            <Route path="/workers" element={<WorkersListPage />} />
            <Route path="/jobs" element={<MyJobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/favourites" element={<FavouritesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
