import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number; // optional, default 60
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: credentials,
      }),
    }),
    getCurrentUser: builder.query<User, string>({
      query: (token) => ({
        url: 'auth/me',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    }),
    refreshToken: builder.mutation<{ token: string; refreshToken: string }, string>({
      query: (refreshToken) => ({
        url: 'auth/refresh',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { refreshToken },
      }),
    }),
  }),
});

export const { useLoginMutation, useGetCurrentUserQuery, useRefreshTokenMutation } = authApi;