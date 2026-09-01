import { useState, useEffect } from 'react';
import styled from 'styled-components';

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
-   clear button x

Additional Exercise

Build a timer:

-   start
-   pause
-   reset
-   elapsed time
-   cleanup
*/

const formatBounty = (bounty: number | null) => {
  if (bounty === null) return 'Unknown';
  return `฿${bounty.toLocaleString()}`;
};

const Wrap = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bgElevated};
  padding: 1.25rem;
`;

const Header = styled.div`
  margin-bottom: 1.25rem;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.4rem;
  line-height: 1.2;
`;

const Controls = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  @media (max-width: 540px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
  font-weight: 600;
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  min-height: 40px;
  padding: 0 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.text};
  }
`;

const ClearButton = styled.button`
  min-height: 40px;
  padding: 0 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.bgMuted};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.text};
    outline-offset: 2px;
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
  min-height: 1.2rem;
`;

const ResultCount = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
`;

const CharacterList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.7rem;
`;

const CharacterCard = styled.div`
  padding: 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bg};
  transition:
    border-color 120ms ease,
    transform 120ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text};
    transform: translateY(-1px);
  }
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
`;

const CardName = styled.p`
  margin: 0 0 0.15rem;
  font-weight: 700;
`;

const CardRole = styled.p`
  margin: 0 0 0.5rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
`;

const CardBounty = styled.p`
  margin: 0 0 0.5rem;
  color: ${({ theme }) => theme.palette.goldRush};
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
`;

const CardDescription = styled.p`
  margin: 0 0 0.6rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  line-height: 1.4;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Tag = styled.span`
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.bgMuted};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.72rem;
  font-weight: 600;
`;

const DevilFruitTag = styled(Tag)`
  background: color-mix(in srgb, ${({ theme }) => theme.palette.bayTeal} 16%, transparent);
  color: ${({ theme }) => theme.palette.bayTeal};
`;

const EmptyState = styled.div`
  padding: 2.5rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorBanner = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.palette.ninerCrimson};
  border-radius: ${({ theme }) => theme.radius};
  background: color-mix(in srgb, ${({ theme }) => theme.palette.ninerCrimson} 10%, transparent);
  color: ${({ theme }) => theme.palette.ninerCrimson};
  font-size: 0.85rem;
`;

export const DebouncedSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchInput = useDebouncedValue(searchInput, 500);

  const handleSearchInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleClearOnClick = () => {
    setSearchInput('');
    setSearchResults([]);
    setError(null);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchCharacters = async () => {
      // if (!debouncedSearchInput) {
      //   setSearchResults([]);
      //   return;
      // }

      setIsLoading(true);
      setError(null);

      try {
        const res = await searchCharacters(debouncedSearchInput);

        if (!cancelled) {
          setSearchResults(res);
        }
      } catch (e) {
        if (cancelled) return;
        const errorMessage = e instanceof Error ? e.message : 'Something went wrong';
        setError(errorMessage);
        setSearchResults([]);
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
    };
  }, [debouncedSearchInput]);

  const hasSearched = debouncedSearchInput.length > 0;
  const resultCount = searchResults.length;

  return (
    <Wrap>
      <Header>
        <PageTitle>Debounced Search</PageTitle>
      </Header>

      <Controls>
        <ControlGroup>
          <Label htmlFor="debounced-search-input">
            Search One Piece characters
          </Label>

          <Input
            type="text"
            value={searchInput}
            onChange={handleSearchInputOnChange}
            id="debounced-search-input"
            name="debounced-search-input"
            placeholder="Try “Luffy”, “Zoro”, “Law”..."
          />
        </ControlGroup>

        <ClearButton
          type="button"
          onClick={handleClearOnClick}
          disabled={!searchInput}
        >
          Clear
        </ClearButton>
      </Controls>

      {error && (
        <ErrorBanner role="alert">
          Something went wrong! Message: {error}
        </ErrorBanner>
      )}

      {isLoading ? (
        <LoadingState>Loading...</LoadingState>
      ) : (
        <>
          {hasSearched && !error && (
            <ResultsHeader>
              <ResultCount>
                {resultCount} {resultCount === 1 ? 'result' : 'results'} for
                &nbsp;“{debouncedSearchInput}”
              </ResultCount>
            </ResultsHeader>
          )}

          {hasSearched && resultCount === 0 && !error ? (
            <EmptyState>No One Piece character found 😭</EmptyState>
          ) : (
            <CharacterList>
              {searchResults.map((character) => (
                <CharacterCard key={character.id}>
                  <CardTopRow>
                    <CardName>{character.name}</CardName>
                  </CardTopRow>

                  <CardRole>
                    {character.role} · {character.crew}
                  </CardRole>

                  <CardBounty>{formatBounty(character.bounty)}</CardBounty>

                  <CardDescription>{character.description}</CardDescription>

                  <TagRow>
                    <Tag>{character.affiliation}</Tag>
                    {character.devilFruit && (
                      <DevilFruitTag>{character.devilFruit}</DevilFruitTag>
                    )}
                  </TagRow>
                </CharacterCard>
              ))}
            </CharacterList>
          )}
        </>
      )}
    </Wrap>
  );
};

export default DebouncedSearch;
