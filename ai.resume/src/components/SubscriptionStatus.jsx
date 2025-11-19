import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function SubscriptionStatus({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/subscription/status?user_id=${userId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  if (!data) return <p>Loading...</p>;

  if (data.active) {
    return (
      <div className="p-3 bg-green-100 text-green-800 rounded">
        Active until {new Date(data.expires_on).toLocaleDateString()}
      </div>
    );
  }

  return (
    <div className="p-3 bg-red-100 text-red-800 rounded">
      No active subscription
    </div>
  );
}
