import React, { useState } from "react";
import api from "../api/axiosClient";
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Zap} from 'lucide-react';

export default function FeatureLimitPopup({ featureName, onClose }) {
  // const [form, setForm] = useState({ email: "", phone: "", message: "" });
  // const [errors, setErrors] = useState({});
  // const [loading, setLoading] = useState(false);

  // const validate = () => {
  //   const newErrors = {};
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   if (!form.email.trim()) {
  //     newErrors.email = "Email is required";
  //   } else if (!emailRegex.test(form.email)) {
  //     newErrors.email = "Invalid email format";
  //   }

  //   if (!form.phone.trim()) {
  //     newErrors.phone = "Phone number is required";
  //   } else if (!/^[0-9]{10,15}$/.test(form.phone)) {
  //     newErrors.phone = "Enter a valid phone number (10–15 digits)";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleSubmit = async () => {
  //   if (!validate()) return;
  //   setLoading(true);
  //   try {
  //     await api.post("/contact", { ...form, feature_name: featureName });
  //     setForm({ email: "", phone: "", message: "" });
  //     setErrors({});
  //     onClose();
  //   } catch (err) {
  //     console.error(err);
  //     setErrors({ submit: "Failed to submit request. Please try again." });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Free Limit Reached
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          You’ve used all your available credits. Upgrade your plan to unlock unlimited usage.
        </p>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          
          <Link to="/pricing">
            <Button variant="outline" className="border-white/30 text-white hover:text-white  bg-violet-600 hover:bg-violet-700 backdrop-blur-sm gap-2">
              <Zap className="w-4 h-4" />
              View Pricing Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
