import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DashboardStats } from '../types';
// Removed: import { getDashboardStats } from '../services/dashboardService';

interface AppContextType {
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refreshDashboard: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder fetch function (replace with real logic if needed)
  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // You can compute dashboardStats here using other services if needed
      setDashboardStats(null); // Or set to a computed value
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <AppContext.Provider value={{
      dashboardStats,
      loading,
      error,
      refreshDashboard: fetchDashboardStats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};