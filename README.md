# News App Starter Kit

A complete, production-ready news application starter kit built with Expo, React Native, and TypeScript. This starter kit provides everything you need to build a modern news app with authentication, API integration, and beautiful UI.

## Quick Links

- **[AI_GUIDE.md](./AI_GUIDE.md)** - AI development guide with patterns and conventions
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and updates

## Features

- **Modern Tech Stack**: Expo 54 + React Native + TypeScript
- **Authentication System**: Complete auth flow (login, register, logout)
- **Mock API**: Fully functional mock API for rapid development
- **State Management**: Zustand for efficient state management
- **Beautiful UI**: NativeWind (Tailwind CSS) with dark mode support
- **Type Safety**: Full TypeScript support throughout
- **AI-Ready**: Optimized for AI-assisted development
- **Production Ready**: Easy to switch from mock to real backend

## Getting Started

### For AI Developers

**If you're an AI assistant helping with this project, read [AI_GUIDE.md](./AI_GUIDE.md) first!** It contains all the patterns, conventions, and code examples you need.

### For Humans

**Prerequisites:**
- Node.js v20.19.5 (recommended)
- npm or yarn
- Expo CLI

**Installation:**

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on platform
npm run ios      # iOS
npm run android  # Android
npm run web      # Web
```

**Test Accounts:**
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

## Project Structure

```
├── app/                    # App screens and routing (Expo Router)
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   └── news/              # News detail screens
├── src/
│   ├── components/        # Reusable components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   │   ├── mockApi/       # Mock API implementation
│   │   ├── api.ts         # API client
│   │   ├── authService.ts # Authentication service
│   │   └── newsService.ts # News service
│   ├── store/             # State management (Zustand)
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── theme/             # Theme configuration
└── server/
    └── db.json            # Mock database
```

## Configuration

### Environment Setup

The app uses different API configurations based on the environment:

- **Development**: Uses mock API with local data
- **Staging**: Configure staging API URL in `app.config.js`
- **Production**: Configure production API URL in `app.config.js`

### API Configuration

Edit `app.config.js` to configure your API endpoints:

```javascript
const API_MAP = {
  development: 'http://localhost:3000',
  staging: 'https://api.staging.com',
  production: 'https://api.production.com',
};
```

### Mock API

The app includes a fully functional mock API for development:

- Mock API is enabled by default in development
- Edit `src/utils/constants.ts` to toggle mock API
- Mock data is stored in `server/db.json`

## Authentication

Complete authentication system with login, register, and logout flows. Auth state is persisted using Expo Secure Store.

**Usage in code:**
```typescript
import { useAuthStore } from '@/store/authStore';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

## News Features

- Browse latest news articles
- View detailed news content
- Category filtering
- Search functionality
- Pull-to-refresh
- Responsive card layout

## Customization

### Theme

Edit `src/theme/` to customize colors, fonts, and spacing.

### Mock Data

Edit `server/db.json` to add or modify news articles and user data.

### API Services

Implement your own API services in `src/services/` to connect to your backend.

## Building for Production

### Development Build

```bash
npm run build
```

### Platform-Specific Builds

```bash
npm run build:android  # Build for Android
npm run build:ios      # Build for iOS
```

## AI-Assisted Development

This starter kit is optimized for AI-assisted development. Check **[AI_GUIDE.md](./AI_GUIDE.md)** for complete AI development guide.

### Quick Start for AI

When working with AI assistants (Claude, GPT, etc.):

1. **Point to AI_GUIDE.md** - The AI guide contains all patterns and conventions
2. **Use existing patterns** - Always check existing code before generating new files
3. **Mock API support** - All services must support mock API for development
4. **Path aliases** - Always use `@/` imports
5. **TypeScript** - All code must be properly typed

### Example AI Prompts

**Add new feature:**
```
Create a product list feature. Check AI_GUIDE.md for patterns.
Follow the conventions for screens, services, and mock API.
```

**Generate CRUD:**
```
Build a complete CRUD for products with:
- List screen (public)
- Detail screen
- Service with mock API support
- Add data to server/db.json
```

**Add protected feature:**
```
Create a dashboard following the protected screen pattern in AI_GUIDE.md.
Use existing auth system, add service with mock support.
```

### Configuration

The `ai-context.json` defines project structure for AI tools:

```json
{
  "screensPath": "app",
  "componentsPath": "src/components",
  "servicesPath": "src/services",
  "mockApiPath": "src/services/mockApi",
  "storePath": "src/store",
  "typesPath": "src/types",
  "mockDataPath": "server/db.json"
}
```

## State Management

Using Zustand for simple, scalable state management. Create stores in `src/store/`:

```typescript
import { create } from 'zustand';

export const useMyStore = create<State>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
```

## Theming & UI

NativeWind (Tailwind CSS) for styling. Theme follows system preference automatically.

```typescript
// Use NativeWind classes
<Text className="text-lg font-bold text-gray-900 dark:text-white">
  Hello World
</Text>

// Or use theme store
import { useThemeStore } from '@/store/themeStore';
const { colorScheme } = useThemeStore();
```

**Common Components:**
- `Button`, `Input`, `Card` - in `src/components/common/`
- `NewsCard`, `NewsItem` - in `src/components/shared/`
- All components use NativeWind for styling

## Routing

File-based routing with Expo Router:

- `app/(tabs)/` - Main tabs (index, settings)
- `app/(auth)/` - Auth screens (login, register)
- `app/news/[id].tsx` - Dynamic routes

Add new routes by creating files in `app/` directory.

## API Services

Create services in `src/services/` with mock support:

```typescript
import { apiClient } from './api';
import { mockNewsService } from './mockApi/newsService';
import { USE_MOCK_API } from '@/utils/constants';

export const newsService = {
  getAll: async () => {
    if (USE_MOCK_API) return mockNewsService.getAll();
    return (await apiClient.get('/news')).data;
  },
};
```

## Available Scripts

```bash
# Development
npm start                 # Start Expo dev server
npm run android          # Run on Android
npm run ios              # Run on iOS
npm run web              # Run on web

# Quality & Build
npm run lint             # Run ESLint
npm run type-check       # TypeScript check
npm run build            # Build for production
npm run clean            # Clean install
```

## Path Aliases

Use clean imports with configured path aliases:

```typescript
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/authStore';
import { newsService } from '@/services/newsService';
```

## Tech Stack

- **Framework**: Expo 54 + React Native
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based)
- **State**: Zustand
- **HTTP**: Axios + Mock API
- **Styling**: NativeWind (Tailwind CSS)
- **Icons**: Lucide React Native
- **Storage**: Expo Secure Store
- **Data Fetching**: TanStack Query (React Query)

## Key Highlights

- **AI-Optimized**: Built for AI-assisted development - check [AI_GUIDE.md](./AI_GUIDE.md)
- **Mock-First**: Develop without backend - mock API included
- **Type-Safe**: Full TypeScript support with proper types
- **Modern Stack**: Latest Expo 54, React Native, and best practices
- **Production Ready**: Easy to switch from mock to real API
- **Path Aliases**: Clean imports with `@/` prefix
- **File-Based Routing**: Intuitive Expo Router setup

## Learn More

- [AI_GUIDE.md](./AI_GUIDE.md) - AI development guide
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [Zustand](https://docs.pmnd.rs/zustand/)
- [TanStack Query](https://tanstack.com/query/latest)

## License

MIT
