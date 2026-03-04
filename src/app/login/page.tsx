"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLoginMutation } from "@/redux/features/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials, setError, clearError } from "@/redux/features/authSlice";
import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiAlertCircle
} from "react-icons/fi";
import { BsShieldCheck } from "react-icons/bs";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [formError, setFormError] = useState("");

    const [login, { isLoading }] = useLoginMutation();

    // Demo credentials for testing
    const demoCredentials = [
        { username: "emilys", password: "emilyspass", role: "Admin" },
        { username: "michaelw", password: "michaelwpass", role: "User" },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setFormError("");
        dispatch(clearError());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            setFormError("Please enter both username and password");
            return;
        }

        try {
            const response = await login({
                username: formData.username,
                password: formData.password,
                expiresInMins: 60,
            }).unwrap();

            // Store in Redux
            dispatch(setCredentials({
                user: {
                    id: response.id,
                    username: response.username,
                    email: response.email,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    gender: response.gender,
                    image: response.image,
                },
                token: response.accessToken,   // ✅ FIXED
                refreshToken: response.refreshToken,
            }));

            // Store in localStorage if remember me is checked
            if (rememberMe) {
                // Set cookie with proper options for middleware to read
                document.cookie = `token=${response.accessToken}; path=/; max-age=604800; SameSite=Lax`;
                if (response.refreshToken) {
                    localStorage.setItem("refreshToken", response.refreshToken);
                }
                localStorage.setItem('user', JSON.stringify({
                    id: response.id,
                    username: response.username,
                    email: response.email,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    gender: response.gender,
                    image: response.image,
                }));
            } else {
                // Session cookie (expires when browser closes)
                document.cookie = `token=${response.accessToken}; path=/; SameSite=Lax; secure=${process.env.NODE_ENV === 'production'}`;
            }

            // Add a small delay to ensure cookie is set before redirect
            setTimeout(() => {
                router.push('/');
            }, 100);


        } catch (err: any) {
            console.error('Login failed:', err);
            if (err.status === 400) {
                setFormError("Invalid username or password");
            } else {
                setFormError("Login failed. Please try again.");
            }
            dispatch(setError("Login failed"));
        }
    };

    const fillDemoCredentials = (username: string, password: string) => {
        setFormData({ username, password });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center items-center gap-2 mb-6">
                    <div className="text-3xl font-bold text-blue-600">🛍️</div>
                    <span className="text-2xl font-bold text-gray-800">FlipStore</span>
                </Link>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                    {/* Demo Credentials Alert */}
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <BsShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-blue-800">Demo Credentials</h3>
                                <p className="text-xs text-blue-700 mt-1">Use these for testing:</p>
                                <div className="mt-2 space-y-2">
                                    {demoCredentials.map((demo, index) => (
                                        <button
                                            key={index}
                                            onClick={() => fillDemoCredentials(demo.username, demo.password)}
                                            className="w-full text-left text-xs bg-white border border-blue-200 rounded-md p-2 hover:bg-blue-50 transition-colors"
                                        >
                                            <span className="font-medium text-blue-800">{demo.role}:</span>{' '}
                                            <code className="text-gray-600">{demo.username}</code> /{' '}
                                            <code className="text-gray-600">{demo.password}</code>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {(formError || (typeof window !== 'undefined' && window.location.search.includes('error'))) && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-red-700">
                                <FiAlertCircle className="w-5 h-5" />
                                <p className="text-sm">{formError || "Authentication failed"}</p>
                            </div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign in</span>
                                        <FiArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Social Login */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                                <FaGoogle className="w-5 h-5" />
                            </button>
                            <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                                <FaFacebook className="w-5 h-5 text-blue-600" />
                            </button>
                            <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                                <FaApple className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="mt-6 text-center text-xs text-gray-500">
                        <p>🔒 Your credentials are securely encrypted</p>
                    </div>
                </div>
            </div>
        </div>
    );
}