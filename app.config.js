import withAndroidSplits from './app.plugins.js';

/**
 * Best-practice Expo app.config.js
 * Fully dynamic, schema-safe, ABI-split enabled
 */
export default ({ config }) => {
    // Ambil environment EAS (development, staging, production)
    const APP_ENV = process.env.APP_ENV ?? 'development';

    // API URL berdasarkan env
    const API_MAP = {
        development: 'http://localhost:3000',
        staging: 'https://api.staging.com',
        production: 'https://api.production.com',
    };

    const apiBaseUrl = API_MAP[APP_ENV] ?? API_MAP.development;;

    // Base Expo config
    const base = {
        name: 'News App',
        slug: 'news-app-starter',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './src/assets/images/icon.png',
        scheme: 'newsapp',
        userInterfaceStyle: 'automatic',

        splash: {
            image: './src/assets/images/splash-icon.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },

        assetBundlePatterns: ['src/assets/**/*'],

        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.newsapp.starter',
        },

        android: {
            package: 'com.newsapp.starter',
            adaptiveIcon: {
                foregroundImage: './src/assets/images/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
            minSdkVersion: 23,
        },

        web: {
            bundler: 'metro',
            output: 'static',
            favicon: './src/assets/images/favicon.png',
        },

        plugins: [
            './app.plugins.js',
            'expo-router',
            "expo-web-browser",
            [
                'expo-secure-store',
                {
                    requireFullDiskAccess: false,
                },
            ],
        ],

        experiments: {
            typedRoutes: true,
        },

        extra: {
            eas: {
                projectId: '3429d460-2085-4d18-8053-d2c5ec2cfeb3',
            },
            APP_ENV,
            API_BASE_URL: apiBaseUrl,
        },

        updates: {
            enabled: true,
            checkAutomatically: 'ON_LOAD',
        },

        runtimeVersion: {
            policy: 'sdkVersion',
        },
    };

    // Merge config dari EAS + base
    const merged = {
        ...config,
        ...base,
    };

    // Tambah ABI splits
    return withAndroidSplits(merged);
};
