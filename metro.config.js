const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Optional: pastikan .cjs juga termasuk untuk Expo SDK 54+
config.resolver.sourceExts.push("cjs");

module.exports = withNativeWind(config, { input: "./global.css" });
