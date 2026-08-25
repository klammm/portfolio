import { useState } from 'react';

import { PRODUCTS } from './mockData';
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
-   loading state
-   empty state

Constraints:

-   no state management library
-   no UI component library
-   keep state as local as reasonably possible
-   avoid duplicated/derived state

Stretch

Add:

-   URL query parameters for filters
-   reset filters
-   result count
*/

const categoryList = [...new Set(PRODUCTS.map(p => p.category))];
const SORT_FILTERS = ['asc', 'desc'];

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

type SortFilter = 'none' | 'asc' | 'desc';

export const ProductFilterDashboard = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 0 });
  const [sortFilter, setSortFilter] = useState<SortFilter>('none');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const itemsToRender = PRODUCTS.filter(product => {
    const searchInputMatch = product.name.toLowerCase().includes(searchInput.toLowerCase());
    const categoryFilterMatch = selectedCategory === '' || product.category === selectedCategory; 
    const matchesMinPrice = priceFilter.min === 0 || priceFilter.min <= product.price;
    const matchesMaxPrice = priceFilter.max === 0 || priceFilter.max >= product.price;
    const priceFilterMatch = matchesMinPrice && matchesMaxPrice;

    return searchInputMatch && categoryFilterMatch && priceFilterMatch;
  });

  const itemsToSort = sortFilter === 'none' ? itemsToRender : [...itemsToRender].sort((a, b) => sortFilter === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handlePriceFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name.includes('min')) {
      setPriceFilter(prevState => ({
        ...prevState,
        min: Number(e.target.value),
      }));
    } else if (e.target.name.includes('max')) {
      setPriceFilter(prevState => ({
        ...prevState,
        max: Number(e.target.value),
      }));
    }
  };

  const handleOnCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortOnSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortFilter(e.target.value as SortFilter);
  };

  const handleProductOnClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div>
      <h1>Product Filter Dashboard</h1>
      <input type="text" value={searchInput} onChange={handleSearchInputChange} id="product-filter-dashboard-search-input" name="product-filter-dashboard-search-input" placeholder="Start typing to search a product" />
      <label htmlFor='product-filter-dashboard-category-filter'>
        Filter by Category
      </label>
      <select onChange={handleOnCategorySelect} id="product-filter-dashboard-category-filter" name="product-filter-dashboard-category-filter">
        <option value="">Show all categories</option>
        {categoryList.map((category) => {
          return (
            <option key={category} value={category}>
              {category}
            </option>
          )
        })}
      </select>
      <label htmlFor='product-filter-dashboad-pricefilter-min'>
        Min
      </label>
      <input type="number" value={priceFilter.min} onChange={handlePriceFilterChange} id="product-filter-dashboad-pricefilter-min" name="product-filter-dashboad-pricefilter-min" />
      <label htmlFor='product-filter-dashboad-pricefilter-max'>
        Max
      </label>
      <input type="number" value={priceFilter.max} onChange={handlePriceFilterChange} id="product-filter-dashboad-pricefilter-max" name="product-filter-dashboad-pricefilter-max" />
      <label htmlFor='product-filter-dashboard-sort-filter'>
        Select to sort
      </label>
      <select onChange={handleSortOnSelect} id="product-filter-dashboard-sort-filter" name="product-filter-dashboard-sort-filter">
        <option value="none">
          No sort applied
        </option>
        {SORT_FILTERS.map((sortType) => {
          return (
            <option key={sortType} value={sortType}>
              {sortType}
            </option>
          )
        })}
      </select>
      <div>
        {selectedProduct && (
          <p>
            {selectedProduct.name} - {selectedProduct.category} - ${selectedProduct.price}
          </p>
        )}
        <ul>
          {itemsToSort.map((product) => {
            
            return (
              <li key={product.id} value={product.name} onClick={() => handleProductOnClick(product)}>
                {product.name} - {product.category} - ${product.price}
              </li>
            )
        })}
        </ul>
      </div>
    </div>
  )
};

export default ProductFilterDashboard