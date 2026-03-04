"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import { 
  FiShoppingCart, 
  FiHeart, 
  FiEye, 
  FiStar, 
  FiTruck,
  FiShield,
  FiCheckCircle
} from "react-icons/fi";
import { 
  MdCompareArrows, 
  MdDiscount 
} from "react-icons/md";
import { 
  BsLightningCharge, 
  BsBagCheck 
} from "react-icons/bs";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
  discountPercentage?: number;
  stock?: number;
  brand?: string;
}

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dispatch = useAppDispatch();

  const discountedPrice = product.discountPercentage 
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    // Optional: Show toast notification
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Optional: Dispatch wishlist action
  };

  const handleQuickView = () => {
    // Optional: Open quick view modal
  };

  return (
    <div 
      className="group relative bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {product.discountPercentage && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
          <MdDiscount className="w-3 h-3" />
          {Math.round(product.discountPercentage)}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
          isWishlisted 
            ? 'bg-red-500 text-white' 
            : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
        } shadow-md backdrop-blur-sm`}
      >
        <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Quick View Button - Shows on Hover */}
      <div className={`absolute inset-x-0 top-20 z-10 flex justify-center transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <button
          onClick={handleQuickView}
          className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <FiEye className="w-4 h-4" />
          Quick View
        </button>
      </div>

      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block relative pt-[100%] bg-gray-50">
        <div className="absolute inset-4">
          <Image
            src={imageError ? '/placeholder-image.jpg' : product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            priority={false}
          />
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="absolute bottom-2 left-2 right-2">
            {product.stock > 0 ? (
              <div className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <FiCheckCircle className="w-3 h-3" />
                <span>{product.stock} in stock</span>
              </div>
            ) : (
              <div className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full">
                Out of Stock
              </div>
            )}
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h2 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">
            {product.title}
          </h2>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-sm font-medium">
            <span>{product.rating}</span>
            <FiStar className="w-3 h-3 ml-1 fill-current" />
          </div>
          <span className="text-xs text-gray-500">
            (123 Reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">
            ₹{discountedPrice || product.price}
          </span>
          {product.discountPercentage && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ₹{product.price}
              </span>
              <span className="text-xs text-green-600 font-medium">
                {Math.round(product.discountPercentage)}% off
              </span>
            </>
          )}
        </div>

        {/* Delivery Info */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FiTruck className="w-3 h-3" />
          <span>Free Delivery</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <FiShield className="w-3 h-3" />
          <span>1 Year Warranty</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-sm"
          >
            <FiShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>

          <Link
            href={`/products/${product.id}`}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors text-sm"
          >
            <BsBagCheck className="w-4 h-4" />
            Buy Now
          </Link>
        </div>

        {/* Additional Features */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <MdCompareArrows className="w-4 h-4" />
            Compare
          </button>
          <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <BsLightningCharge className="w-4 h-4" />
            Quick
          </button>
        </div>
      </div>

      {/* Hover Overlay with Additional Info */}
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent p-4 transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="space-y-2">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <FiCheckCircle className="w-3 h-3 text-green-500" />
            Assured quality
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <FiCheckCircle className="w-3 h-3 text-green-500" />
            7 days replacement
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <FiCheckCircle className="w-3 h-3 text-green-500" />
            Free delivery by tomorrow
          </p>
        </div>
      </div>
    </div>
  );
}