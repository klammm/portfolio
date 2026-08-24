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
-   price filter
-   sort dropdown
-   selected product
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

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

export const ProductFilterDashboard = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const itemsToRender = PRODUCTS.filter(product => {
    const searchInputMatch = product.name.toLowerCase().includes(searchInput.toLowerCase());
    const categoryFilterMatch = selectedCategory === '' || product.category === selectedCategory; 
    return searchInputMatch && categoryFilterMatch;
  });

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleOnCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div>
      <h1>Product Filter Dashboard</h1>
      <input type="text" value={searchInput} onChange={handleSearchInputChange} id="product-filter-dashboard-search-input" name="product-filter-dashboard-search-input" placeholder="Start typing to search a product" />
      <select onChange={handleOnCategorySelect}>
        <option value="">Show all categories</option>
        {categoryList.map((category) => {
          return (
            <option key={category} value={category}>
              {category}
            </option>
          )
        })}
      </select>
      <div>
        <ul>
          {itemsToRender.map((product) => {
            
            return (
              <li key={product.id}>
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