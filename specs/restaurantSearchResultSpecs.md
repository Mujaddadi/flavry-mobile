# Restaurant Search Results Spec

Flavry is a food discovery and delivery app for UK audiences.

## Goal

Display a scrollable list of restaurant results matching a user's search query or selected restaurant from home screen. 
Clicking the card opens the restaurant detail screen

---

## Sections

### 1. Header Bar

-use common AppHeader

### 2. Results Summary Bar

- Single line of text: `"{N} Search result for {query}"` — small, dark body text
- Sits below the header, above the filter strip

### 3. Filter Strip

- Horizontal row of pill/chip filter buttons:
  1. **Delivery** — filters to a delivery-available restaurant
  2. **Pickup** — filters to pickup-available restaurant
  3. **Offers** — filters to a restaurant with active promotions
  4. **Distance** — opens a price-range selector (sort/filter modal)
- Use the common FilterStrip component

### 4. Restaurant Result List

- Vertically scrollable list of restaurant cards rendered using `FlashList` for performance
- Use the existing `RestaurantCard` component from `common/RestaurantCard.tsx`
- `RestaurantCard` needs two new optional props:
  - `isFavourited?: boolean` — drives the heart icon state (outlined = false, filled = true)
  - `onFavouritePress?: (restaurant: Restaurant) => void` — renders a heart icon in the top-right corner of the card image; tapping calls this handler
  - `accessibilityRole="button"` on the heart; label toggles between `"Add to favourites"` and `"Remove from favourites"`
- Tapping the card body (outside the heart and add-to-cart buttons) navigates to the restaurant detail screen (Out of Scope)
- **Loading state:** 3–4 `SkeletonCard` placeholders while the first page fetches
- **Empty state:** Centred message `"No results found for '{query}'"` with a suggestion to try a different search term
- **Infinite scroll:** `onEndReached` triggers the next page; `onEndReachedThreshold={0.3}`; a loading spinner renders in the list footer while subsequent pages fetch
- `useRestaurantSearch` hook does not exist yet — must be created in `hooks/`

### 5. Bottom Navigation Bar

- This already exists. No need to add anything

---

## Data and State

- Route params: `query` (string) and/or `category` (string) and/or `restaurant` (string)
- Data fetched via react-query hook (`useRestaurantSearch({ query, filters })`)
- Filter state is a local component state; triggers re-fetch on change
- Favourite state persisted via API call with optimistic update
- Cart state managed in Zustand home store (`incrementCart`)
- Pagination: infinite scroll — fetch next page when the list nears the bottom

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
- Cart screen
- Location picker

