'use client';

import { useEffect, useState } from 'react';
import { useServiceStore } from '../store/services';
import { mockApi } from '../lib/mockAPI';
import Header from '../components/Header';
import StatusSummary from '../components/StatusSummary';
import Filters from '../components/Filters';
import ServiceTable from '../components/ServiceTable';
import ServiceFormModal from '../components/ServiceFormModal';
import { RefreshCw } from 'lucide-react';
import ServiceDetailModal from '../components/ServiceDetailModal';

const POLL_INTERVAL = 15000;

export default function App() {
  const {
    services,
    filters,
    isLoading,
    error,
    setLoading,
    setError,
    setFilters,
    setServices,
    addService,
    updateServiceInList,
    deleteService,
    serviceDetail,
    setServiceDetail
  } = useServiceStore();

  const [searchInput, setSearchInput] = useState(filters.name);
  const [formModal, setFormModal] = useState({ open: false, mode: 'create', service: null });
  const [showFilters, setShowFilters] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, total } = await mockApi.fetchServices(filters);
      setServices(data, total);
    } catch (err) {
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const pollStatus = async () => {
    try {
      const { data } = await mockApi.fetchServices(filters);
      data.forEach(updateServiceInList);
    } catch (err) {
      console.warn('Polling failed:', err.message);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [filters]);

  useEffect(() => {
    const interval = setInterval(pollStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onFocus = () => fetchServices();
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') onFocus();
    });
    return () => window.removeEventListener('visibilitychange', onFocus);
  }, []);

  const handleDelete = async (id) => {
    const backup = services.find((s) => s.id === id);
    deleteService(id);

    try {
      await mockApi.deleteService(id);
    } catch (err) {
      setError('Delete failed. Reverting.');
      if (backup) {
        if (filters.page === 1) {
          addService(backup);
        }
        useServiceStore.setState((state) => ({
          totalServices: state.totalServices + 1,
        }));
      }
    }
  };

  const handleSearch = () => {
    setFilters({ name: searchInput, page: 1 });
  };

  const getStatusSummary = () => {
    const online = services.filter((s) => s.status === 'Online').length;
    const offline = services.filter((s) => s.status === 'Offline').length;
    const degraded = services.filter((s) => s.status === 'Degraded').length;
    return { online, offline, degraded, total: services.length };
  };

  const summary = getStatusSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-950 to-slate-900 text-gray-100">
      <Header setShowFilters={setShowFilters} setFormModal={setFormModal} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 rounded-2xl p-6 shadow-2xl backdrop-blur-md border border-white/10">
          <StatusSummary summary={summary} />

          <Filters
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
          />

          {isLoading && (
            <div className="flex items-center justify-center py-12 text-gray-600">
              <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="ml-2 text-sm">Loading services...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-800 text-center py-4 rounded-lg shadow-inner mt-4">
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <div className="mt-4">
              <ServiceTable
                services={services}
                handleDelete={handleDelete}
                onEdit={(service) => setFormModal({ open: true, mode: 'edit', service })}
                onClickService={(service) => setServiceDetail(service)} 
              />

            </div>
          )}
        </div>
      </main>

      {formModal.open && (
        <ServiceFormModal
          mode={formModal.mode}
          initial={formModal.service}
          onClose={() => setFormModal({ open: false, mode: 'create', service: null })}
        />
      )}

      {serviceDetail && (
        <ServiceDetailModal onClose={() => setServiceDetail(null)} />
      )}
    </div>
  );
}
