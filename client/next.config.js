/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: 84242243,
    NEXT_PUBLIC_ZEGO_SERVER_SECRET:"c6d350eef3ecf49388773a2badb8e2a7",
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
