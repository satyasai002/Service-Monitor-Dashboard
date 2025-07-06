import { Server, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const StatusSummary = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4 sm:px-6 lg:px-8">
      <SummaryCard title="Total Services" count={summary.total} icon={Server} />
      <SummaryCard
        title="Online"
        count={summary.online}
        icon={CheckCircle}
        color="text-emerald-400"
        ring="ring-emerald-400/30"
        gradient="from-emerald-800 via-emerald-700 to-emerald-600"
      />
      <SummaryCard
        title="Degraded"
        count={summary.degraded}
        icon={AlertCircle}
        color="text-amber-400"
        ring="ring-amber-400/30"
        gradient="from-amber-800 via-amber-700 to-amber-600"
      />
      <SummaryCard
        title="Offline"
        count={summary.offline}
        icon={XCircle}
        color="text-red-400"
        ring="ring-red-400/30"
        gradient="from-red-800 via-red-700 to-red-600"
      />
    </div>
  );
};

const SummaryCard = ({ title, count, icon: Icon, color = 'text-cyan-400', ring = 'ring-cyan-500/30', gradient = 'from-slate-800 via-gray-800 to-slate-700' }) => {
  return (
    <div
      className={`
        group rounded-xl p-6 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
        bg-gradient-to-br ${gradient} ring-1 ${ring}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-300 mb-2">{title}</p>
          <p className={`text-3xl font-bold ${color} transition-transform duration-300 group-hover:scale-105`}>
            {count}
          </p>
        </div>
        <div className="relative">
          <Icon className={`w-8 h-8 ${color} opacity-80 transition-transform duration-300 group-hover:scale-110`} />
          <div className={`absolute inset-0 ${color} opacity-10 blur-xl rounded-full scale-150 group-hover:scale-200 transition-all duration-300`} />
        </div>
      </div>
      <div className={`mt-4 h-1 bg-gradient-to-r ${gradient} rounded-full opacity-40 group-hover:opacity-90 transition-all duration-300`} />
    </div>
  );
};

export default StatusSummary;
