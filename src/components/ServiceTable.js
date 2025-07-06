import { Edit3, Trash2, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ServiceTypeIcon from './ServiceTypeIcon';

const ServiceTable = ({ services, onEdit, handleDelete,onClickService }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

      <div className="bg-gradient-to-r from-slate-100 via-white to-slate-100 border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900">Service Monitor</h2>
        <p className="text-sm text-gray-600 mt-1">Monitor and manage your services</p>
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100/80 border-b border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map((service) => (
              <tr
                key={service.id}
                className="hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 group"
                onClick={() => onClickService(service)}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-4">
                    <ServiceTypeIcon type={service.type} />
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                        {service.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-block bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                    {service.type}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={service.status} />
                </td>
                <td className="px-6 py-5">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) =>{
                     e.stopPropagation(); 
                    onEdit(service)}}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition-transform duration-200 hover:scale-105 shadow-md"
                      title="Edit service"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) =>{ 
                     e.stopPropagation(); 
                    handleDelete(service.id)}}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-transform duration-200 hover:scale-105 shadow-md"
                      title="Delete service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-gray-200">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-5 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 rounded-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ServiceTypeIcon type={service.type} />
                <div>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {service.url || 'No URL'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) =>{
                     e.stopPropagation(); 
                    onEdit(service)}}
                  className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) =>{ 
                     e.stopPropagation(); 
                    handleDelete(service.id)}}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Type</span>
                <div className="mt-1">
                  <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {service.type}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Status</span>
                <div className="mt-1">
                  <StatusBadge status={service.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Uptime</span>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-800">{service.uptime}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"
                      style={{ width: service.uptime }}
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Last Check</span>
                <div className="mt-1">
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                    {service.lastChecked}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg font-medium">No services found</div>
          <p className="text-sm text-gray-400">Add your first service to get started</p>
        </div>
      )}
    </div>
  );
};

export default ServiceTable;
