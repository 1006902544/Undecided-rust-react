const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    BASE_URL: 'http://127.0.0.1:8080',
    NAME: 'nazabanma',
  },
};

module.exports = nextConfig;
