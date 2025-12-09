# AI Development Guide

News App Starter Kit: Expo 54 + React Native + TypeScript.

## Tech Stack
- Expo 54 + React Native + TypeScript
- Navigation: Expo Router (file-based)
- State: Zustand
- API: Axios + Mock API
- Styling: NativeWind (Tailwind)
- Icons: Lucide React Native

## Structure
```
app/                  # Screens (Expo Router)
  (auth)/            # Login, register
  (tabs)/            # index, settings
  news/[id].tsx      # Dynamic routes

src/
  components/        # common/, shared/, auth/
  services/          # API + mockApi/
  store/             # Zustand stores
  types/             # TypeScript types
  utils/             # Constants, helpers

server/db.json       # Mock database
```

## Path Aliases
Always use `@/`:
```typescript
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/authStore';
```

## Conventions

### Screens (app/)
- File routing: `products.tsx`, `[id].tsx`, `(tabs)/index.tsx`
- Use NativeWind: `className="text-lg font-bold"`

### Components (src/components/)
- common/: UI (Button, Input, Card)
- shared/: Features (NewsCard, etc)
- Format: PascalCase.tsx

### Services (src/services/)
Always support Mock API:
```typescript
import { USE_MOCK_API } from '@/utils/constants';

export const myService = {
  getAll: async () => {
    if (USE_MOCK_API) return mockMyService.getAll();
    return (await apiClient.get('/items')).data;
  }
};
```

Mock handler in `src/services/mockApi/`:
```typescript
import mockData from '../../../server/db.json';

export const mockMyService = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 500));
    return mockData.items;
  },
};
```

### State (src/store/)
```typescript
import { create } from 'zustand';

export const useMyStore = create<State>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
```

### Auth
```typescript
import { useAuthStore } from '@/store/authStore';

const { user, isAuthenticated, login, logout } = useAuthStore();
// Test: admin@example.com / admin123
```

## Adding Feature
1. Screen in `app/`
2. Service in `src/services/` + mock
3. Mock handler in `src/services/mockApi/`
4. Mock data in `server/db.json`
5. Types in `src/types/`
6. Update `CHANGELOG.md` with changes

## Patterns

**Public List Screen:**
```typescript
import { useQuery } from '@tanstack/react-query';
export default function Products() {
  const { data } = useQuery({ queryKey: ['products'], queryFn: productService.getAll });
  return <FlatList data={data} />;
}
```

**Protected Screen:**
```typescript
export default function Dashboard() {
  if (!useAuthStore().isAuthenticated) return <Redirect href="/login" />;
  // ... content
}
```

## Rules
1. Check patterns before creating files
2. Use TypeScript types
3. Always support Mock API
4. Use `@/` path aliases
5. Use NativeWind styling
6. Keep auth as-is unless asked
7. Check `server/db.json` for data structure
8. Update `CHANGELOG.md` for significant changes

## Commands
```bash
npm start          # Dev
npm run android    # Android
npm run ios        # iOS
npm run type-check # TS check
```

## Changelog
Update CHANGELOG.md under `## [Unreleased]`:
```markdown
### Added
- Product list screen with filtering
### Changed
- Updated auth flow
### Fixed
- Fixed navigation issue
```

## References
- README.md: Full docs
- CHANGELOG.md: Version history
- server/db.json: Mock data
- app.config.js: API config
