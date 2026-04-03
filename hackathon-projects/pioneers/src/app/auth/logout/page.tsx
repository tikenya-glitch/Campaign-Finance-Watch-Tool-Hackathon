"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate logout process
    const performLogout = async () => {
      try {
        // Clear any client-side storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear any cookies (in a real app, you'd use a server action)
        document.cookie.split(";").forEach((c) => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Simulate server logout call
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {
          // Ignore if endpoint doesn't exist
        });

        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } catch (error) {
        console.error("Logout error:", error);
        // Still redirect even if there's an error
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Logging Out</h1>
          <p className="text-gray-600">Please wait while we secure your session...</p>
        </div>
      </div>
    </div>
  );
}
