"use client";

import { useGetCategoriesQuery, useGetCategoryListQuery, useGetProductsQuery } from "@/redux/features/productApi";
import Link from "next/link";
import { JSX, useState } from "react";
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
    FaHeart,
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
    FiClock,
    FiGrid,
    FiList,
    FiPackage,
    FiSearch,
    FiStar,
    FiTrendingUp
} from "react-icons/fi";
import { GiLipstick, GiPerfumeBottle, GiRunningShoe, GiWatch } from "react-icons/gi";
import {
    MdCategory,
    MdKeyboardArrowRight,
    MdLocalOffer
} from "react-icons/md";

// Helper function to get icon for category
const getCategoryIcon = (slug: string, className = "w-8 h-8") => {
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

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
  const { data: categoryList, isLoading: listLoading } = useGetCategoryListQuery();

  // Filter categories based on search
  const filteredCategories = categories?.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group categories by first letter for alphabet navigation
  const groupedCategories = filteredCategories?.reduce((groups: any, category) => {
    const firstLetter = category.name[0].toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(category);
    return groups;
  }, {});

  const alphabet = Object.keys(groupedCategories || {}).sort();

  if (categoriesLoading || listLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">We couldn't load the categories. Please try again.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop by Category
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Browse through {categories?.length || 0}+ categories to find exactly what you're looking for
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 pl-14"
              />
              <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Alphabet Navigation */}
      {alphabet.length > 0 && (
        <section className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 py-3 overflow-x-auto">
              {alphabet.map(letter => (
                <a
                  key={letter}
                  href={`#category-${letter}`}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* View Mode Toggle */}
      <section className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredCategories?.length || 0}</span> categories
          </p>
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Categories Grid/List */}
      <section className="container mx-auto px-4 py-8">
        {alphabet.map(letter => (
          <div key={letter} id={`category-${letter}`} className="mb-12 scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
              {letter}
            </h2>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groupedCategories[letter].map((category: any) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className={`p-6 ${getCategoryColor(category.slug)} bg-opacity-10`}>
                      <div className="flex items-start justify-between">
                        <div className={`w-16 h-16 rounded-full ${getCategoryColor(category.slug)} bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          {getCategoryIcon(category.slug, "w-8 h-8")}
                        </div>
                        <MdKeyboardArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mt-4 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {getCategoryDescription(category.slug)}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiPackage className="w-4 h-4" />
                          {Math.floor(Math.random() * 500) + 100} products
                        </span>
                        <span className="flex items-center gap-1">
                          <FiTrendingUp className="w-4 h-4" />
                          Top rated
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {groupedCategories[letter].map((category: any) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6 flex items-start gap-6">
                      <div className={`w-20 h-20 rounded-xl ${getCategoryColor(category.slug)} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                        {getCategoryIcon(category.slug, "w-10 h-10")}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {category.name}
                            </h3>
                            <p className="text-gray-600 mt-2 line-clamp-2 max-w-2xl">
                              {getCategoryDescription(category.slug)}
                            </p>
                          </div>
                          <MdKeyboardArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                        <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiPackage className="w-4 h-4" />
                            {Math.floor(Math.random() * 500) + 100} products
                          </span>
                          <span className="flex items-center gap-1">
                            <FiStar className="w-4 h-4" />
                            4.5 avg rating
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock className="w-4 h-4" />
                            Fast delivery
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredCategories?.length === 0 && (
          <div className="text-center py-12">
            <MdCategory className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search term</p>
          </div>
        )}
      </section>

      {/* Category Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <MdCategory className="w-8 h-8" />, value: categories?.length || 0, label: "Categories" },
            { icon: <FiPackage className="w-8 h-8" />, value: "10K+", label: "Products" },
            { icon: <FaHeart className="w-8 h-8" />, value: "500+", label: "Brands" },
            { icon: <MdLocalOffer className="w-8 h-8" />, value: "50%", label: "Avg. Discount" },
          ].map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-xl p-6 shadow-sm">
              <div className="text-blue-600 mb-3 flex justify-center">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}