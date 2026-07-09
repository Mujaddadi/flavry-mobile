# Table Reservation Spec

Flavry is a food discovery and delivery app for UK audiences.

## Goal

Allow users to find restaurants that accept table reservations, select a date/time/party size, choose a seating preference, enter their details, and confirm a booking — all from a dedicated reservation flow.

This feature spans two screens:

1. **Table Reservation Search** — browsable list of restaurants with inline time-slot selection
2. **Reserve a Table** — full booking form for a selected restaurant

---

## Screen 1: Table Reservation Search

**Route:** `/(tabs)/reservations`
**File:** `screens/TableReservationSearch/index.tsx`

---

### 1. Header

- Orange (`primary`) background
- Title: "Reservations" — white, bold, left-aligned
- Search bar (`Search for restaurants`) — white background, rounded, centre of header
- Cart icon (top-right) with badge showing item count (same pattern as home screen)
- `accessibilityLabel` on search: `"Search for restaurants"`
- `accessibilityLabel` on cart: `"Cart, {n} items"`

---

### 2. Result Count

- Body text below the header: `"{n} Search result for table reservations"` — `black1`, small
- Updates reactively as filters change

---

### 3. Filter Bar

Horizontally scrollable row of filter chips:

| Chip                    | Icon                | Behaviour                                                |
| ----------------------- | ------------------- | -------------------------------------------------------- |
| Date                    | calendar icon       | Opens date picker modal; pre-filled with selected date   |
| Time                    | clock icon          | Opens time picker modal; pre-filled with selected time   |
| Party size              | person icon         | Opens party size picker (stepper or dropdown)            |
| Price                   | none                | Dropdown with price range options; shows arrow-down icon |
| Filter icon (far right) | filter/sliders icon | Opens full filter sheet (sort, distance, cuisine, etc.)  |

- Active (applied) chips use `primary` orange background with white text
- Inactive chips use white background with `black1` text and `gray4` border
- `accessibilityRole="button"` on each chip; label describes current value (e.g. `"Date filter, Today 24 May"`)

---

### 4. Date Picker Strip

Horizontally scrollable row of date chips, immediately below the filter bar:

- Each chip shows: day abbreviation (e.g. "Today", "Tomorrow", "Mon") on top, date number bold below, month abbreviation small below that
- Selected date: `primary` orange background, white text
- Unselected: white background, `black1` text
- Today's chip shows "Today" as the label instead of the day name
- Scrollable to show ~7 days ahead; arrow `>` at the right edge to reveal more dates
- Tapping a date updates the selected date across all filters and rerenders the search results
- `accessibilityRole="button"`, `accessibilityLabel="Select {dayName} {date} {month}"`

---

### 5. Restaurant Cards (result list)

Rendered in a `FlashList` for performance. Each card:

#### 5a. Restaurant Image

- Full-width image at the top of the card, fixed height (`hp(22)`)
- Lazy-loaded with `gray5` placeholder
- **Discount badge** (top-left): pill with `primary` orange background, white text (e.g. `"Rs 500 off"`); only shown when a discount exists
- **Favourite icon** (top-right): heart icon on a semi-transparent dark circular background
  - Outlined when not favourited; filled (`primary`) when favourited
  - `accessibilityRole="button"`, `accessibilityLabel` toggles: `"Add to favourites"` / `"Remove from favourites"`

#### 5b. Restaurant Info Row

- **Left:** Restaurant name — bold, `black1`, medium text
- **Right:** Price — `primary` orange, bold (e.g. `"Rs 420"`)
- Below name: Tagline / cuisine description — `gray2`, small

#### 5c. Date & Party Row

Two items on the same row:

- Calendar icon + `"Today / {date}"` (e.g. `"Today / 24 May"`) — `gray2`, small
- Person icon + `"{n} People"` (e.g. `"2 People"`) — `gray2`, small

#### 5d. Available Times

- Bold label `"Available times"` — `black2`, small
- Horizontally scrollable row of time-slot chips:
  - Each chip shows a time string (e.g. `"6:30 PM"`)
  - **Selected** slot: `primary` orange background, white text
  - **Unselected** slot: white background, `black1` text, `gray4` border
  - Arrow chip `>` at the end to expand additional time slots
  - Tapping a chip selects that time and stores it as the chosen slot for this restaurant
  - `accessibilityRole="button"`, `accessibilityLabel="{time}, select this time slot"`

#### 5e. Card Separator

- Light `gray5` horizontal bar (8 dp height) between cards — same pattern as Cart screen restaurant separator

---

### 6. Empty / Loading States

- **Loading:** skeleton shimmer cards (3 cards) while data fetches
- **Empty:** centred illustration + `"No restaurants available for your selection"` message + `"Change filters"` link

---

## Screen 2: Reserve a Table

**Route:** `/(tabs)/reservations/[restaurantId]`
**File:** `screens/ReserveTable/index.tsx`

---

### 1. Header

- White background with `primary` orange text
- Back arrow (left) — navigates back to Table Reservation Search
- Title: `"Reserve a table"` — bold, centred
- Cart icon (right) with badge — same as other screens
- `accessibilityLabel` on back: `"Go back"`

---

### 2. Restaurant Info Card

Below the header, a card (white background, light shadow) showing:

- **Left:** Restaurant thumbnail image (square, `wp(20)` × `wp(20)`, rounded corners)
- **Right column:**
  - Restaurant name (dish name shown in design, e.g. `"Zinger Burger"`) — bold, `black1`
  - Price — `primary` orange, bold, top-right
  - Restaurant name — `gray2`, medium (e.g. `"Burger King Espoo"`)
  - Star icon + rating (e.g. `"4.5"`) + review count (e.g. `"(128 reviews)"`) + separator dot + cuisine category (e.g. `"Burger"`) — `gray3`, small

---

### 3. Reservation Details

Section heading: `"Reservation details"` — bold, `black1`

Three dropdown rows, each with a left icon, a value label, and a chevron-down icon on the right. Full-width, bordered (`gray4`), rounded:

| Row        | Icon          | Default value                                        |
| ---------- | ------------- | ---------------------------------------------------- |
| Date       | calendar icon | `"Today, {date}"` (pre-filled from search selection) |
| Time       | clock icon    | Selected time slot from search (pre-filled)          |
| Party size | person icon   | Party size from search (pre-filled)                  |

- Tapping any row opens a bottom-sheet picker for that field
- Values pre-fill from the selection made on the Table Reservation Search screen
- `accessibilityRole="button"` on each row; label: `"Select date"`, `"Select time"`, `"Select party size"`

---

### 4. Select Table Preference

Section heading: `"Select table preference"` — bold, `black1`
Subtitle: `"We'll do our best to accommodate your preference"` — `gray3`, small

Three equal-width option cards in a row:

| Option  | Icon                        |
| ------- | --------------------------- |
| Any     | table/chairs icon           |
| Indoor  | indoor table icon           |
| Outdoor | outdoor/umbrella table icon |

- Selected card: `primary` orange border, light orange background tint, orange checkmark badge (top-right corner of card)
- Unselected card: white background, `gray4` border
- Default selection: `"Any"`
- `accessibilityRole="radio"`, `accessibilityState={{ checked }}`, `accessibilityLabel="{option} seating"`

---

### 5. Special Requests

- Section heading: `"Special requests (optional)"` — bold, `black1`
- Multi-line `TextInput`:
  - Placeholder: `"E.g. Birthday celebration, High chair, Window seat"` — `gray3`
  - Full-width, bordered (`gray4`), `borderRadius: 8`, min height ~3 lines
  - Character limit: 120; counter `"{n}/120"` shown bottom-right inside the input, `gray3`
  - Managed via react-hook-form
- `accessibilityLabel="Special requests, optional"`

---

### 6. Your Details

Section heading: `"Your details"` — bold, `black1`

Three text input rows, each with a left icon:

| Field        | Icon          | Input type    | Validation                   |
| ------------ | ------------- | ------------- | ---------------------------- |
| Name         | person icon   | text          | Required, min 2 chars        |
| Phone number | phone icon    | phone-pad     | Required, valid phone format |
| Email        | envelope icon | email-address | Required, valid email        |

- Full-width inputs, bordered (`gray4`), `borderRadius: 8`
- Managed via react-hook-form + zod
- Inline error messages below each field on blur — `error` red colour, small text
- `accessibilityLabel` matches field label (e.g. `"Enter your name"`)

---

### 7. Total Row

- Label `"Total"` — bold, `black1`, left
- Amount `"Rs {price}"` — `primary` orange, bold, right
- Price comes from the restaurant's base reservation price

---

### 8. Bottom Action Buttons

Two full-width buttons, stacked:

#### 8a. Confirm Reservation

- `primary` orange background, white text `"Confirm reservation"`, bold, rounded (`borderRadius: 25`)
- Requires all form fields to be valid; disabled (visually muted) otherwise
- On press: submits booking via API; navigates to a reservation confirmation screen on success
- Shows inline loading indicator while submitting
- `accessibilityRole="button"`, `accessibilityLabel="Confirm reservation"`

#### 8b. Save for Later

- White background, `primary` orange border and text
- Heart icon (outlined) + `"Save for later"` label
- Saves the restaurant + selected details to a favourites/saved reservations list
- `accessibilityRole="button"`, `accessibilityLabel="Save for later"`

---

## Data and State

### Table Reservation Search

- Query params: `date`, `time`, `partySize`, `query`, `page`
- Data fetched via react-query hook `useTableReservationSearch(params)` — to be created in `hooks/`
- Selected date, time, party size and active filters held in local component state
- Selected time slot per restaurant held in local component state (keyed by restaurantId)
- Favourite state: persisted via API with optimistic update

### Reserve a Table

- Route param: `restaurantId`
- Restaurant summary data passed via navigation params (name, price, image, rating) — no extra fetch required for the info card
- Form state managed via react-hook-form; validation schema via zod
- Pre-filled values: `date`, `time`, `partySize` from navigation params
- `tablePreference` defaults to `"any"`; `specialRequests` defaults to `""`
- Submission via API call `submitTableReservation(payload)` — to be created in `apis/`
- Types in `types/reservation.ts`

---

## Types (`types/reservation.ts`)

```ts
export interface TableReservationSearchParams {
  query?: string;
  date?: string; // ISO date string
  time?: string; // "HH:MM" 24h
  partySize?: number;
  priceRange?: [number, number];
  page?: number;
}

export interface ReservationRestaurant {
  id: string;
  name: string;
  tagline: string;
  image: string;
  price: number;
  discount?: string;
  rating: number;
  reviewCount: number;
  category: string;
  availableTimes: string[]; // e.g. ["18:30", "19:00", "19:30"]
  isFavourited?: boolean;
}

export type TablePreference = "any" | "indoor" | "outdoor";

export interface ReservationFormData {
  date: string;
  time: string;
  partySize: number;
  tablePreference: TablePreference;
  specialRequests?: string;
  name: string;
  phone: string;
  email: string;
}

export interface TableReservationSearchResult {
  restaurants: ReservationRestaurant[];
  total: number;
  page: number;
  hasMore: boolean;
}
```

---

## Accessibility

- All interactive elements have `accessibilityLabel` and `accessibilityRole`
- Text scales with system font size (`allowFontScaling` not disabled)
- Minimum touch target 44×44 pt for all buttons, chips, and icons
- Table preference cards expose `accessibilityRole="radio"` and `accessibilityState={{ checked }}`
- Favourite icon label updates dynamically based on state
- Colour contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large/price text
- Form error messages are announced by screen readers via `accessibilityLiveRegion="polite"`

---

## Security Requirements

See `security.md` for full OWASP requirements.

Additional notes:

- `restaurantId` route param validated as non-empty alphanumeric before use in API call (A03 Injection)
- Form inputs validated via zod before submission — no raw user input sent to API unvalidated
- Phone and email validated to proper formats before submission
- Special requests input sanitised (strip HTML/script tags) before sending (A03 XSS)
- Reservation actions gated behind auth check (A01 Broken Access Control)

---

## Performance

- Restaurant list uses `FlashList` for virtualised rendering
- Restaurant images lazy-loaded with `gray5` placeholder
- react-query caches search results per param set; back-navigation does not re-fetch
- Form validation runs on blur (not on every keystroke) to avoid excessive re-renders

---

## Responsiveness

- Layout uses percentage-based Dimensions (`wp`, `hp` utils) — no hardcoded pixel values
- Filter chips and date strip scroll horizontally — no wrapping
- Table preference cards divide the available width equally (`width: wp(28)` each with `gap`)
- All sections reflow correctly from 320 px to 428 px screen widths

---

## Constraints

- Tech stack: Expo, React Native, TypeScript, react-query, Zustand, react-hook-form, zod
- No new npm dependencies without approval
- No inline StyleSheet objects
- Animations via react-native-reanimated only
- Types in `types/reservation.ts`
- Bottom Tab Bar already exists — add a "Calendar" tab entry pointing to this route; do not modify other tabs
- Add tests for both screens in `tests/`

---

## Out of Scope

- Reservation confirmation screen (post-submit success state)
- Saved reservations list / history
- Full filter sheet (opened by the filter icon)
- Date/time picker UI components (assume native bottom-sheet pickers)
- Payment flow for reservations that require a deposit
- Restaurant detail screen (linked from restaurant name)
