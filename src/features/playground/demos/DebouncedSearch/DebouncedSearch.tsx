import { useState, useEffect } from 'react';

import { useDebouncedValue } from '../../../../hooks/useDebouncedValue';
import { searchCharacters, type Character } from './mockData';
/*
Build Exercise

Debounced Search

Build:

-   search input x
-   300–500ms debounce x
-   loading state x
-   API request x
-   results x
-   empty state x
-   error state x
-   clear button

Additional Exercise

Build a timer:

-   start
-   pause
-   reset
-   elapsed time
-   cleanup
*/


export const DebouncedSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const debouncedSearchInput = useDebouncedValue(searchInput, 500);

  const handleSearchInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchCharacters = async () => {
      setIsLoading(true);
      setError("");

      try {
        if (cancelled) return;

        const res = await searchCharacters(debouncedSearchInput);

        if (res) {
          setSearchResults(res);
        }
      } catch(e) {
        if (cancelled) return;
        setError(e as string);
        console.error(e);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchCharacters();

    return () => {
      cancelled = true;
    }
  }, [debouncedSearchInput])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      Debounced Search

      <label htmlFor="debounced-search-input">
        Start typing here to search!
      </label>
      <input type="text" value={searchInput} onChange={handleSearchInputOnChange} id="debounced-search-input" name="debounced-search-input" />

      {searchInput}

      <div>
        {error && (
          <p>
            Something went wrong! Message: {error}
          </p>
        )}
        {searchResults.length === 0 && debouncedSearchInput ? (<p>No One Piece character found 😭</p>) : searchResults.map((result) => {
          return (
            <p key={result.id}>
              {result.name}
            </p>
          )
        })}
      </div>
    </div>
  )
};