import { create } from "zustand";

import { CartItem } from "types/cart";

interface CartStore {
  items: CartItem[];
  specialInstructions: Record<string, string>;
  voucher: string;
  discount: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setSpecialInstructions: (restaurantId: string, text: string) => void;
  applyVoucher: (code: string, discount: number) => void;
  clearVoucher: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  specialInstructions: {},
  voucher: "",
  discount: 0,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.id !== id)
          : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),

  setSpecialInstructions: (restaurantId, text) =>
    set((state) => ({
      specialInstructions: {
        ...state.specialInstructions,
        [restaurantId]: text,
      },
    })),

  applyVoucher: (code, discount) => set({ voucher: code, discount }),

  clearVoucher: () => set({ voucher: "", discount: 0 }),
}));
