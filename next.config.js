const withImages = require("next-images");
/** @type {import('next').NextConfig} */
module.exports = withImages({
  webpack(config, options) {
    delete config.resolve.alias.url;
    return config;
  },
  // comment below when building on localhost
  
  // trailingSlash: true,
  // exportTrailingSlash: true,
  // exportPathMap: async function (
  //   defaultPathMap,
  //   { dev, dir, outDir, distDir, buildId }
  // ) {
  //   return {
  //     "/": { page: "/" },
  //     "/auth/login": { page: "/auth/login" },
  //     "/auth/register": { page: "/auth/register" },
  //   };
  // },

  // // distDir: "../../dist/client",
  // // output: "standalone",

  // // false for dev, true for product
  // reactStrictMode: true,
  // swcMinify: true,
  // images: {
  //   domains: ["s120-ava-talk.zadn.vn", "blob"],
  //   },
  // },
});
