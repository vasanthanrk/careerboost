import React, { useState } from "react";
import api from "../api/axiosClient";
import { loadScript } from "../utils/loadScript";
import { toast } from 'sonner@2.0.3';
import { Button } from './ui/button';

export default function SubscribeButton({ userId, planId, className, planText }) {
  const [loading, setLoading] = useState(false);

  const gateway = import.meta.env.VITE_APP_PAYMENT_GATEWAY;

  const startSubscription = async () => {
    setLoading(true);

    try {
      // 1. Ask backend to create subscription session/order
      const res = await api.post("/subscription/start", {
        user_id: userId,
        plan_id: planId,
      });
      
      if (res.data?.gateway === "razorpay") {
        await handleRazorpayCheckout(res.data.order);
      }

      if (res.data?.gateway === "stripe") {
        window.location.href = res.data.checkout_url;
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to start subscription");
    }

    setLoading(false);
  };

  // ----------------------------
  // RAZORPAY Checkout
  // ----------------------------
  const handleRazorpayCheckout = async (order) => {
    const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!loaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: import.meta.env.VITE_APP_RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "CareerBay",
      description: "Subscription Payment",
      order_id: order.id,
      handler: async function (response) {
        toast.success("Payment successful!");

        // Send payment to backend
        await api.post("/payments/verify", {
          order_id: order.id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          user_id: userId,
          plan_id: planId,
        });

        window.location.reload();
      },
      prefill: {
        name: "User",
        email: "user@example.com",
      },
      theme: {
        color: "#0ab37c",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Button
      disabled={loading}
      onClick={startSubscription}
      className={`
        px-6 py-3 text-white rounded-md
        ${className}
      `}
    >
      {loading ? "Processing..." : planText}
    </Button>
  );
}
