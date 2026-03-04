import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action) => {
      const item = state.items.find(
        (i) => i.id === action.payload.id
      );

      if (item) item.quantity++;
      else
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (i) => i.id !== action.payload
      );
    },
  },
});

export const { addToCart, removeFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;