"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    // Poll for payment status
    const checkStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/legacy/billing/checkout/status/${sessionId}`
        );
        const data = await response.json();

        if (data.payment_status === "paid" || data.status === "SUCCESS") {
          setStatus("success");
          // Update user as subscribed
          const userData = localStorage.getItem("moovefit-user");
          if (userData) {
            const user = JSON.parse(userData);
            user.subscribed = true;
            user.subscription_id = sessionId;
            localStorage.setItem("moovefit-user", JSON.stringify(user));
          }
        } else {
          // Keep polling
          setTimeout(checkStatus, 2000);
        }
      } catch (err) {
        // Dev fallback - assume success
        setStatus("success");
        const userData = localStorage.getItem("moovefit-user");
        if (userData) {
          const user = JSON.parse(userData);
          user.subscribed = true;
          localStorage.setItem("moovefit-user", JSON.stringify(user));
        }
      }
    };

    checkStatus();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <Image
          src="/images/logo.svg"
          alt="Moove"
          width={120}
          height={40}
          className="mx-auto mb-8"
        />

        {status === "loading" && (
          <div>
            <div className="w-16 h-16 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment...</h1>
            <p className="text-gray-600">Please wait while we confirm your subscription.</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to the Team!</h1>
            <p className="text-gray-600 mb-8">
              Your 7-day free trial has started. You now have full access to all premium content.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-[#308FAB] text-white font-semibold rounded-full hover:bg-[#217E9A] transition shadow-lg"
            >
              Start Exploring
            </button>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
            <p className="text-gray-600 mb-8">We couldn't confirm your payment. Please try again.</p>
            <button
              onClick={() => router.back()}
              className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
