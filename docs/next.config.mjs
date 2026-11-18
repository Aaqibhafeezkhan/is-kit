/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['is-kit'],
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: '/en/:path*',
        destination: '/:path*',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
