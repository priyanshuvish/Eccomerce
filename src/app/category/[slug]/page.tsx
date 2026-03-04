"use client";

import ProductCard from "@/components/ProductCard";
import { useGetCategoriesQuery, useGetProductsByCategoryQuery } from "@/redux/features/productApi";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import {
    BsBagCheck,
    BsFlower1,
    BsPhone,
    BsSmartwatch,
    BsSunglasses
} from "react-icons/bs";
import {
    FaAppleAlt,
    FaCar,
    FaClock,
    FaCouch,
    FaGem,
    FaHome,
    FaLaptop,
    FaMobile,
    FaMotorcycle,
    FaShoePrints as FaShoeIcon,
    FaShoePrints,
    FaTshirt,
    FaTshirt as FaTShirtIcon
} from "react-icons/fa";
import { FaKitchenSet } from "react-icons/fa6";

import {
    FiArrowLeft,
    FiChevronLeft,
    FiChevronRight,
    FiFilter,
    FiGrid,
    FiList,
    FiPackage,
    FiStar,
    FiTrendingUp
} from "react-icons/fi";
import { GiLipstick, GiPerfumeBottle, GiRunningShoe, GiWatch } from "react-icons/gi";
import {
    MdCategory,
    MdSort
} from "react-icons/md";

// Helper function to get icon for category
const getCategoryIcon = (slug: string, className = "w-12 h-12") => {
  const iconMap: { [key: string]: JSX.Element } = {
    'beauty': <GiLipstick className={className} />,
    'fragrances': <GiPerfumeBottle className={className} />,
    'furniture': <FaCouch className={className} />,
    'groceries': <FaAppleAlt className={className} />,
    'home-decoration': <FaHome className={className} />,
    'kitchen-accessories': <FaKitchenSet className={className} />,
    'laptops': <FaLaptop className={className} />,
    'mens-shirts': <FaTShirtIcon className={className} />,
    'mens-shoes': <FaShoeIcon className={className} />,
    'mens-watches': <GiWatch className={className} />,
    'mobile-accessories': <FaMobile className={className} />,
    'motorcycle': <FaMotorcycle className={className} />,
    'skin-care': <BsFlower1 className={className} />,
    'smartphones': <BsPhone className={className} />,
    'sports-accessories': <GiRunningShoe className={className} />,
    'sunglasses': <BsSunglasses className={className} />,
    'tablets': <BsSmartwatch className={className} />,
    'tops': <FaTshirt className={className} />,
    'vehicle': <FaCar className={className} />,
    'womens-bags': <BsBagCheck className={className} />,
    'womens-dresses': <FaTshirt className={className} />,
    'womens-jewellery': <FaGem className={className} />,
    'womens-shoes': <FaShoePrints className={className} />,
    'womens-watches': <FaClock className={className} />,
  };
  
  return iconMap[slug] || <MdCategory className={className} />;
};

// Helper function to get color for category
const getCategoryColor = (slug: string) => {
  const colorMap: { [key: string]: string } = {
    'beauty': 'bg-pink-100 text-pink-600',
    'fragrances': 'bg-purple-100 text-purple-600',
    'furniture': 'bg-amber-100 text-amber-600',
    'groceries': 'bg-green-100 text-green-600',
    'home-decoration': 'bg-yellow-100 text-yellow-600',
    'kitchen-accessories': 'bg-orange-100 text-orange-600',
    'laptops': 'bg-blue-100 text-blue-600',
    'mens-shirts': 'bg-indigo-100 text-indigo-600',
    'mens-shoes': 'bg-cyan-100 text-cyan-600',
    'mens-watches': 'bg-teal-100 text-teal-600',
    'mobile-accessories': 'bg-sky-100 text-sky-600',
    'motorcycle': 'bg-red-100 text-red-600',
    'skin-care': 'bg-rose-100 text-rose-600',
    'smartphones': 'bg-emerald-100 text-emerald-600',
    'sports-accessories': 'bg-lime-100 text-lime-600',
    'sunglasses': 'bg-violet-100 text-violet-600',
    'tablets': 'bg-fuchsia-100 text-fuchsia-600',
    'tops': 'bg-pink-100 text-pink-600',
    'vehicle': 'bg-gray-100 text-gray-600',
    'womens-bags': 'bg-purple-100 text-purple-600',
    'womens-dresses': 'bg-rose-100 text-rose-600',
    'womens-jewellery': 'bg-amber-100 text-amber-600',
    'womens-shoes': 'bg-indigo-100 text-indigo-600',
    'womens-watches': 'bg-teal-100 text-teal-600',
  };
  
  return colorMap[slug] || 'bg-gray-100 text-gray-600';
};

// Helper function to get category description
const getCategoryDescription = (slug: string): string => {
  const descriptions: { [key: string]: string } = {
    'beauty': 'Explore our wide range of beauty products including makeup, skincare, and more',
    'fragrances': 'Discover premium fragrances for men and women from top brands',
    'furniture': 'Find elegant and comfortable furniture for your home and office',
    'groceries': 'Shop fresh groceries and daily essentials at best prices',
    'home-decoration': 'Transform your space with beautiful home decor items',
    'kitchen-accessories': 'Upgrade your kitchen with modern accessories and appliances',
    'laptops': 'Browse the latest laptops from leading brands for work and play',
    'mens-shirts': 'Stylish and comfortable shirts for every occasion',
    'mens-shoes': 'Find the perfect pair of shoes for your style and comfort',
    'mens-watches': 'Elegant timepieces to complement your personality',
    'mobile-accessories': 'Essential accessories to enhance your mobile experience',
    'motorcycle': 'Explore motorcycles and riding gear for enthusiasts',
    'skin-care': 'Premium skin care products for a healthy, glowing complexion',
    'smartphones': 'Latest smartphones with cutting-edge technology',
    'sports-accessories': 'Gear up with quality sports accessories and equipment',
    'sunglasses': 'Stylish sunglasses to protect your eyes in style',
    'tablets': 'Powerful tablets for work, entertainment, and creativity',
    'tops': 'Fashionable tops for every style and occasion',
    'vehicle': 'Explore vehicles and automotive accessories',
    'womens-bags': 'Trendy bags and purses to complete your look',
    'womens-dresses': 'Beautiful dresses for every occasion',
    'womens-jewellery': 'Exquisite jewellery pieces to add sparkle to your style',
    'womens-shoes': 'Comfortable and stylish footwear for women',
    'womens-watches': 'Elegant watches designed for women',
  };
  
  return descriptions[slug] || `Explore our collection of ${slug.replace(/-/g, ' ')} products`;
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const limit = 12;
  const skip = (page - 1) * limit;

  const { data: categories } = useGetCategoriesQuery();
  const { data, isLoading, error } = useGetProductsByCategoryQuery({
    category: categorySlug,
    params: { limit, skip, sortBy, order }
  });

  const category = categories?.find(c => c.slug === categorySlug);
  const categoryName = category?.name || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [categorySlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {categoryName} products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">We couldn't load the products in this category.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Hero Section */}
      <section className={`bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/categories" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <FiArrowLeft className="w-4 h-4" />
              <span>All Categories</span>
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white/80">{categoryName}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-full ${getCategoryColor(categorySlug)} bg-opacity-20 flex items-center justify-center`}>
              {getCategoryIcon(categorySlug, "w-10 h-10")}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{categoryName}</h1>
              <p className="text-xl text-blue-100">
                {getCategoryDescription(categorySlug)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Stats */}
      <section className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <FiPackage className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-800">{data?.total || 0}</span> products
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiStar className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-800">4.5</span> avg rating
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-800">Top</span> selling
                </span>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Sorting */}
      <section className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <FiFilter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MdSort className="w-5 h-5 text-gray-500" />
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [newSortBy, newOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setOrder(newOrder as 'asc' | 'desc');
                  setPage(1);
                }}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="title-asc">Name (A to Z)</option>
                <option value="title-desc">Name (Z to A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="rating-desc">Rating (High to Low)</option>
                <option value="rating-asc">Rating (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Panel (Collapsible) */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold mb-3">Filter by:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price Range</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option>All Prices</option>
                  <option>Under ₹1000</option>
                  <option>₹1000 - ₹5000</option>
                  <option>₹5000 - ₹10000</option>
                  <option>Above ₹10000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Rating</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option>All Ratings</option>
                  <option>4★ & above</option>
                  <option>3★ & above</option>
                  <option>2★ & above</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Availability</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option>All</option>
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Discount</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option>All</option>
                  <option>10% & above</option>
                  <option>20% & above</option>
                  <option>30% & above</option>
                  <option>50% & above</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Clear All
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Products Grid/List */}
      <section className="container mx-auto px-4 py-8">
        {data?.products.length === 0 ? (
          <div className="text-center py-12">
            <MdCategory className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {data?.products.map((product: any) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4">
                    <div className="flex gap-4">
                      <div className="w-32 h-32 relative flex-shrink-0">
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                            {product.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xl font-bold text-gray-900">${product.price}</span>
                          {product.discountPercentage > 0 && (
                            <>
                              <span className="text-sm text-gray-400 line-through">
                                ${(product.price / (1 - product.discountPercentage/100)).toFixed(2)}
                              </span>
                              <span className="text-xs text-green-600 font-semibold">
                                {Math.round(product.discountPercentage)}% OFF
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{product.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">|</span>
                          <span className="text-sm text-gray-500">{product.brand}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Show first, last, and pages around current
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === page - 2 ||
                  pageNum === page + 2
                ) {
                  return <span key={pageNum} className="w-10 h-10 flex items-center justify-center">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
              className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>

      {/* Related Categories */}
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories?.filter(c => c.slug !== categorySlug).slice(0, 6).map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group text-center"
              >
                <div className={`w-20 h-20 mx-auto rounded-full ${getCategoryColor(category.slug)} bg-opacity-20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  {getCategoryIcon(category.slug, "w-8 h-8")}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}