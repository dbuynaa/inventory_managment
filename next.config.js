/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'my-blob-store.public.blob.vercel-storage.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'ytnv6xxemstkzalq.public.blob.vercel-storage.com',
        port: ''
      }
    ]
  }
};

export default config;
