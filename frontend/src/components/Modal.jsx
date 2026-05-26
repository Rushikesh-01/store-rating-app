import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-800 bg-dark-900/50">
          <h3 className="text-lg font-semibold text-dark-50">{title}</h3>
          <button onClick={onClose} className="text-dark-500 hover:text-dark-200 transition-colors bg-dark-800 hover:bg-dark-700 p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Modal;
