import { create } from "zustand";

import { DeliveryMode } from "types/home";

interface HomeStore {
  deliveryMode: DeliveryMode;
  cartCount: number;
  location: string;
  setDeliveryMode: (mode: DeliveryMode) => void;
  incrementCart: () => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
  deliveryMode: DeliveryMode.DELIVERY,
  cartCount: 0, // TODO: We might not need it
  location: "Nuijavuori 2", // TODO: This will come from actual loction
  setDeliveryMode: (mode) => set({ deliveryMode: mode }),
  incrementCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
}));
