import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { useAppStore } from './store/useAppStore';
import Home from './pages/Home';
import AddEntry from './pages/AddEntry';
import CalendarPage from './pages/CalendarPage';
import Reports from './pages/Reports';
import SettingsPage from './pages/SettingsPage';

function App() {
  const { theme } = useAppStore((state) => state.settings);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('dir', 'rtl');

    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle system theme change listener
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      if (e.matches) root.classList.add('dark');
      else root.classList.remove('dark');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/add" element={<AddEntry />} />
          <Route path="/edit/:id" element={<AddEntry />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
