import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const config = {
    Online: { icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200', dot: 'bg-green-400' },
    Offline: { icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200', dot: 'bg-red-400' },
    Degraded: { icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', dot: 'bg-yellow-400' },
  };
  const { icon: Icon, color, dot } = config[status];
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${color}`}>
      <div className={`w-2 h-2 rounded-full ${dot}`}></div>
      <Icon className="w-4 h-4" />
      {status}
    </div>
  );
};

export default StatusBadge;
