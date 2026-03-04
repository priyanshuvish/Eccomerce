"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/features/authSlice";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const tokenMatch = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    const token = tokenMatch?.split("=")[1];

    if (token) {
      dispatch(
        setCredentials({
          user: null, 
          token,
          refreshToken: localStorage.getItem("refreshToken"),
        })
      );
    }
  }, [dispatch]);

  return <>{children}</>;
}