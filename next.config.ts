import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // Add this line
  },
   eslint: {
    dirs: ['pages', 'utils'],
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
