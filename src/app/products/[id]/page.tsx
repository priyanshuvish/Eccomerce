// app/products/[id]/page.tsx
"use client";

import { useGetProductByIdQuery } from "@/redux/features/productApi";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FiStar, FiTruck, FiShield, FiRefreshCw } from "react-icons/fi";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);

  if (isLoading) return <div>Loading...</div>;
  if (error || !product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative h-96 mb-4">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, index) => (
              <div key={index} className="relative h-24">
                <Image
                  src={img}
                  alt={`${product.title} ${index + 1}`}
                  fill
                  className="object-contain border rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.brand}</p>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded">
              <span>{product.rating}</span>
              <FiStar className="ml-1 fill-current" />
            </div>
            <span className="text-gray-500">({product.reviews.length} reviews)</span>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold">${product.price}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through ml-2">
                  ${(product.price / (1 - product.discountPercentage/100)).toFixed(2)}
                </span>
                <span className="ml-2 text-green-600 font-semibold">
                  {Math.round(product.discountPercentage)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <FiTruck className="text-blue-600" />
              <span>{product.shippingInformation}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiRefreshCw className="text-blue-600" />
              <span>{product.returnPolicy}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiShield className="text-blue-600" />
              <span>{product.warrantyInformation}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Add to Cart
            </button>
            <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-4">
          {product.reviews.map((review, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{review.reviewerName}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}