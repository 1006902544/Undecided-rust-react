/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    APP_ENV: process.env.APP_ENV,
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
