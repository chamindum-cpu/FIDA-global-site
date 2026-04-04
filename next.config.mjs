/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/aboutus.html', destination: '/about', permanent: true },
      { source: '/services.html', destination: '/services', permanent: true },
      { source: '/procustsmain.html', destination: '/solutions', permanent: true },
      { source: '/support.html', destination: '/careers', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
    ];
  },
};

export default nextConfig;

