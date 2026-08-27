import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import styled from 'styled-components';

import { fetchMockProducts } from './mockData';

/*
Build Exercise

Product Filter Dashboard

Build a React application from scratch.

Features:

-   product list x
-   search input x
-   category filter x
-   price filter x
-   sort dropdown x
-   selected product x
-   loading state x
-   empty state x

Constraints:

-   no state management library
-   no UI component library
-   keep state as local as reasonably possible
-   avoid duplicated/derived state

Stretch

Add:

-   URL query parameters for filters x
-   reset filters x
-   result count x
*/

const SORT_FILTERS = ['name-asc', 'name-desc', 'price-asc', 'price-desc'];

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

type SortFilter =
  | 'none'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc';

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
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const PriceGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;

  @media (max-width: 540px) {
    grid-template-columns: 1fr 1fr;
  }
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

const Select = styled.select`
  box-sizing: border-box;
  width: 100%;
  min-height: 40px;
  padding: 0 0.6rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.text};
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const ResetButton = styled.button`
  min-height: 36px;
  padding: 0 0.8rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.bgElevated};
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
`;

const ResultCount = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
`;

const SelectedProduct = styled.div`
  margin-bottom: 1rem;
  padding: 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bg};
`;

const SelectedProductLabel = styled.p`
  margin: 0 0 0.25rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const SelectedProductName = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
`;

const SelectedProductMeta = styled.p`
  margin: 0.2rem 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.7rem;
`;

const ProductCard = styled.button<{ $selected: boolean }>`
  width: 100%;
  padding: 0.9rem;
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.text : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
  font: inherit;
  cursor: pointer;
  transition:
    border-color 120ms ease,
    background 120ms ease,
    transform 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bgElevated};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.text};
    outline-offset: 2px;
  }
`;

const CardName = styled.p`
  margin: 0 0 0.3rem;
  font-weight: 700;
`;

const CardMeta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
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

export const ProductFilterDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    () => searchParams.get('searchInput') ?? '',
  );

  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get('selectedCategory') ?? '',
  );

  const [priceFilter, setPriceFilter] = useState(() => {
    const priceObj = { min: 0, max: 0 };

    priceObj.min = Number(searchParams.get('min') ?? 0);
    priceObj.max = Number(searchParams.get('max') ?? 0);

    return priceObj;
  });

  const [sortFilter, setSortFilter] = useState<SortFilter>(
    () => (searchParams.get('sortFilter') as SortFilter) ?? 'none',
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryList = [...new Set(products.map((p) => p.category))];

  const itemsToRender = products.filter((product) => {
    const searchInputMatch = product.name
      .toLowerCase()
      .includes(searchInput.toLowerCase());

    const categoryFilterMatch =
      selectedCategory === '' || product.category === selectedCategory;

    const matchesMinPrice =
      priceFilter.min === 0 || priceFilter.min <= product.price;

    const matchesMaxPrice =
      priceFilter.max === 0 || priceFilter.max >= product.price;

    const priceFilterMatch = matchesMinPrice && matchesMaxPrice;

    return (
      searchInputMatch &&
      categoryFilterMatch &&
      priceFilterMatch
    );
  });

  const itemsToSort =
    sortFilter === 'none'
      ? itemsToRender
      : [...itemsToRender].sort((a, b) => {
          if (sortFilter === 'name-asc') {
            return a.name.localeCompare(b.name);
          }

          if (sortFilter === 'name-desc') {
            return b.name.localeCompare(a.name);
          }

          if (sortFilter === 'price-asc') {
            return a.price - b.price;
          }

          return b.price - a.price;
        });

  const itemLength = itemsToSort.length;

  const handleSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchInput(e.target.value);

    setSearchParams((_searchParams) => {
      _searchParams.set('searchInput', e.target.value);
      return _searchParams;
    });
  };

  const handlePriceFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.name.includes('min')) {
      setPriceFilter((prevState) => ({
        ...prevState,
        min: Number(e.target.value),
      }));

      setSearchParams((_searchParams) => {
        _searchParams.set('min', e.target.value);
        return _searchParams;
      });
    } else if (e.target.name.includes('max')) {
      setPriceFilter((prevState) => ({
        ...prevState,
        max: Number(e.target.value),
      }));

      setSearchParams((_searchParams) => {
        _searchParams.set('max', e.target.value);
        return _searchParams;
      });
    }
  };

  const handleOnCategorySelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedCategory(e.target.value);

    setSearchParams((_searchParams) => {
      _searchParams.set('selectedCategory', e.target.value);
      return _searchParams;
    });
  };

  const handleSortOnSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSortFilter(e.target.value as SortFilter);

    setSearchParams((_searchParams) => {
      _searchParams.set('sortFilter', e.target.value);
      return _searchParams;
    });
  };

  const handleProductOnClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleResetFilterOnClick = () => {
    setSearchInput('');
    setSelectedCategory('');
    setPriceFilter({ min: 0, max: 0 });
    setSortFilter('none');
    setSelectedProduct(null);
    setSearchParams({}, { replace: true });
  };

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        const res = await fetchMockProducts();

        if (!cancelled) {
          setProducts(res);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <Wrap>
        <LoadingState>Loading products...</LoadingState>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <Header>
        <PageTitle>Product Filter Dashboard</PageTitle>
      </Header>

      <Controls>
        <ControlGroup>
          <Label htmlFor="product-filter-dashboard-search-input">
            Search
          </Label>

          <Input
            type="text"
            value={searchInput}
            onChange={handleSearchInputChange}
            id="product-filter-dashboard-search-input"
            name="product-filter-dashboard-search-input"
            placeholder="Search products..."
          />
        </ControlGroup>

        <ControlGroup>
          <Label htmlFor="product-filter-dashboard-category-filter">
            Category
          </Label>

          <Select
            value={selectedCategory}
            onChange={handleOnCategorySelect}
            id="product-filter-dashboard-category-filter"
            name="product-filter-dashboard-category-filter"
          >
            <option value="">Show all categories</option>

            {categoryList.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </ControlGroup>

        <ControlGroup>
          <Label>Price</Label>

          <PriceGroup>
            <Input
              type="number"
              min="0"
              value={priceFilter.min}
              onChange={handlePriceFilterChange}
              id="product-filter-dashboard-price-filter-min"
              name="product-filter-dashboard-price-filter-min"
              placeholder="Min"
              aria-label="Minimum price"
            />

            <Input
              type="number"
              min="0"
              value={priceFilter.max}
              onChange={handlePriceFilterChange}
              id="product-filter-dashboard-price-filter-max"
              name="product-filter-dashboard-price-filter-max"
              placeholder="Max"
              aria-label="Maximum price"
            />
          </PriceGroup>
        </ControlGroup>

        <ControlGroup>
          <Label htmlFor="product-filter-dashboard-sort-filter">
            Sort
          </Label>

          <Select
            value={sortFilter}
            onChange={handleSortOnSelect}
            id="product-filter-dashboard-sort-filter"
            name="product-filter-dashboard-sort-filter"
          >
            <option value="none">No sort applied</option>

            {SORT_FILTERS.map((sortType) => (
              <option key={sortType} value={sortType}>
                {sortType}
              </option>
            ))}
          </Select>
        </ControlGroup>
      </Controls>

      <Actions>
        <ResetButton
          type="button"
          onClick={handleResetFilterOnClick}
        >
          Clear filters
        </ResetButton>
      </Actions>

      <ResultsHeader>
        <ResultCount>
          {itemLength} {itemLength === 1 ? 'result' : 'results'} shown
        </ResultCount>
      </ResultsHeader>

      {selectedProduct && (
        <SelectedProduct>
          <SelectedProductLabel>Selected product</SelectedProductLabel>

          <SelectedProductName>
            {selectedProduct.name}
          </SelectedProductName>

          <SelectedProductMeta>
            {selectedProduct.category} · ${selectedProduct.price}
          </SelectedProductMeta>
        </SelectedProduct>
      )}

      {itemsToSort.length === 0 ? (
        <EmptyState>
          No products match those filters.
        </EmptyState>
      ) : (
        <ProductList>
          {itemsToSort.map((product) => (
            <ProductCard
              key={product.id}
              type="button"
              $selected={selectedProduct?.id === product.id}
              onClick={() => handleProductOnClick(product)}
              aria-pressed={selectedProduct?.id === product.id}
            >
              <CardName>{product.name}</CardName>

              <CardMeta>
                {product.category} · ${product.price}
              </CardMeta>
            </ProductCard>
          ))}
        </ProductList>
      )}
    </Wrap>
  );
};

export default ProductFilterDashboard;
