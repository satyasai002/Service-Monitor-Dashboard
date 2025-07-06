import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Plus, Edit, Trash2, Activity, Database, Globe, Server, ChevronRight, RefreshCw, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';

// Mock API with simulated latency and errors
const mockAPI = {
  delay: () => new Promise(resolve => setTimeout(resolve, Math.random() * 700 + 300)),
  shouldFail: () => Math.random() < 0.05,
  
  services: [
    { id: 1, name: 'User Authentication API', type: 'API', status: 'Online', lastUpdated: Date.now() },
    { id: 2, name: 'Payment Gateway', type: 'API', status: 'Online', lastUpdated: Date.now() },
    { id: 3, name: 'User Database', type: 'Database', status: 'Degraded', lastUpdated: Date.now() },
    { id: 4, name: 'Analytics Service', type: 'Service', status: 'Offline', lastUpdated: Date.now() },
    { id: 5, name: 'Content Delivery Network', type: 'CDN', status: 'Online', lastUpdated: Date.now() },
    { id: 6, name: 'Email Service', type: 'Service', status: 'Online', lastUpdated: Date.now() },
    { id: 7, name: 'Notification API', type: 'API', status: 'Degraded', lastUpdated: Date.now() },
    { id: 8, name: 'Search Engine', type: 'Service', status: 'Online', lastUpdated: Date.now() }
  ],

  events: {},

  async getServices(filters = {}) {
    await this.delay();
    if (this.shouldFail()) throw new Error('Network error');
    
    let filtered = [...this.services];
    if (filters.status) filtered = filtered.filter(s => s.status === filters.status);
    if (filters.name_like) filtered = filtered.filter(s => s.name.toLowerCase().includes(filters.name_like.toLowerCase()));
    
    // Simulate random status changes
    filtered.forEach(service => {
      if (Math.random() < 0.1) {
        const statuses = ['Online', 'Offline', 'Degraded'];
        service.status = statuses[Math.floor(Math.random() * statuses.length)];
        service.lastUpdated = Date.now();
      }
    });
    
    return filtered;
  },

  async getService(id) {
    await this.delay();
    if (this.shouldFail()) throw new Error('Network error');
    return this.services.find(s => s.id === parseInt(id));
  },

  async createService(data) {
    await this.delay();
    if (this.shouldFail()) throw new Error('Network error');
    const newService = {
      id: Date.now(),
      ...data,
      status: 'Online',
      lastUpdated: Date.now()
    };
    this.services.push(newService);
    return newService;
  },

  async updateService(id, data) {
    await this.delay();
    if (this.shouldFail()) throw new Error('Network error');
    const index = this.services.findIndex(s => s.id === parseInt(id));
    if (index !== -1) {
      this.services[index] = { ...this.services[index], ...data, lastUpdated: Date.now() };
      return this.services[index];
    }
    throw new Error('Service not found');
  },

  async deleteService(id) {
    await this.delay();
    if (this.shouldFail()) throw new Error('Network error');
    this.services = this.services.filter(s => s.id !== parseInt(id));
    return true;
  },

  async getServiceEvents(id, page = 1) {
    await this.delay();
    if (this.shouldFail()) throw new Error('Network error');
    
    if (!this.events[id]) {
      this.events[id] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        timestamp: Date.now() - (i * 3600000) - Math.random() * 3600000,
        event: ['Status changed to Online', 'Status changed to Offline', 'Status changed to Degraded', 'Service restarted', 'Health check failed'][Math.floor(Math.random() * 5)],
        severity: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)]
      }));
    }
    
    const pageSize = 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      events: this.events[id].slice(start, end),
      hasMore: end < this.events[id].length,
      total: this.events[id].length
    };
  }
};

// Status badge component
const StatusBadge = ({ status }) => {
  const config = {
    Online: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle },
    Offline: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
    Degraded: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock }
  };
  
  const { color, icon: Icon } = config[status] || config.Offline;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

// Service type icon
const ServiceIcon = ({ type }) => {
  const icons = {
    API: Globe,
    Database: Database,
    Service: Server,
    CDN: Activity
  };
  const Icon = icons[type] || Server;
  return <Icon className="w-4 h-4 text-slate-500" />;
};

// Modal component
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Service form component
const ServiceForm = ({ service, onSubmit, onCancel }) => {
  const [name, setName] = useState(service?.name || '');
  const [type, setType] = useState(service?.type || 'API');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), type });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Service Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter service name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Service Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="API">API</option>
          <option value="Database">Database</option>
          <option value="Service">Service</option>
          <option value="CDN">CDN</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Main dashboard component
const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceEvents, setServiceEvents] = useState([]);
  const [eventsPage, setEventsPage] = useState(1);
  const [hasMoreEvents, setHasMoreEvents] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState('');
  
  const pollInterval = useRef(null);
  const eventsContainerRef = useRef(null);
  const lastFetchTime = useRef(0);
  
  // Cache for optimizations
  const [servicesCache, setServicesCache] = useState([]);
  const [lastCacheTime, setLastCacheTime] = useState(0);
  
  // Fetch services with caching
  const fetchServices = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Use cache if recent and not forcing refresh
    if (!forceRefresh && servicesCache.length > 0 && (now - lastCacheTime < 30000)) {
      setServices(servicesCache);
      return;
    }
    
    try {
      setError('');
      const data = await mockAPI.getServices({ 
        status: statusFilter || undefined, 
        name_like: searchTerm || undefined 
      });
      setServices(data);
      setServicesCache(data);
      setLastCacheTime(now);
      lastFetchTime.current = now;
    } catch (err) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', err);
    }
  }, [statusFilter, searchTerm, servicesCache, lastCacheTime]);
  
  // Poll for status updates only
  const pollStatusUpdates = useCallback(async () => {
    if (document.hidden) return; // Don't poll when tab is hidden
    
    try {
      setIsRefreshing(true);
      const data = await mockAPI.getServices({
        status: statusFilter || undefined,
        name_like: searchTerm || undefined
      });
      
      // Only update if there are actual changes
      const hasChanges = data.some(newService => {
        const oldService = services.find(s => s.id === newService.id);
        return !oldService || oldService.status !== newService.status || oldService.lastUpdated !== newService.lastUpdated;
      });
      
      if (hasChanges || data.length !== services.length) {
        setServices(data);
        setServicesCache(data);
        setLastCacheTime(Date.now());
      }
    } catch (err) {
      console.error('Error polling status updates:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [services, statusFilter, searchTerm]);
  
  // Filter services
  useEffect(() => {
    let filtered = [...services];
    if (statusFilter) {
      filtered = filtered.filter(service => service.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredServices(filtered);
  }, [services, statusFilter, searchTerm]);
  
  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await fetchServices(true);
      setIsLoading(false);
    };
    loadInitialData();
  }, []);
  
  // Polling effect
  useEffect(() => {
    if (services.length > 0) {
      pollInterval.current = setInterval(pollStatusUpdates, 15000);
      return () => {
        if (pollInterval.current) {
          clearInterval(pollInterval.current);
        }
      };
    }
  }, [pollStatusUpdates, services.length]);
  
  // Visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchServices(true); // Force refresh when tab becomes visible
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchServices]);
  
  // Load service events
  const loadServiceEvents = useCallback(async (serviceId, page = 1, append = false) => {
    setIsLoadingEvents(page === 1);
    setEventsError('');
    
    try {
      const data = await mockAPI.getServiceEvents(serviceId, page);
      
      if (append) {
        setServiceEvents(prev => [...prev, ...data.events]);
      } else {
        setServiceEvents(data.events);
      }
      
      setHasMoreEvents(data.hasMore);
      setEventsPage(page);
    } catch (err) {
      setEventsError('Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);
  
  // Infinite scroll for events
  const handleEventsScroll = useCallback(() => {
    if (!eventsContainerRef.current || isLoadingEvents || !hasMoreEvents) return;
    
    const { scrollTop, scrollHeight, clientHeight } = eventsContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadServiceEvents(selectedService.id, eventsPage + 1, true);
    }
  }, [selectedService, eventsPage, hasMoreEvents, isLoadingEvents, loadServiceEvents]);
  
  // Service CRUD operations
  const handleCreateService = useCallback(async (data) => {
    try {
      const newService = await mockAPI.createService(data);
      setServices(prev => [newService, ...prev]);
      setServicesCache(prev => [newService, ...prev]);
      setShowModal(false);
      setLastCacheTime(Date.now());
    } catch (err) {
      setError('Failed to create service');
    }
  }, []);
  
  const handleUpdateService = useCallback(async (data) => {
    const originalServices = [...services];
    
    // Optimistic update
    setServices(prev => prev.map(s => 
      s.id === editingService.id ? { ...s, ...data } : s
    ));
    
    try {
      const updatedService = await mockAPI.updateService(editingService.id, data);
      setServices(prev => prev.map(s => 
        s.id === updatedService.id ? updatedService : s
      ));
      setServicesCache(prev => prev.map(s => 
        s.id === updatedService.id ? updatedService : s
      ));
      setShowModal(false);
      setEditingService(null);
    } catch (err) {
      // Revert optimistic update
      setServices(originalServices);
      setError('Failed to update service');
    }
  }, [editingService, services]);
  
  const handleDeleteService = useCallback(async (serviceId) => {
    const originalServices = [...services];
    
    // Optimistic update
    setServices(prev => prev.filter(s => s.id !== serviceId));
    
    try {
      await mockAPI.deleteService(serviceId);
      setServicesCache(prev => prev.filter(s => s.id !== serviceId));
      if (selectedService?.id === serviceId) {
        setSelectedService(null);
      }
    } catch (err) {
      // Revert optimistic update
      setServices(originalServices);
      setError('Failed to delete service');
    }
  }, [services, selectedService]);
  
  const handleServiceClick = useCallback(async (service) => {
    setSelectedService(service);
    setServiceEvents([]);
    setEventsPage(1);
    setHasMoreEvents(false);
    
    // Load events in background
    loadServiceEvents(service.id);
  }, [loadServiceEvents]);
  
  // Clear error after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (selectedService) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedService(null)}
                className="text-slate-600 hover:text-slate-900 flex items-center gap-2"
              >
                ← Back to Dashboard
              </button>
              <div className="flex items-center gap-3">
                <ServiceIcon type={selectedService.type} />
                <h1 className="text-xl font-semibold text-slate-900">{selectedService.name}</h1>
                <StatusBadge status={selectedService.status} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-slate-900">Service Details</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                <p className="text-slate-900">{selectedService.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <p className="text-slate-900">{selectedService.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <StatusBadge status={selectedService.status} />
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-slate-900">Event History</h2>
            </div>
            <div 
              ref={eventsContainerRef}
              onScroll={handleEventsScroll}
              className="max-h-96 overflow-y-auto"
            >
              {isLoadingEvents && serviceEvents.length === 0 ? (
                <div className="p-6 text-center">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-slate-600">Loading events...</p>
                </div>
              ) : eventsError ? (
                <div className="p-6 text-center text-red-600">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                  <p>{eventsError}</p>
                </div>
              ) : serviceEvents.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  <p>No events found</p>
                </div>
              ) : (
                <div className="divide-y">
                  {serviceEvents.map((event, index) => (
                    <div key={`${event.id}-${index}`} className="p-4 hover:bg-slate-50">
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full mt-1 ${
                          event.severity === 'error' ? 'bg-red-500' :
                          event.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-slate-900">{event.event}</p>
                          <p className="text-sm text-slate-500 mt-1">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoadingEvents && serviceEvents.length > 0 && (
                    <div className="p-4 text-center">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600 mx-auto" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">MonitoCorp SRE Dashboard</h1>
              <p className="text-slate-600 mt-1">Monitor the health of your microservices</p>
            </div>
            <div className="flex items-center gap-2">
              {isRefreshing && (
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              )}
              <span className="text-sm text-slate-500">
                Last updated: {new Date(lastFetchTime.current || Date.now()).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
              <button 
                onClick={() => setError('')}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Degraded">Degraded</option>
          </select>
          <button
            onClick={() => {
              setShowModal(true);
              setEditingService(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
        
        {/* Services Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Service</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Type</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Last Updated</th>
                  <th className="text-right py-3 px-6 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredServices.map((service) => (
                  <tr 
                    key={service.id} 
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => handleServiceClick(service)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <ServiceIcon type={service.type} />
                        <span className="font-medium text-slate-900">{service.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{service.type}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={service.status} />
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {new Date(service.lastUpdated).toLocaleTimeString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingService(service);
                            setShowModal(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this service?')) {
                              handleDeleteService(service.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-400 ml-2" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredServices.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              <Server className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium mb-2">No services found</p>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingService(null);
        }}
        title={editingService ? 'Edit Service' : 'Add New Service'}
      >
        <ServiceForm
          service={editingService}
          onSubmit={editingService ? handleUpdateService : handleCreateService}
          onCancel={() => {
            setShowModal(false);
            setEditingService(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;