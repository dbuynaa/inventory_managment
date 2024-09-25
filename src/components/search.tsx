import useDebounce from '@/hooks/useDebounce';
import { useSearch } from '@/hooks/useSearch';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from './ui/input';

export const Search = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') ?? ''
  );
  const onSearch = useSearch();
  const debouncedSearchTerm = useDebounce(searchTerm || '', 0);

  useEffect(() => {
    onSearch('search', debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <Input
      type="search"
      placeholder="Search products..."
      className="max-w-sm"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};
