import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";
import { productApi } from "./features/productApi";
import { categoriesApi } from "./features/categoriesApi";
import { authApi } from "./features/authApi";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      categoriesApi.middleware,
      authApi.middleware
    ),
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;