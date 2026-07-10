# Shared Search Filter UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the full filter UI shown in the reference image as a shared search filter sheet used by Dish Search, Restaurant Search, and Table Reservation Search.

**Architecture:** Build one shared `SearchFiltersSheet` component and one shared filter state model. Dish Search and Restaurant Search will open it from the existing `common/FilterStrip` Material Icons `filter-list` button. Table Reservation Search will open it from its inline `filter-list` button and from the Price chip. Each screen owns applied filter state and passes it to its existing query hook.

**Tech Stack:** React Native, Expo Router, `@react-native-vector-icons/material-icons`, React Native `Animated`, `Modal`, `Pressable`, `ScrollView`, React Query.

## Global Constraints

- Do not add a new dependency for sliders or bottom sheets.
- Use `MaterialIcons` for all icons, including the launcher icon `filter-list`.
- Keep the visual language aligned with the reference: white sheet, orange header, rounded chips, selected orange outlines/fills, two-column option grids.
- Preserve existing Date, Time, Party size picker behavior in `common/ReservationPickers`.
- Do not reintroduce visible money references on table reservation result cards.
- The shared filter sheet may include a price range control because the reference UI includes it, but table reservation cards must not show prices.
- All new controls need `accessibilityRole`, meaningful `accessibilityLabel`, and selected state where applicable.

---

## Current Code Map

- `common/FilterStrip/FilterStrip.tsx`
  - Used by `screens/DishSearch/DishSearch.tsx` and `screens/RestaurantSearch/RestaurantSearch.tsx`.
  - Already renders a trailing `MaterialIcons name="filter-list"` button.
  - Existing prop is `onSortPress`; this should remain compatible, but the implementation will use it to open the full filter sheet.

- `screens/DishSearch/DishSearch.tsx`
  - Owns `activeFilters: string[]` and passes them to `useDishSearch`.
  - Needs to own shared `SearchFilterState` and pass it to `useDishSearch`.

- `screens/RestaurantSearch/RestaurantSearch.tsx`
  - Owns `activeFilters: string[]` and passes them to `useRestaurantSearch`.
  - Needs to own shared `SearchFilterState` and pass it to `useRestaurantSearch`.

- `screens/TableReservationSearch/TableReservationSearch.tsx`
  - Owns date, time, party size, favourite IDs, selected time slots, and reservation picker state.
  - Has an inline filter row with a no-op `Price` chip and no-op `filter-list` button.
  - Needs to own shared `SearchFilterState` and pass it to `useTableReservationSearch`.

- `common/ReservationPickers/index.tsx`
  - Existing modal pattern for date/time/party-size selection.
  - Use as the reference for overlay, backdrop, bottom sheet shape, and close behavior.

- `common/AddToCartButton/AddToCartButton.tsx`
  - Existing `Animated.spring` press feedback pattern.
  - Use this pattern for filter option chip and apply/reset button press feedback.

- `types/home.ts`
  - Contains `DishSearchParams`, `RestaurantSearchParams`, `Dish`, and `Restaurant`.
  - Needs shared filter params for dish and restaurant search.

- `types/reservation.ts`
  - Contains `TableReservationSearchParams` and `ReservationRestaurant`.
  - Needs shared filter params for reservation search.

- `apis/home.ts`
  - Mock dish and restaurant search APIs currently ignore structured filters.

- `apis/reservations.ts`
  - Mock table reservation search API currently ignores structured filters.

---

## Shared Data Model

Create `types/searchFilters.ts`:

```ts
export type SearchFilterContext = "dish" | "restaurant" | "reservation";

export type SearchServiceFilter =
  | "digitalMenu"
  | "pickup"
  | "onlineOrdering"
  | "tableReservation"
  | "delivery"
  | "restroom"
  | "takeAway"
  | "dineIn"
  | "toilets"
  | "kidsMenu";

export type SearchEnvironmentFilter =
  | "modern"
  | "decent"
  | "fastFood"
  | "comfortable"
  | "clean"
  | "traditional"
  | "aesthetic";

export type SearchSortOption =
  | "recommended"
  | "rating"
  | "distance"
  | "deliveryTime";

export interface SearchFilterState {
  priceRange: [number, number];
  distanceRangeKm: [number, number];
  canDeliver: boolean;
  canPickup: boolean;
  environments: SearchEnvironmentFilter[];
  services: SearchServiceFilter[];
  cuisines: string[];
  sort: SearchSortOption;
}
```

Add constants in the same file:

```ts
export const DEFAULT_SEARCH_FILTERS: SearchFilterState = {
  priceRange: [1, 11999],
  distanceRangeKm: [0, 50],
  canDeliver: false,
  canPickup: false,
  environments: [],
  services: [],
  cuisines: [],
  sort: "recommended",
};
```

For Table Reservation Search, initialize with table reservation selected:

```ts
export const DEFAULT_RESERVATION_FILTERS: SearchFilterState = {
  ...DEFAULT_SEARCH_FILTERS,
  services: ["tableReservation"],
};
```

Extend these interfaces:

```ts
// types/home.ts
export interface DishSearchParams {
  query?: string;
  category?: string;
  filters?: string[];
  searchFilters?: SearchFilterState;
  page?: number;
}

export interface RestaurantSearchParams {
  query?: string;
  category?: string;
  filters?: string[];
  searchFilters?: SearchFilterState;
  page?: number;
}

// types/reservation.ts
export interface TableReservationSearchParams {
  query?: string;
  date?: string;
  time?: string;
  partySize?: number;
  priceRange?: [number, number];
  searchFilters?: SearchFilterState;
  page?: number;
}
```

Add optional mock metadata to `Dish`, `Restaurant`, and `ReservationRestaurant` only if needed for local filtering:

```ts
distanceKm?: number;
canDeliver?: boolean;
canPickup?: boolean;
environments?: SearchEnvironmentFilter[];
services?: SearchServiceFilter[];
cuisines?: string[];
```

---

## Shared Component

Create `common/SearchFilters/SearchFiltersSheet.tsx`.

**Props:**

```ts
import {
  SearchFilterContext,
  SearchFilterState,
} from "types/searchFilters";

interface SearchFiltersSheetProps {
  visible: boolean;
  context: SearchFilterContext;
  value: SearchFilterState;
  onApply: (next: SearchFilterState) => void;
  onReset: () => void;
  onClose: () => void;
  initialSection?: "price" | "sort" | "all";
}
```

**Context behavior:**

- `dish`: show Price Range, Delivery/Pickup, Services, Cuisines, and Sort. Hide Environments if it feels restaurant-only during implementation.
- `restaurant`: show Price Range, Distance Range, Delivery/Pickup, Environments, Services, Cuisines, and Sort.
- `reservation`: show Distance Range, Delivery/Pickup, Environments, Services, Cuisines, and Sort. Price Range may appear to match the reference, but the reservation cards must not display prices.

**Behavior:**

- Render a `Modal` with transparent backdrop.
- Header:
  - Orange background.
  - Close button using `MaterialIcons name="close"`.
  - Title `Filters`.
  - `Reset` text button.
- Top controls:
  - Price Range card with `local-offer` icon, selected range text, and a custom two-thumb range control.
  - Distance Range card with `place` icon, selected range text, and a custom two-thumb range control.
  - `Can Deliver` and `Can Pickup` checkbox rows.
- Sections:
  - `Sort` with `sort` icon.
  - `Environments` with `eco` icon.
  - `Services` with `restaurant` icon.
  - `Cuisines` with `ramen-dining` icon.
- Sections are collapsible with a rotating `keyboard-arrow-down` icon.
- Options render as two-column rounded pills.
- Selected pills have orange border/text and a circular orange `check` icon on the right.
- Footer buttons:
  - `Reset All` outline button with `refresh`.
  - `Apply Filters` solid orange button.

**Animations:**

- Sheet entrance: `Modal animationType="slide"` plus an `Animated.Value` opacity fade on the content container after mount.
- Backdrop: fade from 0 to 1 using `Animated.timing`.
- Option press: spring-scale the pressed pill from `1` to `0.97` then back to `1`, matching `AddToCartButton`.
- Section collapse: animate `maxHeight` and opacity with `Animated.timing`; rotate chevron from `0deg` to `180deg`.
- Apply button: brief scale-down spring on press before calling `onApply`.

---

## Implementation Tasks

### Task 1: Shared Filter Types

**Files:**
- Create: `types/searchFilters.ts`
- Modify: `types/home.ts`
- Modify: `types/reservation.ts`

- [ ] Add `SearchFilterState`, `SearchFilterContext`, option unions, and default filter constants.
- [ ] Add `searchFilters?: SearchFilterState` to `DishSearchParams`, `RestaurantSearchParams`, and `TableReservationSearchParams`.
- [ ] Add optional metadata fields to search result item types only where mock filtering needs them.
- [ ] Run `npx tsc --noEmit`.

### Task 2: Mock API Filtering

**Files:**
- Modify: `apis/home.ts`
- Modify: `apis/reservations.ts`

- [ ] Add metadata to mock dish, restaurant, and reservation restaurant arrays.
- [ ] Add a small shared local helper inside each API file or a new utility if duplication becomes meaningful:

```ts
const matchesSearchFilters = (
  item: {
    price?: number;
    distanceKm?: number;
    canDeliver?: boolean;
    canPickup?: boolean;
    environments?: string[];
    services?: string[];
    cuisines?: string[];
  },
  filters?: SearchFilterState,
) => {
  if (!filters) return true;
  if (filters.canDeliver && !item.canDeliver) return false;
  if (filters.canPickup && !item.canPickup) return false;
  if (item.price && (item.price < filters.priceRange[0] || item.price > filters.priceRange[1])) return false;
  if (item.distanceKm && (item.distanceKm < filters.distanceRangeKm[0] || item.distanceKm > filters.distanceRangeKm[1])) return false;
  if (filters.environments.length && !filters.environments.some((e) => item.environments?.includes(e))) return false;
  if (filters.services.length && !filters.services.some((s) => item.services?.includes(s))) return false;
  if (filters.cuisines.length && !filters.cuisines.some((c) => item.cuisines?.includes(c))) return false;
  return true;
};
```

- [ ] Apply filtering before pagination in `fetchDishSearch`, `fetchRestaurantSearch`, and `fetchTableReservationSearch`.
- [ ] Apply simple sort behavior for `rating`, `distance`, and `deliveryTime` where mock fields exist; leave `recommended` as original order.
- [ ] Run `npx tsc --noEmit`.

### Task 3: Shared Filter Sheet Component

**Files:**
- Create: `common/SearchFilters/SearchFiltersSheet.tsx`
- Create: `common/SearchFilters/index.ts`

- [ ] Implement modal shell, header, sections, option grid, range cards, checkboxes, and footer buttons.
- [ ] Use `context` to decide which sections render for dish, restaurant, and reservation.
- [ ] Keep all styles in `StyleSheet.create`.
- [ ] Use `Colors`, `FontSizes`, `Spacing`, `wp`, and `hp`.
- [ ] Use only `MaterialIcons` icons.
- [ ] Implement the animations listed above.
- [ ] Export the component from `common/SearchFilters/index.ts`.

### Task 4: Integrate Dish Search

**Files:**
- Modify: `screens/DishSearch/DishSearch.tsx`

- [ ] Import `SearchFiltersSheet` and `DEFAULT_SEARCH_FILTERS`.
- [ ] Add `filtersVisible`, `filtersInitialSection`, and `searchFilters` state.
- [ ] Pass `searchFilters` to `useDishSearch`.
- [ ] Update `FilterStrip onSortPress` to open the shared sheet with `context="dish"`.
- [ ] Render `SearchFiltersSheet` near the bottom of the screen tree.
- [ ] Keep existing chip toggles working until replaced by structured filters in a later cleanup.

### Task 5: Integrate Restaurant Search

**Files:**
- Modify: `screens/RestaurantSearch/RestaurantSearch.tsx`

- [ ] Import `SearchFiltersSheet` and `DEFAULT_SEARCH_FILTERS`.
- [ ] Add `filtersVisible`, `filtersInitialSection`, and `searchFilters` state.
- [ ] Pass `searchFilters` to `useRestaurantSearch`.
- [ ] Update `FilterStrip onSortPress` to open the shared sheet with `context="restaurant"`.
- [ ] Render `SearchFiltersSheet` near the bottom of the screen tree.
- [ ] Keep existing chip toggles working until replaced by structured filters in a later cleanup.

### Task 6: Integrate Table Reservation Search

**Files:**
- Modify: `screens/TableReservationSearch/TableReservationSearch.tsx`

- [ ] Import `SearchFiltersSheet` and `DEFAULT_RESERVATION_FILTERS`.
- [ ] Add `filtersVisible`, `filtersInitialSection`, and `searchFilters` state.
- [ ] Pass `searchFilters` to `useTableReservationSearch`.
- [ ] Update the inline `Price` chip to open the shared sheet with `initialSection="price"`.
- [ ] Update the inline `filter-list` button to open the shared sheet with `initialSection="all"`.
- [ ] Render `SearchFiltersSheet` with `context="reservation"`.

### Task 7: Tests

**Files:**
- Create: `tests/SearchFiltersSheet.test.tsx`
- Create or modify: `tests/DishSearchFilters.test.tsx`
- Create or modify: `tests/RestaurantSearchFilters.test.tsx`
- Create or modify: `tests/TableReservationFilters.test.tsx`

- [ ] Test the shared sheet renders `Filters`, `Sort`, `Services`, and `Cuisines`.
- [ ] Test selected pills toggle on press and show selected state.
- [ ] Test `Reset` clears selected options.
- [ ] Test `Apply Filters` calls `onApply` and closes in each integrated screen.
- [ ] Test Dish Search opens the sheet from `FilterStrip` `filter-list`.
- [ ] Test Restaurant Search opens the sheet from `FilterStrip` `filter-list`.
- [ ] Test Table Reservation Search opens the sheet from its inline `filter-list`.
- [ ] Use `--watchman=false` in test commands because Watchman can fail under sandbox permissions.

### Task 8: Verification

Run:

```bash
npx tsc --noEmit
npx tsc -p tests/tsconfig.json --noEmit
npm test -- tests/SearchFiltersSheet.test.tsx --runInBand --watchman=false
npm test -- tests/DishSearchFilters.test.tsx --runInBand --watchman=false
npm test -- tests/RestaurantSearchFilters.test.tsx --runInBand --watchman=false
npm test -- tests/TableReservationFilters.test.tsx --runInBand --watchman=false
npm run lint
```

Expected:

- App TypeScript exits 0.
- Test TypeScript exits 0.
- New filter tests pass.
- Lint exits 0.
- Manual UI check confirms:
  - Dish Search opens the filter sheet from `filter-list`.
  - Restaurant Search opens the filter sheet from `filter-list`.
  - Table Reservation Search opens the filter sheet from `filter-list`.
  - Reservation Price chip opens the same sheet at the price section.
  - Sheet animates in and out.
  - Section chevrons rotate and sections collapse/expand.
  - Selected option pills animate and show checkmarks.
  - `Apply Filters` updates result count.
  - `Reset All` restores default filters.

---

## Self-Review

- The plan now covers Dish Search, Restaurant Search, and Table Reservation Search.
- The filter UI is shared under `common/SearchFilters`, not reservation-specific.
- Existing `FilterStrip` remains the integration point for Dish and Restaurant search.
- The reservation inline `filter-list` remains the integration point for Table Reservation search.
- The plan uses existing project patterns: `Modal`, `MaterialIcons`, `StyleSheet.create`, theme tokens, React Query params, and spring press animation.
- The plan does not reintroduce table reservation card money text.
