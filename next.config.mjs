/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.tildacdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "optim.tildacdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
