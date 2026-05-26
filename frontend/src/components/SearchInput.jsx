import { Search, X } from 'lucide-react';

const SearchInput = ({ id, value, onChange, placeholder = 'Search...' }) => (
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
    <input
      id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input pl-9 pr-9"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);
export default SearchInput;
