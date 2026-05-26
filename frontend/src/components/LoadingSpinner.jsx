const LoadingSpinner = ({ fullScreen = false, size = 'md', text = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} border-2 border-dark-700 border-t-primary-500 rounded-full animate-spin`} />
      {text && <p className="text-sm text-dark-400">{text}</p>}
    </div>
  );
  if (fullScreen) return <div className="fixed inset-0 flex items-center justify-center bg-dark-950 z-50">{spinner}</div>;
  return <div className="flex items-center justify-center p-8">{spinner}</div>;
};
export default LoadingSpinner;
