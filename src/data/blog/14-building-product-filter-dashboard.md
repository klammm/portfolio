---

title: "Building a Product Filter Dashboard"
date: "2026-08-20"
excerpt: "Search, category filter, price filter, and sort demo using Pokemon and One Piece Trading Cards as part of my interview prep."
tags: ["react", "interview-prep"]
demo: "product-filter-dashboard"
--------------------------------

Day 1 of a study plan I'm working through: build a product filter dashboard from scratch, with local component state only. No state management library, no UI kit.

I've been laid off since the beginning of this year, and one of my main goals right now is to join a startup in San Francisco. I've been doing a lot of interview prep, but I've realized that there's a difference between knowing React concepts and being able to actually build something from scratch while someone is sitting there watching you.

When I'm coding by myself, it's completely fine to get stuck. I can make a mistake, stare at it for ten minutes, Google something, read the React docs, and eventually figure it out. That's part of how I normally learn.

An interview is obviously different.

You're trying to remember syntax, reason about your state, explain your decisions, listen to another person, and debug something that isn't working, all while you're nervous and someone is watching you. I've realized that being able to implement React fundamentals under those conditions is a skill in itself.

So I'm revisiting a lot of the fundamentals that I already "know."

And Day 1 immediately exposed some gaps.

The exercise was pretty simple. Build a product filter dashboard with:

* Search
* Category filtering
* Min/max price filtering
* Sorting
* Selecting a product
* Loading and empty states
* URL query parameters
* A reset button

The constraints were intentionally simple:

* Keep state as local as reasonably possible.
* Avoid duplicated or derived state.
* No state management library.
* No UI component library.

The live version is embedded below. I've been using Pokémon and One Piece trading cards for the data because, honestly, it's a lot more interesting than looking at a list of keyboards and office chairs.


## Day 1

### Build exercise: Product Filter Dashboard

The actual exercise wasn't particularly complicated, but I got tripped up on several things that I thought I already understood.

That's probably the most useful part of this exercise.

I wasn't learning React from scratch. I was finding the places where my mental model of React wasn't quite as solid as I thought it was.

---

## 1. I was putting derived data into state

The first thing I got stuck on was the search input and rendering the filtered list of products.

My first instinct was to put the products into state and then use a `useEffect` that would run whenever the search query changed. Inside that effect, I would filter the products and then call `setState` with the filtered results.

Something along the lines of:

```tsx
useEffect(() => {
  const filteredProducts = products.filter(...);

  setFilteredProducts(filteredProducts);
}, [searchInput]);
```

At first this seemed reasonable to me.

The search input changes, that's a side effect, so I should use an effect.

But this was me overcomplicating something that didn't need to be complicated.

The filtered products aren't really state.

They're derived from state.

The actual user input is the search string. The products are my source data. The filtered list is just the result of combining those two things.

So instead of:

```tsx
const [searchInput, setSearchInput] = useState('');
const [products, setProducts] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]);
```

I really only need:

```tsx
const [searchInput, setSearchInput] = useState('');
const [products, setProducts] = useState([]);
```

Then:

```tsx
const filteredProducts = products.filter(product =>
  product.name
    .toLowerCase()
    .includes(searchInput.toLowerCase())
);
```

That's it.

No `useEffect`.

No additional state.

No synchronization problem.

This was probably the biggest lesson from the exercise.

**State should represent something that can change independently. Derived data should usually just be derived.**

I think I tend to overcomplicate state because I'm thinking about all the different things that are happening on the screen instead of thinking about what the actual source of truth is.

---

## 2. My initial category state was confusing me

I also got stuck with the category filter.

I had:

```tsx
const [selectedCategory, setSelectedCategory] = useState('');
```

Then I was filtering with something like:

```tsx
product.category === selectedCategory
```

The problem is that an empty string means "no category has been selected."

But `product.category === ''` is obviously false for every product.

So my application initially rendered an empty list.

I was mixing up the concept of the **initial state** with the actual filtering logic.

The fix was pretty simple:

```tsx
const categoryFilterMatch =
  selectedCategory === '' ||
  product.category === selectedCategory;
```

Now there are two possible cases:

1. No category is selected, so everything matches.
2. A category is selected, so only that category matches.

This wasn't really a React problem. It was a logic problem.

I was just forgetting to explicitly account for the "no filter applied" case.

---

## 3. My price filter was becoming one giant boolean

The price filter was probably the best example of me trying to be clever instead of making the code easier to reason about.

I originally tried something like:

```tsx
const priceFilterMatch =
  (priceFilter.min === 0 && priceFilter.max === 0) ||
  (priceFilter.min <= product.price &&
    priceFilter.max > product.price) ||
  priceFilter.min <= product.price ||
  priceFilter.max > product.price;
```

Looking at this now, it's pretty obvious that I made this harder than it needed to be.

There were too many `||` conditions and too many cases being handled at once.

I was trying to solve the entire problem inside one boolean expression.

The better approach was to break the problem into smaller questions:

```tsx
const matchesMinPrice =
  priceFilter.min === 0 ||
  priceFilter.min <= product.price;

const matchesMaxPrice =
  priceFilter.max === 0 ||
  priceFilter.max >= product.price;

const priceFilterMatch =
  matchesMinPrice && matchesMaxPrice;
```

This is much easier to reason about.

Does the product satisfy the minimum?

Does the product satisfy the maximum?

If both are true, the product is within the range.

This was a good reminder that writing more conditions into one line doesn't make the code smarter. Sometimes it just makes the code harder to understand.

---

## 4. I was mutating the array with `sort()`

The sort filter was another one that confused me.

I could get ascending and descending sorting to work, but when I selected "none" again, the list wouldn't return to the original order.

My initial implementation was essentially:

```tsx
const sortedItems =
  sortFilter === 'asc'
    ? itemsToRender.sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    : itemsToRender.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
```

The problem is `sort()` mutates the array.

So even though I thought of `itemsToRender` as my original list, I had already changed it.

The fix was to make a copy first:

```tsx
const itemsToSort =
  sortFilter === 'none'
    ? itemsToRender
    : [...itemsToRender].sort((a, b) =>
        sortFilter === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
```

The important part is:

```tsx
[...itemsToRender]
```

I'm creating a new array and sorting that instead of mutating the original.

This was another one of those concepts I knew theoretically but wasn't thinking about while actually writing the code.

---

# React state has been the biggest theme so far

The product filter exercise made me realize that most of the things I'm struggling with right now aren't really syntax problems.

They're state modeling problems.

I tend to overcomplicate state.

I think about everything that appears on the screen and instinctively want to put it into state.

But that's usually the wrong way to think about it.

A better question is:

**What actually needs to be state?**

If something can be calculated from existing state and props, I probably don't need another state variable for it.

For this dashboard, the source of truth can be pretty small:

```tsx
searchInput
selectedCategory
priceFilter
sortFilter
products
selectedProduct
isLoading
```

Everything else can be derived.

The filtered products don't need their own state.

The sorted products don't need their own state.

The result count doesn't need its own state.

The category list doesn't need its own state.

They're all just different views of the existing data.

This is probably the biggest thing I'm taking away from Day 1.

**State is best when it's simple and represents something that can actually change.**

And then React can react, pun intended, to those changes and render everything else from that source of truth.

Putting more things into state doesn't necessarily make the application easier to manage. In a lot of cases, it makes it harder because now you have to keep multiple pieces of state synchronized.

---

# State mutation and nested objects

After the dashboard, I also went through some of the [React state exercises on react.dev website](https://react.dev/learn/adding-interactivity) around updating objects.

This is another area where I know the rule:

> Don't mutate objects or arrays in state.

But actually implementing it is different.

One of the exercises involved a shape with a nested `position` object:

```tsx
const [shape, setShape] = useState({
  color: 'orange',
  position: {
    x: 0,
    y: 0,
  },
});
```

My first instinct was to update the nested values directly.

Something like:

```tsx
shape.position.x += dx;
shape.position.y += dy;
```

But that's mutating the existing state object.

Instead, I need to create new objects at each level that I'm changing:

```tsx
setShape(prevShape => ({
  ...prevShape,
  position: {
    ...prevShape.position,
    x: prevShape.position.x + dx,
    y: prevShape.position.y + dy,
  },
}));
```

This is one of those React concepts that sounds very simple when someone explains it to you.

"Don't mutate state. Create a new object."

But once you start dealing with objects inside objects, arrays containing objects, or objects containing arrays, it becomes much easier to get confused.

That's something I want to keep practicing.

---

# What confused me?

There were a few recurring themes.

### 1. Updating objects and lists in state

Especially when objects are nested inside other objects or when I need to update a specific item inside an array.

The basic rule is easy.

Actually applying it without accidentally mutating something is harder.

### 2. Removing duplicate state

I kept wanting to store the result of something instead of storing the thing that produces the result.

For example, instead of:

```tsx
items
selectedItems
```

sometimes all I need is:

```tsx
items
selectedIds
```

Then I can derive which items are selected from the IDs.

### 3. Nested trees in React state

The deeper the state structure gets, the harder it becomes to reason about immutable updates.

This makes me want to think more carefully about whether the state structure itself needs to be that complicated.

### 4. Multiple selection

I initially wasn't sure how to toggle multiple selected items.

I was thinking about modifying something like:

```tsx
{
  id: '1',
  name: 'Pikachu',
  isStarred: true
}
```

But again, I was adding more state than necessary.

A much simpler approach is to keep a list of selected IDs:

```tsx
const [selectedIds, setSelectedIds] = useState<string[]>([]);
```

Then when an ID is toggled:

```tsx
setSelectedIds(prev => {
  if (prev.includes(toggledId)) {
    return prev.filter(id => id !== toggledId);
  }

  return [...prev, toggledId];
});
```

Now the logic is straightforward:

* If it's already selected, remove it.
* If it's not selected, add it.

I was trying to modify the objects themselves when I really just needed to keep track of the IDs.

Again, simplify the state.

---

# What did I initially get wrong?

The biggest misconception was probably that I thought I needed to use state for more things than I actually did.

I was thinking:

> "This thing changes on the screen, therefore it should probably be state."

But that's not really the right mental model.

A better question is:

> "Does this value need to be independently stored because it can change independently?"

If the answer is no, it might just be derived data.

The product filter was a perfect example.

The user changes the search input.

That input is state.

The filtered product list changes as a consequence.

That doesn't mean the filtered list needs to become state.

The same applies to selected items. If I have a list of products and a set of selected IDs, I don't necessarily need another `selectedProducts` array.

The less state I have, the fewer things I have to keep synchronized.

---

# What could I implement without help?

I was able to build most of the product filter dashboard myself, including:

* Search
* Category filtering
* Min/max price filtering
* Sorting
* Product selection
* Loading state
* Empty state
* URL search parameters
* Resetting filters
* Responsive styling

Where I needed the most help was debugging my mental model rather than writing the actual code.

That's probably an important distinction for me.

I don't feel like I need to spend all my time memorizing React syntax.

I need more practice taking a requirement, deciding what the source of truth should be, modeling the state, and then implementing it cleanly.

That's exactly the kind of thing that becomes harder when you're in an interview and someone is watching you.

---

# What should receive more time tomorrow?

State.

Specifically:

* State ownership
* Derived state
* Lifting state
* Updating arrays and objects
* Nested state
* Avoiding duplicate state
* Multiple selection
* When to use `useEffect` versus when you absolutely don't need it

I also want to practice building these things without looking at an existing implementation first.

That's probably the part that will help me most with interviews.

It's one thing to read:

> "Don't store derived state."

It's another thing entirely to sit in front of someone, get a blank editor, and immediately recognize:

> "Wait, I don't need another state variable here. I can derive this."

That's the skill I'm actually trying to build.

And I think that's what this study plan is going to be useful for.

Not learning React again from scratch, but finding the places where I *think* I understand React and forcing myself to actually prove it by building things from scratch.
