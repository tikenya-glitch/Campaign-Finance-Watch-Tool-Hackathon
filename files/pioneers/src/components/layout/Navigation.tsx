"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/images/logo.png" 
              alt="Polifin Logo" 
              className="w-32 h-32 rounded-lg object-contain"
            />
            
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-gray-900">PFRI</h1>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setActiveTab("home")}
              className={`relative font-medium transition-colors ${
                activeTab === "home" 
                  ? "text-blue-600" 
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Home
              {activeTab === "home" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`relative font-medium transition-colors ${
                activeTab === "dashboard" 
                  ? "text-blue-600" 
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Dashboard
              {activeTab === "dashboard" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("reports")}
              className={`relative font-medium transition-colors ${
                activeTab === "reports" 
                  ? "text-blue-600" 
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Reports
              {activeTab === "reports" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("portal")}
              className={`relative font-medium transition-colors ${
                activeTab === "portal" 
                  ? "text-blue-600" 
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Portal
              {activeTab === "portal" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("about")}
              className={`relative font-medium transition-colors ${
                activeTab === "about" 
                  ? "text-blue-600" 
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              About
              {activeTab === "about" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            {/* Profile Icon */}
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Login/Sign Up Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
          <div className="px-4 py-3 space-y-2">
            <button 
              onClick={() => setActiveTab("home")}
              className={`block w-full px-3 py-2 font-medium rounded-lg transition-colors ${
                activeTab === "home" 
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`block w-full px-3 py-2 font-medium rounded-lg transition-colors ${
                activeTab === "dashboard" 
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab("reports")}
              className={`block w-full px-3 py-2 font-medium rounded-lg transition-colors ${
                activeTab === "reports" 
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Reports
            </button>
            <button 
              onClick={() => setActiveTab("portal")}
              className={`block w-full px-3 py-2 font-medium rounded-lg transition-colors ${
                activeTab === "portal" 
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Transparency Portal
            </button>
            <button 
              onClick={() => setActiveTab("about")}
              className={`block w-full px-3 py-2 font-medium rounded-lg transition-colors ${
                activeTab === "about" 
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              About
            </button>
            <div className="pt-3 border-t border-gray-200">
              <Link href="/login" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">Login</Link>
              <Link href="/signup" className="block px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mt-1">Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
