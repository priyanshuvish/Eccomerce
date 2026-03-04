// app/search/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchProductsQuery } from "@/redux/features/productApi";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [page, setPage] = useState(1);
  const limit = 12;
  const skip = (page - 1) * limit;

  const { data, isLoading, error } = useSearchProductsQuery({
    q: query,
    params: { limit, skip }
  });

  useEffect(() => {
    setPage(1);
  }, [query]);

  if (isLoading) return <div>Searching...</div>;
  if (error) return <div>Error searching products</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Search Results for "{query}"</h1>
      <p className="text-gray-600 mb-6">{data?.total} products found</p>

      {data?.products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {data && data.total > limit && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {Math.ceil(data.total / limit)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(data.total / limit)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}