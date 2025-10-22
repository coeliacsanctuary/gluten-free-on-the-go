const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Expo 53 requires you to destructure and rebuild the resolver arrays
const { assetExts, sourceExts } = config.resolver;

config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer",
);
config.resolver.assetExts = assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts = [...sourceExts, "svg", "cjs"]; // include cjs for RN 0.76+

module.exports = config;
