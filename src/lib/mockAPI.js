let idCounter = 100
let mockDb = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `Service ${i + 1}`,
    type: ['API', 'Database', 'Worker'][i % 3],
    status: ['Online', 'Offline', 'Degraded'][Math.floor(Math.random() * 3)],
}))

function delay(ms) {
    return new Promise((res) => setTimeout(res, ms))
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function maybeFail() {
    if (Math.random() < 0.05) {
        throw new Error('API failure')
    }
}

export const mockApi = {
    async fetchServices({ page = 1, limit = 10, status = '', name = '' }) {
        await delay(random(300, 1000))
        maybeFail()
        const filtered = mockDb.filter(
            (s) =>
                (!status || s.status === status) &&
                (!name || s.name.toLowerCase().includes(name.toLowerCase()))
        )

        const start = (page - 1) * limit
        const data = filtered.slice(start, start + limit)

        return { data, total: filtered.length }
    },

    async createService({ name, type }) {
        await delay(random(300, 1000))
        maybeFail()

        const newService = {
            id: idCounter++,
            name,
            type,
            status: ['Online', 'Offline', 'Degraded'][Math.floor(Math.random() * 3)],
        }

        mockDb.unshift(newService)
        return newService
    },

    async updateService(id, { name, type }) {
        await delay(random(300, 1000))
        maybeFail()

        const idx = mockDb.findIndex((s) => s.id === id)
        if (idx === -1) throw new Error('Service not found')

        mockDb[idx] = { ...mockDb[idx], name, type }
        return mockDb[idx]
    },

    async deleteService(id) {
        await delay(random(300, 1000))
        maybeFail()

        const idx = mockDb.findIndex((s) => s.id === id)
        if (idx === -1) throw new Error('Service not found')

        mockDb.splice(idx, 1)
        return { ok: true }
    },

    async fetchServiceEvents(serviceId, { page = 1, limit = 10 }){
        const total = 100; 
        const allEvents = Array.from({ length: total }, (_, i) => ({
            id: `${serviceId}-${i + 1}`,
            message: `Event ${i + 1} for Service ${serviceId}`,
            timestamp: new Date(Date.now() - i * 60000).toISOString(),
        }));

        const start = (page - 1) * limit;
        const events = allEvents.slice(start, start + limit);

        return {
            events,
            hasMore: start + limit < total,
        };
    }


}
