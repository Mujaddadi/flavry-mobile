# Dish Detail Spec

Flavry is a food discovery and delivery app for UK audiences.

## Goal

Display full details of a selected dish — image, price, ingredients, customisation options (drinks, sides), and restaurant info — and allow the user to configure and add the item to their cart.

---

## Sections

### 1. Hero Image

- Full-width image of the dish, spanning the top of the screen edge-to-edge
- Image height: 40% of screen height (`hp(40)`)
- Lazy-loaded with a `gray5` placeholder background
- **Favourite icon** — heart icon in the top-right corner of the image
  - Outlined heart when not favourited; filled (`primary`) when favourited. This icon already exists
  - White icon on a semi-transparent dark circular background for legibility
  - `accessibilityRole="button"`
  - `accessibilityLabel` toggles: `"Add to favourites"` / `"Remove from favourites"`
  - Tapping calls `onFavouritePress`; requires auth — redirects to login if unauthenticated

### 2. Dish Info Row

- **Left column:**
  - Dish name — bold, `black1`, large text
  - Restaurant name — `gray2`, medium text; tapping navigates to restaurant detail screen
  - Opening hours — `gray3`, small text (e.g. "Open until 20:30")
- **Right column (top-right):**
  - Price — `primary` orange, bold (e.g. "Rs: 250")
  - Share icon below price — tapping opens the native share sheet with the dish deep-link URL
    - `accessibilityRole="button"`, `accessibilityLabel="Share this dish"`

### 3. Delivery Info Row

- Two columns separated by spacer:
  - **Left:** Delivery scooter icon + "Delivery {min}–{max} minutes" text
  - **Right:** "{distance} km away"
- Below: "Rs {minimumOrder} minimum order" — `gray3`, small text
- Light horizontal divider (`gray4`) above and below this section

### 4. Ingredients

- Section heading "Ingredients" — bold, `black2`
- Body text listing ingredients (e.g. "Beef, tomatoes, onions, cheese") — `gray1`
- Light horizontal divider below

### 5. Customisation Groups

Each customisation group (e.g. "Select drink", "Select fries") follows the same pattern:

- **Group heading** — bold, `black2` (e.g. "Select drink")
- **Checkbox list** of options, one per row:
  - Checkbox on the left — checked state uses `primary` orange; unchecked uses `gray4` border
  - Option label — `gray1`; `accessibilityRole="checkbox"`; `accessibilityState={{ checked }}`
  - Optional price surcharge on the right — `gray2` (e.g. "+ Rs 50"); shown only when `extraPrice > 0`
- Selection behaviour:
  - A group may allow single or multiple selections depending on `maxSelections` field from API
  - If `maxSelections === 1` the group behaves like a radio group (selecting one deselects the previous)
  - At least one option may be pre-selected as a default (`isDefault: true`)
- Light horizontal divider below each group

### 6. Restaurant Info Strip

- Section heading "Restaurant" — bold, `black2`
- Body line: "Open tomorrow at {time}" or "Open until {time}" — `gray1`
- "Show more detail" link on the right — `primary` orange; tapping navigates to the restaurant detail screen
  - `accessibilityRole="link"`, `accessibilityLabel="Show restaurant details"`
- Light horizontal divider above this section

### 7. Bottom Action Bar (sticky)

Pinned to the bottom of the screen, above the tab bar:

- **Quantity selector** (left):
  - Minus (`−`) button — disabled and visually muted when quantity is 1
  - Quantity count — centred, bold
  - Plus (`+`) button
  - Each button: `accessibilityRole="button"`; labels "Decrease quantity" / "Increase quantity"
  - Min quantity: 1; max quantity: 99
- **"Add to cart" button** (right):
  - `primary` orange background, white text, rounded corners
  - Tapping adds the item (with selected customisations and quantity) to the Zustand cart store
  - Requires auth — redirects to login if unauthenticated
  - `accessibilityRole="button"`, `accessibilityLabel="Add to cart"`
  - Disabled state (visually muted) if no required customisation group has a selection

### 8. Bottom Navigation Bar

- Already exists. Do not add or modify.

---

## Data and State

- Route param: `dishId` (string)
- Data fetched via react-query hook `useDishDetail(dishId)` — to be created in `hooks/`
- Customisation selections held in local component state (object keyed by group id)
- Quantity held in local component state, initialised to `1`
- Favourite state: fetched as part of dish detail payload; persisted via API with optimistic update
- Cart state managed in Zustand cart store (`addToCart({ dish, customisations, quantity })`)

---

## Accessibility

- All interactive elements have `accessibilityLabel` and `accessibilityRole`
- Text scales with system font size (`allowFontScaling` not disabled)
- Minimum touch target 44×44 pt for all buttons, checkboxes, and icons
- Checkbox rows expose `accessibilityState={{ checked }}`
- Favourite icon label updates dynamically based on state
- Colour contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large/price text

---

## Security Requirements

See `security.md` for full OWASP requirements.

Additional notes for this screen:

- `dishId` route param validated as a non-empty alphanumeric string before use in API call (A03 Injection)
- Share URL constructed server-side or from a safe template — no user-supplied content interpolated into URLs
- Cart and favourite actions gated behind auth check (A01 Broken Access Control)

---

## Colour Design Tokens

Use `colors.md` for all token values. Never hardcode hex values.

---

## Performance

- Hero image uses lazy loading with a `gray5` placeholder
- Screen content wrapped in `ScrollView` (not `FlashList` — content is a single item, not a list)
- Bottom action bar rendered outside the scroll view so it remains pinned
- react-query cache avoids redundant fetches on back-navigation

---

## Responsiveness

- Layout uses percentage-based Dimensions (`wp`, `hp` utils) — no hardcoded pixel values
- All sections reflow correctly from 320 px to 428 px screen widths

---

## Constraints

- Tech stack: Expo, React Native, TypeScript, react-query, Zustand, react-hook-form, zod
- No new npm dependencies without approval
- No inline StyleSheet objects
- Animations via react-native-reanimated only
- Types in `types/` folder
- The page navigation and Bottom Tab Bar already exist — do not add them
- Add tests for this screen in `tests/`

---

## Out of Scope

- Restaurant detail screen (navigated to via restaurant name / "Show more detail")
- Cart screen
- Login / auth flow (only redirect trigger is in scope)
- Reviews or ratings
