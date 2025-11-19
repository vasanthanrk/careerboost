import React from "react";
import SubscribeButton from "../components/SubscribeButton";

export default function Plans() {
  const userId = 1; // your auth system
  const planId = 1; // select monthly plan

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>

      <div className="border p-4 rounded shadow w-80">
        <h3 className="text-xl font-semibold">Premium Monthly</h3>
        <p className="text-gray-600 mt-1">₹499 per month</p>

        <SubscribeButton userId={userId} planId={planId} />
      </div>
    </div>
  );
}
