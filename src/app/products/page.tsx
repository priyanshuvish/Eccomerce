// app/products/page.tsx
"use client";

import { useState } from "react";
import { useGetProductsQuery } from "@/redux/features/productApi";
import ProductCard from "@/components/ProductCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const limit = 12;
  const skip = (page - 1) * limit;

  const { data, isLoading, error } = useGetProductsQuery({
    limit,
    skip,
    sortBy,
    order
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <div className="flex gap-2">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="title">Title</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
          <select 
            value={order} 
            onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
            className="border rounded px-3 py-2"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="p-2 border rounded disabled:opacity-50"
        >
          <FiChevronLeft />
        </button>
        <span>Page {page} of {Math.ceil((data?.total || 0) / limit)}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= Math.ceil((data?.total || 0) / limit)}
          className="p-2 border rounded disabled:opacity-50"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}