import { Server, RefreshCw, Plus, Filter } from 'lucide-react';

const Header = ({ setShowFilters, setFormModal }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Server className="w-8 h-8 text-cyan-400 drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Service Monitor
                </h1>
                <div className="w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-0.5"></div>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700/50">
                <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-sm text-gray-300 font-medium">Auto-refresh: 15s</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="sm:hidden p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => setFormModal({ open: true, mode: 'create', service: null })}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Add Service</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;