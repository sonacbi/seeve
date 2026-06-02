module.exports = {
  webpack: {
    configure: (config) => {
      config.module.rules.forEach((rule) => {
        if (!rule.oneOf) return;

        rule.oneOf.forEach((r) => {
          if (
            r.loader &&
            r.loader.includes("@svgr/webpack")
          ) {
            r.options = {
              ...r.options,
              throwIfNamespace: false, // 👈 핵심
            };
          }
        });
      });

      return config;
    },
  },
};