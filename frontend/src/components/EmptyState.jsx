import { PackageOpen } from 'lucide-react';

const EmptyState = ({ title, description, icon: Icon = PackageOpen }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center card bg-dark-900/50 border-dashed border-dark-700">
    <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-dark-400" />
    </div>
    <h3 className="text-lg font-semibold text-dark-200 mb-1">{title}</h3>
    <p className="text-sm text-dark-500 max-w-sm">{description}</p>
  </div>
);
export default EmptyState;
