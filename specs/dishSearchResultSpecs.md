# Dish Search Results Spec

Flavry is a food discovery and delivery app for UK audiences.

## Goal

Display a scrollable list of dish results matching a user's search query or selected category. Allow the user to filter results, favourite dishes, and add items to their cart directly from the list.

---

## Sections

### 1. Header Bar

- Orange (`primary`) background
- **Left:** Screen title "Dishes" — white, bold
- **Centre:** Search bar with placeholder "Search for dishes" and a search icon on the right
  - Pre-filled with the incoming query param
  - Submitting a new query re-fetches results
  - Input is sanitised (strip HTML tags, trim, max 100 chars)
  - `accessibilityLabel="Search dishes"`
- **Right:** Cart icon with item-count badge; badge hidden when cart is empty
  - `accessibilityRole="button"`
  - `accessibilityLabel="Cart, N item(s)"`

### 2. Results Summary Bar

- Single line of text: `"{N} Search result for {query}"` — small, dark body text
- Sits below the header, above the filter strip

### 3. Filter Strip

- Horizontal row of pill/chip filter buttons:
  1. **Delivery** — filters to delivery-available dishes
  2. **Pickup** — filters to pickup-available dishes
  3. **Offers** — filters to dishes with active promotions
  4. **Price** — opens a price-range selector (sort/filter modal)
- Active filter chip has a filled/highlighted state; Orange (`primary`)
- Inactive filter chip has an outlined state; light (`primaryLight`)
- A sort icon (three horizontal lines) sits at the far right; tapping opens the sort/filter sheet
- Horizontal scroll if chips overflow the screen width
- `accessibilityRole="button"` on each chip; `accessibilityState={{ selected: true/false }}`
- This should be added to the common component library

### 4. Dish Result List

- Vertically scrollable list of dish cards rendered using `FlashList` for performance
- Use the existing `DishCard` component from `common/DishCard.tsx`
- `DishCard` needs two new optional props:
  - `isFavourited?: boolean` — drives the heart icon state (outlined = false, filled = true)
  - `onFavouritePress?: (dish: Dish) => void` — renders a heart icon in the top-right corner of the card image; tapping calls this handler
  - `accessibilityRole="button"` on the heart; label toggles between `"Add to favourites"` and `"Remove from favourites"`
- Tapping the card body (outside the heart and add-to-cart buttons) navigates to the dish detail screen (Out of Scope)
- **Loading state:** 3–4 `SkeletonCard` placeholders while the first page fetches
- **Empty state:** Centred message `"No results found for '{query}'"` with a suggestion to try a different search term
- **Infinite scroll:** `onEndReached` triggers the next page; `onEndReachedThreshold={0.3}`; a loading spinner renders in the list footer while subsequent pages fetch
- `useDishSearch` hook does not exist yet — must be created in `hooks/`

### 5. Bottom Navigation Bar

- This already exists. No need to add anything

---

## Data and State

- Route params: `query` (string) and/or `category` (string) and/or `dish` (string)
- Data fetched via react-query hook (`useDishSearch({ query, category, filters })`)
- Filter state is local component state; triggers re-fetch on change
- Favourite state persisted via API call with optimistic update
- Cart state managed in Zustand home store (`incrementCart`)
- Pagination: infinite scroll — fetch next page when list nears the bottom

---

## Accessibility

- All interactive elements have `accessibilityLabel` and `accessibilityRole`
- Text scales with system font size (`allowFontScaling` not disabled)
- Minimum touch target 44x44 pt for all buttons and icons
- Filter chips expose `accessibilityState={{ selected }}`
- Skeleton cards hidden from screen readers (`accessibilityElementsHidden`, `importantForAccessibility="no-hide-descendants"`)

---

## Security Requirements

use security.md for security requirements

---

## Colour Design Tokens

Use theme.ts for color values

---

### Performance

- Result list use FlashList (not FlatList/ScrollView)
- Images use lazy loading with a placeholder colour
- react-query cache avoids redundant network requests on re-focus

---

### Responsiveness

- Layout uses percentage-based Dimensions (`wp`, `hp` utils) — no hardcoded pixel values
- All sections reflow correctly from 320px to 428px screen widths

---

## Constraints

- Tech stack: Expo, React Native, TypeScript, react-query, FlashList, Zustand, react-hook-form, zod
- No new npm dependencies without approval
- No inline StyleSheet objects
- Animations via react-native-reanimated only
- Types in `types/` folder
- The page navigation is already there, so don't add any
- The Bottom Tab Bar is already there, so don't add any
- Add tests for search result screen

---

## Out of Scope

- Dish detail screen (navigated to on card tap)
- Cart screen
- Location picker
- Restaurant search results (separate screen)
