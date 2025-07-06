import { Search } from 'lucide-react';

const Filters = ({ searchInput, setSearchInput, handleSearch, filters, setFilters, showFilters }) => {
    return (
        <div className={`bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-xl shadow-xl border border-gray-800/50 mb-6 backdrop-blur-md ${showFilters ? 'block' : 'hidden sm:block'}`}>
            <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400 group-focus-within:text-cyan-300 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-gray-800/70 transition-all duration-200"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={filters.status}
                            onChange={(e) =>{
                                setFilters({ status: e.target.value, page: 1 })
                                console.log('Status filter changed:', e.target.value);
                            }
              }
                        className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-gray-800/70 transition-all duration-200"
            >
                        <option value="" className="bg-gray-800">All Statuses</option>
                        <option value="Online" className="bg-gray-800">Online</option>
                        <option value="Offline" className="bg-gray-800">Offline</option>
                        <option value="Degraded" className="bg-gray-800">Degraded</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 font-medium"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    </div >
  );
};

export default Filters;