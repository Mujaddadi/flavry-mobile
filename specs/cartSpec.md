# Cart Spec

Flavry is a food discovery and delivery app for UK audiences.

## Goal

Display all items currently in the user's cart, grouped by restaurant. Allow the user to adjust quantities, add popular add-ons, enter a voucher code, and proceed to checkout.

---

## Sections

### 1. Screen Header

- Orange (`primary`) background bar at the top of the screen
- Title: "Cart" — white, bold
- No back button (cart is a top-level tab screen)

---

### 2. Restaurant Group Cards

The cart is grouped by restaurant. Each group is a card with a dashed border (`gray4`) and slight margin on each side. Cards are stacked vertically inside a `ScrollView`.

#### 2a. Restaurant Header Row

- Restaurant logo (square thumbnail, rounded) on the left
- Restaurant name — bold, `black1`, medium text (e.g. "Burger King Espoo")
- Displayed at the top of each restaurant group card

#### 2b. Cart Item Rows

Each item in the group is a row with:

- **Left:** Food image — square thumbnail, rounded corners
- **Centre (main content):**
  - Item name — bold, `black1`
  - Item description/ingredients — `gray3`, small text, wraps to two lines max
- **Right column:**
  - **Quantity selector:**
    - Minus (`−`) button
    - Quantity count — centred, `black1`
    - Plus (`+`) button
    - Buttons styled: outlined circle, `primary` orange stroke and text
    - `accessibilityRole="button"` on each; labels: "Decrease quantity of {itemName}" / "Increase quantity of {itemName}"
    - Min quantity: 1; tapping minus at 1 removes the item from the cart (with confirmation or immediate removal — see Behaviour)
  - Item price — `black1`, right-aligned (e.g. "Rs.1840")

#### 2c. Group Total

- Right-aligned row at the bottom of the item list, above the add-ons section
- Label: **"Total Rs.{amount}"** — bold, `black1`
- Derived by summing all item prices × quantities within the group

#### 2d. Popular Add-ons

- Section heading: **"Popular Add ons"** — bold, `black2`, small text
- Horizontally scrollable row of add-on tiles:
  - Each tile: square food image, item name below (`gray1`, small), price below (`gray1`, small)
  - Orange `+` badge on the top-right corner of each image to add the item
    - `accessibilityRole="button"`, `accessibilityLabel="Add {itemName} to cart"`
- Tiles have no fixed count — render all add-ons returned by the API

#### 2e. Special Instructions

- Single-line tappable text input below the add-ons row
- Placeholder text: "Special instructions to the restaurant" — `gray3`
- `accessibilityLabel="Special instructions for {restaurantName}"`
- Input text saved to cart state for that restaurant group

---

### 3. Voucher Section

- Positioned below all restaurant group cards, above the checkout bar
- Centred label: "Add voucher" — `gray3`, small text
- Row with:
  - Text input — takes most of the row width; `placeholder="Voucher code"`; `accessibilityLabel="Voucher code"`
  - **"Apply" button** — `primary` orange background, white bold text, rounded right edge
    - `accessibilityRole="button"`, `accessibilityLabel="Apply voucher"`
    - Tapping validates the voucher via API; shows inline error (`primary` or `red`) if invalid
- Managed with `react-hook-form` + `zod` (voucher field: non-empty string, trimmed)

---

### 4. Checkout Bar (sticky)

Pinned to the bottom of the screen, above the tab bar:

- Full-width, `primary` orange background
- **Left:** Label "Checkout" — white, bold
- **Right:** Grand total across all restaurant groups — "RS. {total}" — white, bold
- `accessibilityRole="button"`, `accessibilityLabel="Checkout, total RS. {total}"`
- Tapping navigates to the Checkout / Payment screen
- Disabled (visually muted) when the cart is empty

---

### 5. Empty State

- When the cart is empty, show a centred illustration or icon, the message "Your cart is empty", and a CTA button "Browse restaurants" that navigates to the Home tab
- Checkout bar is hidden or disabled in this state

---

### 6. Bottom Navigation Bar

Already exists. Do not add or modify.

---

## Data and State

- Cart contents managed in Zustand store (`useCartStore`):
  - Shape: `{ items: CartItem[], voucher?: string, discount?: number }`
  - `CartItem`: `{ id, dishId, name, description, image, price, quantity, restaurantId, restaurantName, restaurantLogo }`
- `restaurantGroups` — derived selector: items grouped by `restaurantId`
- Group total — computed from `items` in the group: `sum(item.price * item.quantity)`
- Grand total — computed across all groups, minus discount if voucher applied
- Quantity changes update store immediately (optimistic); removal at quantity 0 removes the item
- Special instructions per restaurant stored as `Record<restaurantId, string>` in the store
- Popular add-ons fetched via react-query: `usePopularAddons(restaurantId)` — cached 5 minutes
- Voucher validation via API call on "Apply" press; error shown inline

---

## Types

Add to `types/home.ts` (or a new `types/cart.ts`):

```typescript
export interface CartItem {
  id: string; // unique cart entry id (uuid)
  dishId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  customisations?: Record<string, string[]>;
}

export interface RestaurantGroup {
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  items: CartItem[];
  specialInstructions?: string;
  total: number;
}

export interface PopularAddon {
  id: string;
  name: string;
  image: string;
  price: number;
}
```

---

## Accessibility

- All interactive elements have `accessibilityRole` and `accessibilityLabel`
- Quantity buttons include the item name in their label to disambiguate screen-reader output
- Checkout bar label includes the live total so VoiceOver users hear the amount without navigating
- Text scales with system font size (`allowFontScaling` not disabled)
- Minimum touch target 44×44 pt for all buttons and `+` add-on badges
- Colour contrast ≥ 4.5:1 for body text; ≥ 3:1 for large price/total text
- Empty state CTA button is focusable and labelled

---

## Security Requirements

See `security.md` for full OWASP requirements.

Additional notes for this screen:

- Voucher code input sanitised and trimmed before API submission (A03 Injection)
- Cart and checkout actions gated behind auth check (A01 Broken Access Control)
- Grand total computed server-side at checkout — client total is display only (A04 Insecure Design)
- No PII logged to console (A09)

---

## Colour Design Tokens

Use `colors.md` for all token values. Never hardcode hex values.

---

## Performance

- `ScrollView` wraps the restaurant group cards (unbounded list of groups is uncommon — `FlashList` not needed)
- Popular add-ons use a `FlatList` (horizontal) per restaurant group with `initialNumToRender={3}`
- react-query caches add-on responses per restaurant — no redundant fetches on scroll
- Zustand selectors are memoised; components only re-render when their slice of cart state changes

---

## Responsiveness

- Layout uses percentage-based Dimensions (`wp`, `hp` utils) — no hardcoded pixel values
- All sections reflow correctly from 320 px to 428 px screen widths
- Add-on tile images use a fixed `wp(25)` width so three fit comfortably across all target devices

---

## Behaviour

- **Remove at quantity 1:** Tapping `−` when quantity is 1 removes the item immediately (no confirmation dialog — matches common app patterns). If that was the only item for a restaurant, the restaurant group card disappears.
- **Voucher:** If a voucher is already applied, the input shows the code and the button changes to "Remove". Applying a new code replaces the previous one.
- **Scroll:** The full screen is scrollable. The Checkout bar remains pinned.
- **Restaurant order:** Groups render in the order the first item from each restaurant was added to the cart.

---

## Constraints

- Tech stack: Expo, React Native, TypeScript, react-query, Zustand, react-hook-form, zod
- No new npm dependencies without approval
- No inline `StyleSheet` objects
- Animations via `react-native-reanimated` only
- Types in `types/` folder
- The Bottom Tab Bar already exists — do not add or modify it
- Add tests for this screen in `tests/`

---

## Out of Scope

- Checkout / Payment screen (navigated to from the Checkout bar)
- Restaurant detail screen
- Login / auth flow (only redirect trigger is in scope)
- Order history or saved carts
- Real-time stock availability checks
   