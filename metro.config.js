const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// Add support for CommonJS (cjs) modules
defaultConfig.resolver.sourceExts.push("cjs");

// Fix Firebase Auth module issue
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
