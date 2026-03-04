"use client";

import {
  useAppSelector,
  useAppDispatch,
} from "@/redux/hooks";
import { removeFromCart } from "@/redux/features/cartSlice";

export default function CartPage() {
  const items = useAppSelector(
    (state) => state.cart.items
  );

  const dispatch = useAppDispatch();

  return (
    <div className="p-6">
      {items.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>
            ${item.price} × {item.quantity}
          </p>

          <button
            onClick={() =>
              dispatch(removeFromCart(item.id))
            }
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}