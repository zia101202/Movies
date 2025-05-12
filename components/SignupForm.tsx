"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, UserCircle, UserPlus } from "lucide-react";

interface SignupData {
  name: string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<SignupData>({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { email, password } = formData;
        const res = await signIn("credentials", { email, password, redirect: false });
        if (res?.ok) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
      alert("Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="w-96 bg-gray-800 shadow-lg rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full pl-10 p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full pl-10 p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full pl-10 p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center space-x-2">
              <UserPlus size={20} />
              <span>Sign Up</span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupForm;
