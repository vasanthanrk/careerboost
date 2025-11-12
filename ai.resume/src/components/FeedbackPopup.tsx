import React, { useState } from "react";
import api from "../api/axiosClient";
import { toast } from 'sonner@2.0.3';

export default function FeedbackPopup({ userId, typeUsed, onClose }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (maybeLater = false) => {
    setLoading(true);
    try {
      const res = await api.post("/feedback", {
        user_id: userId,
        rating: maybeLater ? null : rating,
        description: maybeLater ? null : description,
        type_used: typeUsed,
        maybe_later: maybeLater,
      });
      onClose();
      toast.success(res.data.message);
    } catch (err) {
      console.error("Feedback error:", err);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" style={{ background: "#00000096" }}>
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          How was your experience?
        </h2>

        {/* ⭐ Star Rating */}
        <div className="flex justify-center mb-5">
          {[1, 2, 3, 4, 5].map((value) => {
            const isActive = value <= (hover || rating);
            return (
              <span
                key={value}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(null)}
                style={{
                  fontSize: "2rem",
                  color: isActive ? "#FFD700" : "#d1d5db", // ✅ Gold or gray
                  cursor: "pointer",
                  transition: "transform 0.2s ease, color 0.2s ease",
                  transform: isActive ? "scale(1.2)" : "scale(1)",
                }}
              >
                ★
              </span>
            );
          })}
        </div>

        {/* 💬 Description */}
        <textarea
          rows="3"
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
          placeholder="Tell us what you liked or what could be improved..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Buttons */}
        <div className="mt-5 flex justify-between items-center">
          <button
            onClick={() => handleSubmit(true)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Maybe later
          </button>

          <button
            onClick={() => handleSubmit(false)}
            disabled={loading || rating === 0}
            className={`px-4 py-2 rounded-md text-white transition-all ${
              rating === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
