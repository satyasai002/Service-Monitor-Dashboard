'use client';
import { RefreshCw, X } from 'lucide-react';
import { useState } from 'react';
import { useServiceStore } from '../store/services';
import { mockApi } from '../lib/mockAPI';

const ServiceFormModal = ({ mode, initial, onClose }) => {
  const isEdit = mode === 'edit';
  const [name, setName] = useState(initial?.name || '');
  const [type, setType] = useState(initial?.type || 'API');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addService, updateServiceInList, setError } = useServiceStore();

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      if (isEdit) {
        const updated = await mockApi.updateService(initial.id, { name, type });
        updateServiceInList(updated);
      } else {
        const created = await mockApi.createService({ name, type });
        addService(created);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter service name"
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="API">API</option>
                <option value="Database">Database</option>
                <option value="Worker">Worker</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{isEdit ? 'Update' : 'Create'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFormModal;
