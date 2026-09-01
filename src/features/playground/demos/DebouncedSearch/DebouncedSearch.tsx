import { useState, useEffect } from 'react';

import { debounce } from '../../../../utils/debounce';
import { searchCharacters, type Character } from './mockData';
/*
Build Exercise

Debounced Search

Build:

-   search input x
-   300–500ms debounce x
-   loading state x
-   API request x
-   results
-   empty state
-   error state
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

  const handleSearchInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!searchInput) return;

      setIsLoading(true);

      try {
        const res = await searchCharacters(searchInput);
        if (res) {
          setSearchResults(res);
        }
      } catch(e) {
        setError(e as string);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    const debouncedFetchCharacters = debounce(fetchCharacters, 500);

    debouncedFetchCharacters();
  }, [searchInput])

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
        {searchResults.map((result) => {
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