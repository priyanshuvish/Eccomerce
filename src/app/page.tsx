"use client";

import ProductCard from "@/components/ProductCard";
import { useGetCategoriesQuery, useGetProductsQuery } from "@/redux/features/productApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  FaKickstarter,
  FaLaptop,
  FaMobile,
  FaMotorcycle,
  FaShoePrints as FaShoeIcon,
  FaShoePrints,
  FaTshirt,
  FaTshirt as FaTShirtIcon
} from "react-icons/fa";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiHeadphones,
  FiPercent,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTruck
} from "react-icons/fi";
import { GiLipstick, GiPerfumeBottle, GiRunningShoe, GiWatch } from "react-icons/gi";
import {
  MdFlashOn,
  MdKeyboardArrowRight,
  MdOutlineVerified
} from "react-icons/md";

// Helper function to get icon for category
const getCategoryIcon = (slug: string, className = "w-6 h-6") => {
  const iconMap: { [key: string]: JSX.Element } = {
    'beauty': <GiLipstick className={className} />,
    'fragrances': <GiPerfumeBottle className={className} />,
    'furniture': <FaCouch className={className} />,
    'groceries': <FaAppleAlt className={className} />,
    'home-decoration': <FaHome className={className} />,
    'kitchen-accessories': <FaKickstarter className={className} />,
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
  
  return iconMap[slug] || <MdKeyboardArrowRight className={className} />;
};

// Helper function to get color for category
const getCategoryColor = (slug: string) => {
  const colorMap: { [key: string]: string } = {
    'beauty': 'bg-pink-100',
    'fragrances': 'bg-purple-100',
    'furniture': 'bg-amber-100',
    'groceries': 'bg-green-100',
    'home-decoration': 'bg-yellow-100',
    'kitchen-accessories': 'bg-orange-100',
    'laptops': 'bg-blue-100',
    'mens-shirts': 'bg-indigo-100',
    'mens-shoes': 'bg-cyan-100',
    'mens-watches': 'bg-teal-100',
    'mobile-accessories': 'bg-sky-100',
    'motorcycle': 'bg-red-100',
    'skin-care': 'bg-rose-100',
    'smartphones': 'bg-emerald-100',
    'sports-accessories': 'bg-lime-100',
    'sunglasses': 'bg-violet-100',
    'tablets': 'bg-fuchsia-100',
    'tops': 'bg-pink-100',
    'vehicle': 'bg-gray-100',
    'womens-bags': 'bg-purple-100',
    'womens-dresses': 'bg-rose-100',
    'womens-jewellery': 'bg-amber-100',
    'womens-shoes': 'bg-indigo-100',
    'womens-watches': 'bg-teal-100',
  };
  
  return colorMap[slug] || 'bg-gray-100';
};

// Banner data with gradient colors instead of images
const banners = [
  { 
    id: 1, 
    title: "Summer Sale", 
    discount: "50-80%", 
    link: "/category/smartphones",
    gradient: "from-orange-500 to-red-500",
    icon: "☀️"
  },
  { 
    id: 2, 
    title: "Electronics", 
    discount: "Up to 70%", 
    link: "/category/laptops",
    gradient: "from-blue-500 to-cyan-500",
    icon: "💻"
  },
  { 
    id: 3, 
    title: "Fashion", 
    discount: "Min 40%", 
    link: "/category/mens-shirts",
    gradient: "from-purple-500 to-pink-500",
    icon: "👕"
  },
  { 
    id: 4, 
    title: "Home Decor", 
    discount: "Flat 30%", 
    link: "/category/home-decoration",
    gradient: "from-green-500 to-teal-500",
    icon: "🏠"
  },
];

// Featured brands with colors
const brands = [
  { name: "Nike", color: "bg-red-500", textColor: "text-white" },
  { name: "Apple", color: "bg-gray-900", textColor: "text-white" },
  { name: "Samsung", color: "bg-blue-600", textColor: "text-white" },
  { name: "Adidas", color: "bg-black", textColor: "text-white" },
  { name: "Sony", color: "bg-green-600", textColor: "text-white" },
  { name: "LG", color: "bg-red-600", textColor: "text-white" },
];

export default function Home() {
  const router = useRouter();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products for different sections
  const { data: recommendedData, isLoading: recommendedLoading, error: recommendedError } = 
    useGetProductsQuery({ limit: 8, sortBy: 'rating', order: 'desc' });
  
  
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (recommendedLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing products for you...</p>
        </div>
      </div>
    );
  }

  if (recommendedError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">We couldn't load the products. Please try again.</p>
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
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to FlipStore
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              India's Largest Online Shopping Destination
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more..."
className="w-full px-6 py-4 rounded-full border-2 border-white text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 pr-14"              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </form>

            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <span className="text-blue-200">Popular:</span>
              {["iPhone", "Samsung", "Nike", "Laptop", "Watch"].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${term}`}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm hover:bg-white/30 transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4">
            {[
              { icon: <FiTruck className="w-5 h-5" />, text: "Free Delivery", subtext: "On orders ₹999+" },
              { icon: <FiRefreshCw className="w-5 h-5" />, text: "Easy Returns", subtext: "7 days replacement" },
              { icon: <FiShield className="w-5 h-5" />, text: "Secure Payment", subtext: "100% protection" },
              { icon: <FiHeadphones className="w-5 h-5" />, text: "24/7 Support", subtext: "Dedicated help" },
              { icon: <FiPercent className="w-5 h-5" />, text: "Best Offers", subtext: "Daily deals" },
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 text-gray-700">
                <div className="text-blue-600">{feature.icon}</div>
                <div>
                  <p className="font-semibold text-sm">{feature.text}</p>
                  <p className="text-xs text-gray-500">{feature.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
          <Link href="/categories" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <MdKeyboardArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categoriesData?.slice(0, 12).map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 ${getCategoryColor(category.slug)} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <div className="text-gray-700">
                  {getCategoryIcon(category.slug, "w-6 h-6")}
                </div>
              </div>
              <span className="text-sm text-center font-medium text-gray-700 group-hover:text-blue-600 line-clamp-1">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Banner Carousel */}
      <section className="container mx-auto px-4 py-8">
        <div className="relative rounded-2xl overflow-hidden h-64 md:h-96">
          <div 
            className="absolute inset-0 flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div key={banner.id} className="min-w-full h-full relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-20 text-white text-center">
                  <div>
                    <div className="text-6xl mb-4">{banner.icon}</div>
                    <h3 className="text-3xl md:text-5xl font-bold mb-2">{banner.title}</h3>
                    <p className="text-xl md:text-2xl mb-4">Up to {banner.discount} OFF</p>
                    <Link 
                      href={banner.link}
                      className="inline-flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Shop Now <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          <button
            onClick={prevBanner}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentBanner ? 'w-8 bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Products Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recommended for You</h2>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <MdKeyboardArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedData?.products?.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Brands */}
      <section className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Featured Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand, index) => (
              <Link
                key={index}
                href={`/search?q=${brand.name}`}
                className="group flex flex-col items-center p-4 hover:shadow-lg rounded-xl transition-all duration-300"
              >
                <div className={`w-20 h-20 ${brand.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                  <span className={`text-2xl font-bold ${brand.textColor}`}>{brand.name[0]}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <BsBagCheck className="w-12 h-12" />, title: "100% Authentic", desc: "Genuine products guaranteed" },
              { icon: <FiTruck className="w-12 h-12" />, title: "Free Shipping", desc: "On orders above ₹999" },
              { icon: <FiRefreshCw className="w-12 h-12" />, title: "Easy Returns", desc: "7-day replacement policy" },
              { icon: <MdOutlineVerified className="w-12 h-12" />, title: "Secure Payments", desc: "100% payment protection" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-blue-600 mb-4 flex justify-center">{item.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}