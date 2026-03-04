"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiChevronDown, 
  FiHeart, 
  FiLogOut,
  FiMenu,
  FiX,
  FiPhone,
  FiShield,
  FiTrendingUp,
  FiGift,
  FiPackage,
  FiSettings,
  FiLogIn
} from "react-icons/fi";
import { 
  MdStorefront, 
  MdCategory,
  MdOutlineToys,
  MdSportsSoccer 
} from "react-icons/md";
import { 
  BsHandbag, 
  BsFlower1,
  BsPersonPlus 
} from "react-icons/bs";
import { 
  FaTshirt, 
  FaCouch,
  FaUserCircle 
} from "react-icons/fa";
import { 
  IoIosArrowForward 
} from "react-icons/io";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  
  const cartItems = useAppSelector((state) => state.cart.items);
  const { user, token } = useAppSelector((state) => state.auth);
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
  // Clear Redux state
  dispatch(logout());
  
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Clear cookie - this is crucial for middleware
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  
  // Close dropdowns
  setIsProfileOpen(false);
  setIsMenuOpen(false);
  
  // Redirect to login
  router.push('/login');
};

  const categories = [
    { name: "Electronics", icon: <FiPackage className="w-5 h-5" />, slug: "laptops" },
    { name: "Fashion", icon: <FaTshirt className="w-5 h-5" />, slug: "mens-shirts" },
    { name: "Home & Furniture", icon: <FaCouch className="w-5 h-5" />, slug: "furniture" },
    { name: "Beauty", icon: <BsFlower1 className="w-5 h-5" />, slug: "beauty" },
    { name: "Sports", icon: <MdSportsSoccer className="w-5 h-5" />, slug: "sports-accessories" },
    { name: "Toys", icon: <MdOutlineToys className="w-5 h-5" />, slug: "toys" },
  ];

  // Don't render auth-dependent content until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          {/* Desktop View */}
          <div className="hidden lg:flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform">
                <BsHandbag className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-800">FlipStore</span>
                <span className="text-xs text-gray-500 italic">Explore Plus</span>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="w-full px-5 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-6 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Right Section */}
            <div className="flex items-center space-x-6">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {user?.image ? (
                    <img 
                      src={user.image} 
                      alt={user.firstName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-6 h-6" />
                  )}
                  <span className="font-medium">{user ? user.firstName : "Account"}</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-800">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FiUser className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>
                        <hr className="my-2 border-gray-200" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FiLogIn className="w-4 h-4" />
                          <span>Sign In</span>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link 
                href="/cart" 
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span className="font-medium">Cart</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden py-3">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
              
              <Link href="/" className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-blue-600">
                  <BsHandbag className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-gray-800">FlipStore</span>
              </Link>

              <div className="flex items-center space-x-3">
                <Link href="/cart" className="relative p-2">
                  <FiShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Categories Bar */}
          <div className="hidden lg:block border-t border-gray-200 py-2">
            <div className="flex items-center justify-center space-x-8">
              <div
                className="relative"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  <MdCategory className="w-5 h-5" />
                  <span>All Categories</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={`/category/${category.slug}`}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        <span className="text-gray-600">{category.icon}</span>
                        <span>{category.name}</span>
                        <IoIosArrowForward className="w-4 h-4 ml-auto text-gray-400" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/category/${category.slug}`}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white pt-20 overflow-y-auto">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-4">
                {/* User Info/Login Section */}
                <div className="border-b border-gray-200 pb-4">
                  {user ? (
                    <div className="flex items-center space-x-3 mb-3">
                      {user.image ? (
                        <img 
                          src={user.image} 
                          alt={user.firstName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUserCircle className="w-8 h-8 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <FiUser className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Hello, Guest</p>
                        <div className="flex space-x-2 mt-1">
                          <Link 
                            href="/login" 
                            className="text-sm text-blue-600 hover:text-blue-700"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Sign In
                          </Link>
                          <span className="text-sm text-gray-400">|</span>
                          <Link 
                            href="/register" 
                            className="text-sm text-blue-600 hover:text-blue-700"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Register
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  <Link
                    href="/orders"
                    className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiPackage className="w-5 h-5" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiHeart className="w-5 h-5" />
                    <span>Wishlist</span>
                  </Link>
                  <Link
                    href="/sell"
                    className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MdStorefront className="w-5 h-5" />
                    <span>Become a Seller</span>
                  </Link>
                </div>

                {/* Categories */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold mb-2 flex items-center text-gray-800">
                    <MdCategory className="w-5 h-5 mr-2" />
                    Shop by Category
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={`/category/${category.slug}`}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-gray-600">{category.icon}</span>
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Logout for authenticated users */}
                {user && (
                  <div className="border-t border-gray-200 pt-4">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
                    >
                      <FiLogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}