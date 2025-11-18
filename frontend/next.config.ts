/** @type {import('next').NextConfig} */


module.exports = { 
async redirects() {
    return [
      {
        source: '/about',
        destination: '/login',
        permanent: true,
      },
    ]
  },
}

