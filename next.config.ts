import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // eslint: {
  //   ignoreDuringBuilds: true,
  // }

  images: {
    // domains: ["https://bvfgbtpd-2000.asse.devtunnels.ms"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bgfvcvkxbchpovqtwvuc.supabase.co',
        // port: '2000',
        pathname: '/storage/v1/object/public/user-photos/**',
      },
    ],
  },
};

export default nextConfig;
