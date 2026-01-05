import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { AdminLayout } from '../../components/admin/AdminLayout/AdminLayout';
import { AdminHeader } from '../../components/admin/AdminHeader/AdminHeader';
import { HallManagement } from '../../components/admin/HallManagement/HallManagement';
import { HallConfiguration } from '../../components/admin/HallConfiguration/HallConfiguration';
import { LoginForm } from '../../components/admin/LoginForm/LoginForm';
import { PriceConfiguration } from '../../components/admin/PriceConfiguration/PriceConfiguration';
import { ScheduleManagement } from '../../components/admin/ScheduleManagement/ScheduleManagement';
import { SalesControl } from '../../components/admin/SalesControl/SalesControl';

import { useAccordeon } from '../../hooks/useAccordeon';
import type { AdminHall, AdminMovie, AdminScreening } from '../../types/admin';
import { mapMovieFromBackend, mapScreeningFromBackend } from '../../types/admin';

import './AdminPage.css';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true;

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [halls, setHalls] = useState<AdminHall[]>([]);
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [screenings, setScreenings] = useState<AdminScreening[]>([]);
  const [salesOpen, setSalesOpen] = useState(false); // состояние продаж

  const { openSections, toggleSection } = useAccordeon({
    hallManagement: true,
    hallConfiguration: false,
    priceConfiguration: false,
    scheduleManagement: false,
    salesControl: false,
  });

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/me');
        setIsAuthenticated(res.data?.role === 'admin');
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Загрузка данных
  const loadHalls = async () => {
    try {
      const res = await axios.get('/api/halls');
      setHalls(res.data);
    } catch {
      alert('Не удалось загрузить список залов');
      setHalls([]);
    }
  };

  const loadMovies = async () => {
    try {
      const res = await axios.get('/api/movies');
      const movies = (res.data ?? []).map(mapMovieFromBackend);
      setMovies(movies);
    } catch {
      alert('Не удалось загрузить список фильмов');
      setMovies([]);
    }
  };

  const loadScreenings = async () => {
    try {
      const res = await axios.get('/api/screenings');
      const screenings = (res.data ?? []).map(mapScreeningFromBackend);
      setScreenings(screenings);
    } catch {
      alert('Не удалось загрузить список сеансов');
      setScreenings([]);
    }
  };

  const loadSalesState = async () => {
    try {
      const res = await axios.get('/api/sales');
      setSalesOpen(res.data.open ?? false);
    } catch {
      console.error('Не удалось загрузить состояние продаж');
      setSalesOpen(false);
    }
  };

  // Загрузка всех данных при логине
  useEffect(() => {
    if (!isAuthenticated) return;
    loadHalls();
    loadMovies();
    loadScreenings();
    loadSalesState();
  }, [isAuthenticated]);

  // Колбэк для SalesControl
  const handleSalesToggle = async (open: boolean) => {
    try {
      const res = await axios.post('/api/sales', { open });
      setSalesOpen(res.data.open ?? false);
    } catch (err) {
      alert('Ошибка при изменении состояния продаж');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="loading">Загрузка…</div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <AdminHeader />
        <LoginForm onLogin={async (email, password) => {
          try {
            await axios.get('/sanctum/csrf-cookie');
            const res = await axios.post('/api/login', { email, password });
            if (res.data?.role === 'admin') setIsAuthenticated(true);
            else setError('Неверный логин или пароль');
          } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка авторизации');
          }
        }} error={error} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader onLogout={async () => {
        await axios.post('/api/logout');
        setIsAuthenticated(false);
        setHalls([]);
        setMovies([]);
        setScreenings([]);
      }} />

      <main className="conf-steps">
        <HallManagement
          isOpen={openSections.hallManagement}
          onToggle={() => toggleSection('hallManagement')}
          halls={halls}
          onHallCreated={hall => setHalls(prev => [...prev, hall])}
          onHallDeleted={id => setHalls(prev => prev.filter(h => h.id !== id))}
        />

        <HallConfiguration
          isOpen={openSections.hallConfiguration}
          onToggle={() => toggleSection('hallConfiguration')}
          halls={halls}
          onConfigurationSaved={loadHalls}
        />

        <PriceConfiguration
          isOpen={openSections.priceConfiguration}
          onToggle={() => toggleSection('priceConfiguration')}
          halls={halls}
          onPricesSaved={loadHalls}
        />

        <ScheduleManagement
          isOpen={openSections.scheduleManagement}
          onToggle={() => toggleSection('scheduleManagement')}
          halls={halls}
          movies={movies}
          screenings={screenings}
          onMovieCreated={async movie => setMovies(prev => [...prev, movie])} // <-- добавляем
          onScreeningCreated={async screening => setScreenings(prev => [...prev, screening])}
          onMovieDeleted={async id => {
            setMovies(prev => prev.filter(m => m.id !== id));
            setScreenings(prev => prev.filter(s => s.movieId !== id));
          }}
          onScreeningDeleted={async id => setScreenings(prev => prev.filter(s => s.id !== id))}
        />


        <SalesControl
          isOpen={openSections.salesControl}
          onToggle={() => toggleSection('salesControl')}
          onSalesToggle={handleSalesToggle}
        />
      </main>
    </AdminLayout>
  );
};