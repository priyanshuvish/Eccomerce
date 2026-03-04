"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useGetCurrentUserQuery } from "@/redux/features/authApi";
import { logout } from "@/redux/features/authSlice";
import {
  FiUser,
  FiMail,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import { MdVerified, MdLocalOffer } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { BsGenderAmbiguous } from "react-icons/bs";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // Fetch user
  const { data: user, isLoading, error, refetch } =
    useGetCurrentUserQuery(token ?? "", {
      skip: !token,
    });

  const handleLogout = () => {
    dispatch(logout());
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    router.push("/login");
  };

  if (!token) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Failed to load profile
          </p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">

          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            <button
              onClick={() => router.push("/")}
              className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg"
            >
              ← Back to Home
            </button>
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-4">

              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUserCircle className="w-16 h-16 text-blue-500" />
                  </div>
                )}
              </div>

              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-500 flex items-center gap-2 mt-1">
                  <FiMail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {["profile", "orders", "wishlist"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Name
        </label>
        <p className="bg-gray-50 px-4 py-2 rounded-lg text-gray-900 border border-gray-200">
          {user.firstName}
        </p>
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Name
        </label>
        <p className="bg-gray-50 px-4 py-2 rounded-lg text-gray-900 border border-gray-200">
          {user.lastName}
        </p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <p className="bg-gray-50 px-4 py-2 rounded-lg text-gray-900 border border-gray-200">
          {user.email}
        </p>
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <p className="bg-gray-50 px-4 py-2 rounded-lg text-gray-900 border border-gray-200">
          {user.username}
        </p>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender
        </label>
        <p className="bg-gray-50 px-4 py-2 rounded-lg text-gray-900 border border-gray-200 capitalize">
          {user.gender}
        </p>
      </div>

    </div>
  </div>
)}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>
    </div>
  );
}