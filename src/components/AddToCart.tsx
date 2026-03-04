"use client";

import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cartSlice";

export default function AddToCart({ product }: any) {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() =>
        dispatch(addToCart(product))
      }
      className="bg-blue-500 text-white px-4 py-2"
    >
      Add To Cart
    </button>
  );
}