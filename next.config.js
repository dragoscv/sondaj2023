/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
}

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV !== 'production',
})

module.exports = withPWA({ ...nextConfig })
