# Restaurant Detail Spec

Flavry is a food discovery and delivery app for UK audiences.

## Goal

Display the full detail page for a selected restaurant — hero image, info, delivery details, promotions, full menu grouped by category — and allow users to favourite dishes, add items to cart, and make a reservation.

---

## Sections

### 1. Header Bar

- Orange (`primary`) background
- **Left:** Restaurant name — white, bold (e.g. "McDonald Espoo")
- **Right:** Cart icon with item-count badge; tapping navigates to the cart screen
  - Badge hidden when cart is empty
  - `accessibilityRole="button"`, `accessibilityLabel="Cart, {count} items"`

---

### 2. Hero Image

- Full-width image of the restaurant or featured dish, spanning edge-to-edge
- Image height: `hp(28)` (≈28% of screen height)
- Lazy-loaded with a `gray5` placeholder background
- **Favourite icon** — heart icon in the top-right corner of the image
  - Outlined heart when not favourited; filled (`primary`) when favourited
  - White icon on a semi-transparent dark circular background for legibility
  - `accessibilityRole="button"`
  - `accessibilityLabel` toggles: `"Add to favourites"` / `"Remove from favourites"`
  - Tapping calls `onFavouritePress`; requires auth — redirects to login if unauthenticated

---

### 3. Restaurant Info Row

- **Left column:**
  - Restaurant name — bold, `black1`, large text (e.g. "McDonald Espoo")
  - Address — `gray2`, medium text (e.g. "Kauniasitentie")
  - Status badge — small outlined pill with `gray4` border and `gray2` text (e.g. "Closed") or `primary` text (e.g. "Open")
- **Right (top-right):**
  - Share icon — tapping opens the native share sheet with the restaurant deep-link
    - `accessibilityRole="button"`, `accessibilityLabel="Share this restaurant"`
- Light dashed horizontal divider below this section

---

### 4. Delivery Info Row

- Dashed border container (`gray4`)
- Row 1: Delivery scooter icon (`primary`) + "Delivery {min}–{max} minutes" text (`black2`)
- Row 2: "Delivery charges Rs. {fee}" (left, `gray2`) | "{distance} km away" (right, `gray2`)
- Row 3: "Rs {minimumOrder} minimum order" — `gray3`, small text
- Light dashed horizontal divider below this section

---

### 5. Promotions Strip

- Horizontally scrollable row of promotion badge pills
- Each pill: tag icon (`primary`) + label (e.g. "Rs 50 off") — `primary` background-tinted or outlined pill
- Fetched from API — render only when promotions are present; hide section when empty
- Dashed border container (`gray4`)
- Light dashed horizontal divider below this section

---

### 6. Menu

The menu is grouped into named categories (e.g. "Burgers", "Garnish"). Each category is rendered as a titled section followed by a list of dish items. All sections are rendered inside a single `ScrollView` (not nested scrolling).

#### 6a. Category Heading

- Category name — bold, `black1`, large text (e.g. "Burgers")
- Rendered as a full-width row; acts as a visual separator between category blocks

#### 6b. Dish Item Row

Each dish in the category is a row with dashed border divider below:

- **Left / centre (text content):**
  - Dish name — bold, `black1` (e.g. "Big Mac")
  - Price — `primary` orange, bold (e.g. "Rs: 850")
  - Description — `gray3`, small text, max 2 lines, ellipsised (e.g. "Big Mac Plus meal and Double ...")
- **Right (image + actions):**
  - Square thumbnail image, rounded corners (`wp(20)` × `wp(20)`)
  - Lazy-loaded with `gray5` placeholder
  - **Heart icon** — top-right of image; outlined when not favourited, filled (`primary`) when favourited
    - `accessibilityRole="button"`, `accessibilityLabel` toggles: `"Add {dishName} to favourites"` / `"Remove {dishName} from favourites"`
    - Requires auth — redirects to login if unauthenticated
  - **Orange `+` button** — bottom-right of image; circular, `primary` background, white icon
    - Tapping navigates to the Dish Detail screen for that dish
    - `accessibilityRole="button"`, `accessibilityLabel="Add {dishName} to cart"`

---

### 7. Restaurant Detail Footer

Rendered below the last menu category, inside the scroll view:

- Heading: "Restaurant detail" — bold, `black1`
- Row: "Open tomorrow at {time}" or "Open until {time}" (`gray2`, left) | "Show more detail" (`primary`, right)
  - "Show more detail" tapping could open a modal or expand an info section with full restaurant details (hours, address, contact)
  - `accessibilityRole="link"`, `accessibilityLabel="Show restaurant details"`
- Light dashed horizontal divider above this section

---

### 8. Make Reservation Button (sticky)

Pinned to the bottom of the screen, above the tab bar:

- Full-width `primary` orange button, white bold text: "Make reservation"
- Tapping navigates to the Reservation screen (or opens a reservation flow modal)
- `accessibilityRole="button"`, `accessibilityLabel="Make a reservation"`
- Requires auth — redirects to login if unauthenticated

---

### 9. Bottom Navigation Bar

Already exists. Do not add or modify.

---

## Data and State

- Route param: `restaurantId` (string)
- Data fetched via react-query hook `useRestaurantDetail(restaurantId)` — to be created in `hooks/`
- Response shape includes: name, address, image, status (`open` | `closed`), delivery time range, delivery fee, min order, distance, promotions, menu (array of categories, each with array of dishes)
- Favourite (restaurant-level) state: part of restaurant detail payload; toggled via API with optimistic update
- Dish favourite state: part of each dish object in the menu; toggled per dish via API with optimistic update
- Cart state managed in Zustand store (`useCartStore`)

---

## Types

Add to `types/restaurant.ts`:

```typescript
export interface RestaurantDetail {
  id: string;
  name: string;
  address: string;
  image: string;
  status: "open" | "closed";
  deliveryMinMinutes: number;
  deliveryMaxMinutes: number;
  deliveryFee: number;
  minimumOrder: number;
  distanceKm: number;
  openingNote: string; // e.g. "Open tomorrow at 9 AM"
  promotions: Promotion[];
  menu: MenuCategory[];
  isFavourite: boolean;
}

export interface Promotion {
  id: string;
  label: string; // e.g. "Rs 50 off"
}

export interface MenuCategory {
  id: string;
  name: string;
  dishes: MenuDish[];
}

export interface MenuDish {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isFavourite: boolean;
}
```

---

## Accessibility

- All interactive elements have `accessibilityRole` and `accessibilityLabel`
- Text scales with system font size (`allowFontScaling` not disabled)
- Minimum touch target 44×44 pt for all buttons, heart icons, and the `+` button
- Heart icon label updates dynamically based on favourite state
- Status badge communicates open/closed state via text (not colour alone)
- Colour contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large/price text

---

## Security Requirements

See `security.md` for full OWASP requirements.

Additional notes for this screen:

- `restaurantId` route param validated as a non-empty alphanumeric string before use in API call (A03 Injection)
- Share URL constructed from a safe template — no user-supplied content interpolated into URLs
- Cart, favourite, and reservation actions gated behind auth check (A01 Broken Access Control)
- No PII logged to console (A09)

---

## Colour Design Tokens

Use `colors.md` for all token values. Never hardcode hex values.

---

## Performance

- Hero image lazy-loaded with `gray5` placeholder
- Dish thumbnail images lazy-loaded with `gray5` placeholder
- Screen content wrapped in a single `ScrollView`; sticky "Make reservation" button rendered outside it
- Menu categories and dish rows are rendered as a flat list under the `ScrollView` — `FlashList` not needed since the total item count is bounded by a single restaurant's menu
- react-query cache avoids redundant fetches on back-navigation

---

## Responsiveness

- Layout uses percentage-based Dimensions (`wp`, `hp` utils) — no hardcoded pixel values
- All sections reflow correctly from 320 px to 428 px screen widths

---

## Behaviour

- Tapping the `+` button on a dish row navigates to the Dish Detail screen (not direct add-to-cart, since customisations may be required)
- Restaurant-level favourite and dish-level favourite are independent and each trigger separate API calls
- When `status === 'closed'`, the "Make reservation" button remains enabled; cart actions are still accessible
- "Show more detail" expands or navigates to full restaurant info (hours, contact, map)

---

## Constraints

- Tech stack: Expo, React Native, TypeScript, react-query, Zustand
- No new npm dependencies without approval
- No inline `StyleSheet` objects
- Animations via `react-native-reanimated` only
- Types in `types/` folder
- The Bottom Tab Bar already exists — do not add or modify it
- Add tests for this screen in `tests/`

---

## Out of Scope

- Reservation screen / flow (navigated to from "Make reservation")
- Dish Detail screen (navigated to from `+` button)
- Cart screen
- Login / auth flow (only redirect trigger is in scope)
- Reviews or ratings
- Map view for the restaurant location
