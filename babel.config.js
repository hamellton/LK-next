module.exports = function (api) {
  api.cache(true);

  const presets = ["next/babel"];
  const plugins = [["styled-components", { ssr: true }]];

  if (
    ["prod", "production"].includes(
      process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase?.()
    )
  ) {
    plugins.push("transform-remove-console");
  }

  return {
    presets: presets,
    plugins: plugins,
  };
};
