/** @type {import('next').NextConfig} */



const nextConfig = {
  // assetPrefix: cdnURL,
  rewrites: async () => {
    return [
      {
        source: "/health",
        destination: "/api/healthcheck",
      },
    ];
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  compiler: {
    styledComponents: true,
  },
  compress: true,
  trailingSlash: false,
  reactStrictMode: false,
  // basePath: "",
  swcMinify: false,
  images: {
    domains: [
      "static.lenskart.com",
      "static1.lenskart.com",
      "static2.lenskart.com",
      "static3.lenskart.com",
      "static4.lenskart.com",
      "static5.lenskart.com",
    ],
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/checkout/onepage/retrypayment",
        destination: "/payment", // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: "/checkout/onepage/success",
        destination: "/checkout/success", // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: "/checkout/onepage/retry",
        destination: "/checkout/retry", // Matched parameters can be used in the destination
        permanent: true,
      },
    ];
  },
};

if (
  process.env.NEXT_PUBLIC_BASE_ROUTE &&
  process.env.NEXT_PUBLIC_BASE_ROUTE !== "NA"
) {
  nextConfig.basePath = `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`;
}

if(process.env.NEXT_PUBLIC_APP_ENV === "prod" || process.env.NEXT_PUBLIC_APP_ENV === "preprod") {
  const env = process.env.NEXT_PUBLIC_APP_ENV.toLowerCase(); 
  const countryLang = `${process.env.NEXT_PUBLIC_APP_LANG}-${process.env.NEXT_PUBLIC_APP_COUNTRY}`;
  const device = process.env.NEXT_PUBLIC_APP_CLIENT.toLowerCase();
  const cdnURL = `https://static-web-${env}.lenskart.com/${countryLang}/${device}/${process.env.NEXT_PUBLIC_BUILD_TIMESTAMP}`;

  nextConfig.assetPrefix = cdnURL
}
module.exports = nextConfig;
