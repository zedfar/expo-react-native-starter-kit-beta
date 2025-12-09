module.exports = function withAndroidConfig(config) {
    if (!config.android) config.android = {};

    // 1. Split ABI
    config.android.splits = { abi: true };

    // 2. Aktifkan ProGuard + Shrink resources di release build
    if (!config.modResults) config.modResults = {};

    config.modResults = {
        ...config.modResults,
        enableProguardInReleaseBuilds: true,
        enableShrinkResources: true,
    };

    return config;
};
