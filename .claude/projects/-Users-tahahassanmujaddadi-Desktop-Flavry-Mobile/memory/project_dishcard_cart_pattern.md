---
name: dishcard-cart-pattern
description: DishCard has its own "Add to cart" button that bypasses DishDetail — must call cartStore.addItem directly
metadata:
  type: project
---

DishCard has its own "Add to cart" button (separate from DishDetail's full add-to-cart flow). It must call both `useCartStore.getState().addItem(...)` AND `incrementCart()` from homeStore.

**Why:** Originally only called `incrementCart()` (badge count), leaving cartStore empty. The cart screen showed empty even though the badge showed items. Fixed by wiring DishCard to also call `cartStore.addItem`.

**How to apply:** Any future change to the add-to-cart flow must account for two entry points: DishCard (quick-add, no customisations) and DishDetail (full flow, with customisations). Both must update cartStore.

The `Dish` type requires `restaurantId: string` so DishCard can group items correctly in the Cart screen.
