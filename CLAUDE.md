# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coeliac Sanctuary - Gluten Free On The Go is a React Native mobile app built with Expo SDK 54. It helps people with coeliac disease find gluten-free eateries across the UK. The app connects to the Coeliac Sanctuary API at `https://www.coeliacsanctuary.co.uk/api/v1`.

## Commands

```bash
# Development
npm run start          # Start Expo dev client
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator

# Code quality
npm run lint           # Run ESLint
npm run lint-fix       # Run ESLint with auto-fix

# Building
npm run build-ios      # Build iOS via EAS
npm run build-android  # Build Android via EAS
```

## Architecture

### Routing (Expo Router with file-based routing)
- `app/_layout.tsx` - Root layout with providers (AdsContext, ThemeProvider, SessionProvider)
- `app/(tabs)/_layout.tsx` - Tab navigator with 5 tabs: Nearby, Explore, Recommend, Nationwide, More
- Each tab has its own stack via nested `_layout.tsx` files
- Eatery detail screens exist at `app/(tabs)/{nearby,explore,nationwide}/eatery-details.tsx`

### Key Directories
- **`screens/`** - Main screen components (NearbyPlaces, Explore, Map, etc.) used by route files
- **`components/`** - Reusable UI components, with `Eateries/` subdirectory for eatery-specific components
- **`requests/`** - API request functions using axios; `client.ts` creates the base axios instance
- **`types/`** - TypeScript type definitions (`.d.ts` files) for eateries, blogs, recipes
- **`context/`** - React contexts for ads (`adsContextProvider.tsx`) and session state (`sessionContext.tsx`)
- **`modals/`** - Modal components built on `Modal.tsx` base component
- **`sidebars/`** - Slide-in sidebar components built on `Sidebar.tsx` base component
- **`constants/`** - App config (Http.ts for API URLs, Colors.ts for theming, App.ts for version/ad IDs)

### Data Flow Pattern
1. Route file (e.g., `app/(tabs)/nearby/index.tsx`) renders a screen component
2. Screen component (e.g., `screens/NearbyPlaces.tsx`) manages state and calls request functions
3. Request functions (e.g., `requests/nearbyPlaces.ts`) use the axios client to call the API
4. Data is typed using definitions from `types/eateries.d.ts`

### UI Patterns
- **Modal/Sidebar base components** - Extend `modals/Modal.tsx` or `sidebars/Sidebar.tsx`
- **Form components** - Located in `components/Form/` (TextInputField, Button, SelectField, etc.)
- **Eatery display** - EateryCard for lists, DetailedEatery for full view with subcomponents in `DetailedEateryComponents/`
- **Theming** - Uses Raleway font family, colors from `constants/Colors.ts`, custom theme in `constants/DefaultTheme.ts`

### Context Providers
- **AdsContext** - Manages Google Mobile Ads SDK initialization and GDPR/ATT consent
- **SessionContext** - Tracks view counts for triggering interstitial ads

### Path Aliases
Use `@/` prefix for imports (configured in tsconfig.json):
```typescript
import { Colors } from "@/constants/Colors";
import { client } from "@/requests/client";
```

## Platform-Specific Files
- `.ios.tsx` suffix for iOS-specific implementations (e.g., `IconSymbol.ios.tsx`, `TabBarBackground.ios.tsx`)
- Standard `.tsx` for Android/default implementations
