# Home Page Spec

Flavry is a food discovery and delivery app for UK audiences.
Figma reference: https://www.figma.com/design/ty7JcXnIk2GWdi5Nv6NlC7/UIs?node-id=0-1

## Goal

Allow users to discover dishes and restaurants, search for food, browse categories, view promotions, and add items to their cart — all from a single scrollable home screen.

---

## Sections

### 1. Header Bar

- Orange background (`primary` colour token)
- **Left:** Location icon + selected address label (e.g. "Nuijavuori 2"); tapping opens location picker
- **Right:** Cart icon with item-count badge; tapping navigates to cart screen
- Badge hidden when cart is empty

### 2. Logo & Tagline

- Multicolour "Flavry" wordmark (static asset from `assets/`)
- Subtitle: "Because we love food" — centred, secondary text style

### 3. Search

- Text input with placeholder "Search dishes"
  - `accessibilityLabel="Search dishes"`
  - Input is sanitised before submission (strip HTML/script tags, trim whitespace, max 100 chars)
  - On submit navigates to search results screen with query as route param
- Orange (primary colour token) "Search" button below the input; disabled when input is empty
- Custom toggle switch below the button — switches between Delivery and Pickup mode
  - **Two states:**
    - **Delivery (active):** `primary` orange background; thumb shows delivery scooter icon
    - **Pickup (inactive):** Light salmon/muted background (`gray5` token); thumb shows house icon
  - Thumb contains an icon (not just a circle) — icon swaps on state change
  - Tapping toggles between the two states; triggers re-fetch of relevant listings
  - State stored in Zustand home store (`deliveryMode: 'delivery' | 'pickup'`)
  - `accessibilityLabel` updates dynamically: `"Switch to pickup"` when in delivery mode, `"Switch to delivery"` when in pickup mode
  - `accessibilityRole="switch"`

### 4. Category Strip

- Horizontal scrollable list of food category cards
- Each card: square image thumbnail + category label below
- Categories fetched from API via react-query (`useCategories`)
- Tapping a category navigates to search results filtered by that category
- Minimum 4 visible categories; scroll to reveal more
- `accessibilityRole="button"` on each card
- Loading state: skeleton cards (4 placeholders)
- Empty state: hide section

### 5. Promotional Banner Carousel

- Full-width auto-playing image carousel
- Banners fetched from API via react-query (`usePromoBanners`)
- Dot pagination indicator below
- Auto-advances every 4 seconds; pauses on user interaction
- Tapping a banner opens the linked offer/screen
- `accessibilityLabel` set from banner `title` field
- Loading state: single skeleton banner at full width
- Empty state: hide section

### 6. Favourite Dishes

- Section heading: "Favourite Dishes"
- Horizontal carousel of dish cards (FlashList, horizontal)
- Dot pagination below
- Each dish card contains:
  - Discount badge (e.g. "Rs 50 off") — shown only when `discount` is present; orange pill
  - Food image (lazy-loaded)
  - Dish name (bold)
  - Restaurant name (secondary text)
  - Price (right-aligned, primary colour)
  - "Add to cart" button — triggers add-to-cart action; requires auth (redirect to login if unauthenticated)
  - Delivery time (e.g. "20-25 min") with delivery icon
- Data fetched via react-query (`useFavouriteDishes`)
- Loading state: 2 skeleton cards
- Empty state: hide section

### 7. Favourite Restaurant

- Section heading: "Favourite Restaurant"
- Horizontal carousel of restaurant cards (FlashList, horizontal)
- Dot pagination below
- Each restaurant card contains:
  - Delivery discount badge (e.g. "2.5k off delivery") — shown only when present (In the UI it is wrong. Make it similar to Favourite dishes)
  - Restaurant image (lazy-loaded)
  - Restaurant name (bold)
  - Tagline / description (secondary text, 1 line, ellipsised)
  - Delivery time with delivery icon
- Tapping a card navigates to the restaurant detail screen
- `accessibilityRole="button"` on each card
- Data fetched via react-query (`useFavouriteRestaurants`)
- Loading state: 2 skeleton cards
- Empty state: hide section

### 8. Popular Restaurant

- Section heading: "Popular Restaurant"
- Identical card layout and behavior to Favourite Restaurant (§7)
- Data fetched via react-query (`usePopularRestaurants`)
- Loading state and empty state: same as §7

### 9. Bottom Tab Bar

Five tabs (icons from `@react-native-vector-icons/material-design-icons`):

| Tab          | Icon                    | Screen       |
| ------------ | ----------------------- | ------------ |
| Search       | `magnify`               | Search       |
| Orders       | `receipt`               | Orders       |
| Restaurants  | `silverware-fork-knife` | Restaurants  |
| Reservations | `calendar`              | Reservations |
| Profile      | `account`               | Profile      |

- Active tab highlighted in primary colour
- `accessibilityRole="tab"` on each item

---

## Functional Requirements

- Search input sanitized and validated before navigation (no XSS-risk content passed as route params)
- Cart actions require authenticated session; unauthenticated users are redirected to login
- Carousel pagination dots reflect the current index accurately
- Delivery/pickup toggle persists for the session (Zustand)
- All API calls use react-query with stale-while-revalidate; errors show a toast, not a crash

## Non-Functional Requirements

### Responsiveness

- Layout uses percentage-based Dimensions (`wp`, `hp` utils) — no hardcoded pixel values
- All sections reflow correctly from 320px to 428px screen widths

### Accessibility

- `allowFontScaling` must NOT be disabled on any `Text` component
- All interactive elements have `accessibilityLabel` and `accessibilityRole`
- Minimum touch target: 44×44pt on all buttons and tappable cards
- Colour contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large text

### Performance

- Carousels use FlashList (not FlatList/ScrollView)
- Images use lazy loading with a placeholder colour
- react-query cache avoids redundant network requests on re-focus

## Security Requirements

use security.md for security requirements

## Colour Design Tokens

Use colors.md for color values

## Constraints

- Tech stack: Expo, React Native, TypeScript, unistyles, react-query, FlashList, Zustand, react-hook-form, zod
- No new npm dependencies without approval
- Styles via unistyles only (no inline StyleSheet objects)
- Animations via react-native-reanimated only
- Types in `types/` folder
- The page navigation is already there, so don't add any
- The Bottom Tab Bar is already there, so don't add any
