import { create } from 'zustand';
import { produce } from 'immer';
import { devtools, subscribeWithSelector } from 'zustand/middleware';


const merge = (target, updates) => Object.assign({}, target, updates);


export const useServiceStore = create(
    devtools(
        subscribeWithSelector((set, get) => ({

            isLoading: false,
            error: null,


            services: [],
            totalServices: 0,
            filters: {
                status: '',
                name: '',
                page: 1,
                limit: 10,
            },


            serviceDetail: null,
            serviceEvents: [],
            hasMoreEvents: true,


            setFilters: (updates) =>
                console.log('Setting filters:', updates) ||
                set(
                    produce((state) => {
                        state.filters = {
                            ...state.filters,
                            ...updates,
                        };
                    })
                ),



            setLoading: (flag) =>
                set(
                    produce((state) => {
                        state.isLoading = flag;
                        state.error = null;
                    })
                ),


            setError: (message) =>
                set(
                    produce((state) => {
                        state.error = message;
                    })
                ),


            resetDetails: () =>
                set(
                    produce((state) => {
                        state.serviceDetail = null;
                        state.serviceEvents = [];
                        state.hasMoreEvents = true;
                    })
                ),


            setServices: (data, total) =>
                set(
                    produce((state) => {
                        state.services = data;
                        state.totalServices = total;
                    })
                ),


            updateServiceInList: (updatedService) =>
                set(
                    produce((state) => {
                        const index = state.services.findIndex((s) => s.id === updatedService.id);
                        if (index !== -1) {
                            state.services[index] = updatedService;
                        }
                    })
                ),


            addService: (newService) =>
                set(
                    produce((state) => {
                        state.services.unshift(newService);
                        state.totalServices += 1;
                    })
                ),


            deleteService: (id) =>
                set(
                    produce((state) => {
                        state.services = state.services.filter((s) => s.id !== id);
                        state.totalServices -= 1;
                    })
                ),


            setServiceDetail: (detail) =>
                set(
                    produce((state) => {
                        state.serviceDetail = detail;
                    })
                ),


            addServiceEvents: (events, hasMore) =>
                set(
                    produce((state) => {
                        state.serviceEvents = [...state.serviceEvents, ...events];
                        state.hasMoreEvents = hasMore;
                    })
                ),

            setServiceEvents: (events, hasMore) =>
                set(
                    produce((state) => {
                        state.serviceEvents = events;
                        state.hasMoreEvents = hasMore;
                    })
                ),
        })),
        { name: 'ServiceMonitoringStore' }
    )
);
