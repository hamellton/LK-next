exports.config = {
    app_name: [`nextjs-frontend-${process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase() || ""}-${process.env.NEXT_PUBLIC_APP_CLIENT?.toLowerCase() || ""}-${process.env.NEXT_PUBLIC_APP_LANG?.toLowerCase() || ""}-${process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase() || ""}-eks`],
    license_key: process.env.NEXT_PUBLIC_NEWRELIC_KEY,
};
