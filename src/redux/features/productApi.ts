import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Product interface based on DummyJSON structure
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface CategoryListItem {
  name: string;
  slug: string;
  url: string;
}

// Define query parameters interface
export interface ProductQueryParams {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  q?: string;
  category?: string;
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  tagTypes: ["Product", "Products", "Categories"],
  endpoints: (builder) => ({
    // GET all products with pagination, sorting, and search
    getProducts: builder.query<ProductsResponse, ProductQueryParams>({
      query: (params) => {
        const { limit = 10, skip = 0, sortBy, order, q, category } = params;

        // If search query is provided
        if (q) {
          return {
            url: "products/search",
            params: { q, limit, skip, sortBy, order },
          };
        }

        // If category is provided
        if (category) {
          return {
            url: `products/category/${category}`,
            params: { limit, skip, sortBy, order },
          };
        }

        // Default products endpoint with params
        return {
          url: "products",
          params: { limit, skip, sortBy, order },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({
                type: "Products" as const,
                id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // GET single product by ID
    getProductById: builder.query<Product, number>({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // GET all categories (detailed list with slugs and names)
    getCategories: builder.query<Category[], void>({
      query: () => "products/categories",
      providesTags: [{ type: "Categories", id: "LIST" }],
    }),

    // GET category list (simplified list of category names)
    getCategoryList: builder.query<CategoryListItem[], void>({
      query: () => "products/category-list",
      transformResponse: (response: string[]) => {
        // Transform string array to CategoryListItem array
        return response.map((name) => ({
          name,
          slug: name.toLowerCase().replace(/ /g, "-"),
          url: `https://dummyjson.com/products/category/${name.toLowerCase().replace(/ /g, "-")}`,
        }));
      },
      providesTags: [{ type: "Categories", id: "LIST" }],
    }),

    // GET products by category
    getProductsByCategory: builder.query<
      ProductsResponse,
      { category: string; params?: ProductQueryParams }
    >({
      query: ({ category, params }) => ({
        url: `products/category/${category}`,
        params: {
          limit: params?.limit,
          skip: params?.skip,
          sortBy: params?.sortBy,
          order: params?.order,
        },
      }),
      providesTags: (result, error, { category }) =>
        result
          ? [
              ...result.products.map(({ id }) => ({
                type: "Products" as const,
                id,
              })),
              { type: "Products", id: `CATEGORY_${category}` },
            ]
          : [{ type: "Products", id: `CATEGORY_${category}` }],
    }),

    // Search products
    searchProducts: builder.query<
      ProductsResponse,
      { q: string; params?: ProductQueryParams }
    >({
      query: ({ q, params }) => ({
        url: "products/search",
        params: {
          q,
          limit: params?.limit,
          skip: params?.skip,
          sortBy: params?.sortBy,
          order: params?.order,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({
                type: "Products" as const,
                id,
              })),
              { type: "Products", id: "SEARCH" },
            ]
          : [{ type: "Products", id: "SEARCH" }],
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetCategoryListQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
} = productApi;
