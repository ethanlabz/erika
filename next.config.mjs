import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  // solves the pdf iFrame rendering issue by allowing the files to be framed only by the site
  async headers() {
    return [
      {
        // Target your static syllabus files directory inside the public folder
        source: "/syllabus/:path*", 
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // Allows your own site to wrap it inside an iframe securely
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self';", // Modern browser handshake companion
          },
        ],
      },
    ];
  },
};

export default withMDX(config);
