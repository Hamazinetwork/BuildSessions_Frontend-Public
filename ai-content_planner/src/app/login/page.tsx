"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { login } from "@/store";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            setSuccess("Login successful! Redirecting...");
            setTimeout(() => router.push("/"), 1000);
        }
    }, [currentUser, router]);

    const validateForm = () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            dispatch(login({ email, password }));
            if (!currentUser) {
                setError("Invalid email or password");
            }
        } catch (error) {
            setError("An unexpected error occurred");
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back to ContentCraft</h1>
                    <p className="text-gray-600">Sign in to your account to continue</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-6">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-6">
                        <p className="text-sm text-green-800">{success}</p>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                        <a href="/reset-password" className="text-sm text-blue-600 hover:text-blue-500">
                            Forgot password?
                        </a>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <a href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                            Sign up
                        </a>
                    </p>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs text-yellow-800">
                        <strong>Development:</strong> Use admin@example.com (admin123) or user@example.com (user123) to test login
                    </p>
                </div>
            </Card>
        </div>
    );
}