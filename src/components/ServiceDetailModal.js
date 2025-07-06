'use client';
import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { useServiceStore } from '../store/services';
import { mockApi } from '../lib/mockAPI';

export default function ServiceDetailModal({ onClose }) {
  const {
    serviceDetail,
    serviceEvents,
    hasMoreEvents,
    setServiceDetail,
    setServiceEvents,
    addServiceEvents,
    resetDetails,
  } = useServiceStore();

  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const loadEvents = useCallback(async () => {
    if (!serviceDetail || loadingRef.current || !hasMoreEvents) return;
    loadingRef.current = true;
    try {
      const res = await mockApi.fetchServiceEvents(serviceDetail.id, {
        page: pageRef.current,
        limit: 10,
      });
      if (pageRef.current === 1) {
        setServiceEvents(res.events, res.hasMore);
      } else {
        addServiceEvents(res.events, res.hasMore);
      }
      pageRef.current += 1;
    } catch (err) {
      console.error('Failed to load events:', err.message);
    } finally {
      loadingRef.current = false;
    }
  }, [serviceDetail, hasMoreEvents]);

  useEffect(() => {
    pageRef.current = 1;
    loadEvents();
  }, [serviceDetail]);

  useEffect(() => {
    const handleScroll = () => {
      const bottomReached =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (bottomReached) loadEvents();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadEvents]);

  if (!serviceDetail) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center px-4 sm:px-6 lg:px-8 overflow-auto py-10">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">{serviceDetail.name}</h2>
          <button
            onClick={() => {
              resetDetails();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-4 space-y-2 text-sm text-gray-700">
          <p><span className="font-medium text-gray-900">Type:</span> {serviceDetail.type}</p>
          <p><span className="font-medium text-gray-900">Status:</span> {serviceDetail.status}</p>
        </div>

        <div className="px-6 mt-6 pb-6">
          <h3 className="text-md font-semibold text-gray-800 mb-3">Historical Events</h3>
          <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {serviceEvents.map((e) => (
              <li
                key={e.id}
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm hover:bg-gray-100 transition"
              >
                <p className="text-sm text-gray-800">{e.message}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(e.timestamp).toLocaleString()}</p>
              </li>
            ))}
            {hasMoreEvents && (
            <div className="text-center py-4 text-sm text-gray-400">Loading more events...</div>
          )}
          </ul>

          
        </div>
      </div>
    </div>
  );
}
