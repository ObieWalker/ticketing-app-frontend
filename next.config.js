module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config
  },
  env: {
    BACKEND_SERVER_URL: process.env.BACKEND_SERVER_URL,
    API_SERVER: process.env.API_SERVER,
    HTTPS: process.env.HTTPS,
    ENV: process.env.ENV
  }
}