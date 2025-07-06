import { Server, Database, Zap } from 'lucide-react';

const ServiceTypeIcon = ({ type }) => {
  const icons = {
    API: Server,
    Database: Database,
    Worker: Zap,
  };
  const Icon = icons[type] || Server;
  return <Icon className="w-5 h-5 text-gray-600" />;
};

export default ServiceTypeIcon;
