import React, { useState } from "react";
import api from "../api/axiosClient";

export default function FeatureLimitPopup({ featureName, onClose }) {
  const [form, setForm] = useState({ email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,15}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid phone number (10–15 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/contact", { ...form, feature_name: featureName });
      setForm({ email: "", phone: "", message: "" });
      setErrors({});
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to submit request. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Free Limit Reached
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          You’ve already used this feature 3 times.
          Please contact us to unlock more usage.
        </p>

        {/* Email Field */}
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-2 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Phone"
            className={`w-full p-2 border rounded ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Message Field */}
        <div className="mb-3">
          <textarea
            placeholder="Message (optional)"
            className="w-full p-2 border border-gray-300 rounded resize-none"
            rows={3}
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          ></textarea>
        </div>

        {/* Error Message (Submit) */}
        {errors.submit && (
          <p className="text-red-500 text-sm text-center mb-2">
            {errors.submit}
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${
              loading
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
