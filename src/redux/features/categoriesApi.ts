import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/products/categories',
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;