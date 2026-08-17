import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value: externalValue,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(externalValue || '');

  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(internalValue);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [internalValue, onChange, debounceMs]);

  const handleClear = () => {
    setInternalValue('');
    onChange('');
  };

  return (
    <div className={`relative flex items-center w-full ${className}`.trim()}>
      <Search className="absolute left-3.5 text-orange-500 w-4 h-4 pointer-events-none" />
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-dark-900 border border-white/10 text-white text-sm rounded-lg ps-10 pe-10 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-500"
      />
      {internalValue && (
        <button
          onClick={handleClear}
          className="absolute right-3.5 text-secondary hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
