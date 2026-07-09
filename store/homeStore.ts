import { create } from "zustand";

import { DeliveryMode, DishDetail } from "types/home";

interface AddToCartParams {
  dish: DishDetail;
  customisations: Record<string, string[]>;
  quantity: number;
}

interface HomeStore {
  deliveryMode: DeliveryMode;
  cartCount: number;
  location: string;
  setDeliveryMode: (mode: DeliveryMode) => void;
  incrementCart: () => void;
  addToCart: (params: AddToCartParams) => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
  deliveryMode: DeliveryMode.DELIVERY,
  cartCount: 0, // TODO: We might not need it
  location: "Nuijavuori 2", // TODO: This will come from actual loction
  setDeliveryMode: (mode) => set({ deliveryMode: mode }),
  incrementCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  addToCart: ({ quantity }) =>
    set((state) => ({ cartCount: state.cartCount + quantity })),
}));
