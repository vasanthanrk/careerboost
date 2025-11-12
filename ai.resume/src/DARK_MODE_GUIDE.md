# Dark Mode Implementation Guide

## Overview
CareerBoost now includes a comprehensive dark mode feature that allows users to toggle between light and dark themes. The theme preference is persisted in localStorage and automatically applied on subsequent visits.

## Features Implemented

### 1. Theme Provider (`/components/ThemeProvider.tsx`)
- React Context-based theme management
- Automatic detection of system preference
- localStorage persistence
- Easy-to-use `useTheme()` hook

### 2. Theme Toggle Component (`/components/ThemeToggle.tsx`)
- Beautiful moon/sun icon toggle
- Hover states for both light and dark modes
- Accessible with title attribute
- Integrated into navigation bars

### 3. Where Dark Mode Toggle Appears
- **Landing Page**: Top navigation bar (visible to all visitors)
- **Dashboard Layout**: Top navigation bar (visible to authenticated users)
- **All Dashboard Pages**: Automatically inherits from DashboardLayout

## How to Use

### For Users
1. Look for the moon/sun icon in the top navigation
2. Click to toggle between light and dark modes
3. Your preference is automatically saved

### For Developers

#### Using the Theme Hook
```tsx
import { useTheme } from './components/ThemeProvider';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('dark')}>Force Dark</button>
      <button onClick={() => setTheme('light')}>Force Light</button>
    </div>
  );
}
```

#### Adding Dark Mode Styles
Use Tailwind's `dark:` variant for dark mode styles:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content that adapts to theme
</div>
```

## Files Modified

### Core Files
- `/App.tsx` - Wrapped app with ThemeProvider
- `/components/ThemeProvider.tsx` - New theme context and provider
- `/components/ThemeToggle.tsx` - New toggle button component

### Layout Files
- `/components/DashboardLayout.tsx` - Added dark mode classes and toggle button
- `/components/LandingPage.tsx` - Added dark mode classes and toggle button

### CSS Variables
The app uses CSS variables defined in `/styles/globals.css` that automatically adapt to dark mode:

```css
:root {
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  /* ...other variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ...other variables */
}
```

## Dark Mode Color Scheme

### Light Mode
- Background: White (#ffffff) with violet/purple gradients
- Text: Dark gray (gray-900)
- Cards: White with gray borders
- Accents: Violet (#8B5CF6) gradient

### Dark Mode
- Background: Dark gray (gray-900) with subtle gradients
- Text: White/light gray (gray-100, gray-300)
- Cards: Dark gray (gray-800) with darker borders
- Accents: Same violet gradient (maintains brand identity)

## Components with Dark Mode Support

✅ **Fully Supported:**
- Landing Page
- Dashboard Layout & Navigation
- All ShadCN UI components (button, card, dialog, etc.)
- Toast notifications
- Dropdown menus

🔄 **Automatic Support:**
All components using ShadCN UI components automatically support dark mode through the CSS variables defined in `globals.css`.

## Testing Dark Mode

1. **Manual Toggle**: Click the moon/sun icon in navigation
2. **System Preference**: Set your OS to dark mode, clear localStorage, and reload
3. **Persistence**: Toggle theme, reload page - preference should be remembered
4. **Cross-Page**: Navigate between pages - theme should remain consistent

## Troubleshooting

### Theme doesn't persist
- Check browser localStorage for `theme` key
- Ensure ThemeProvider wraps your entire app in App.tsx

### Some elements don't change
- Add `dark:` variants to Tailwind classes
- Check that element uses CSS variables that support dark mode

### Flash of wrong theme
- The theme is applied immediately on load via localStorage
- If flash occurs, ensure ThemeProvider is as high as possible in component tree

## Future Enhancements

Potential improvements:
- Add system preference sync (auto-switch when OS theme changes)
- Add theme options beyond light/dark (e.g., auto, light, dark)
- Add animation transitions when switching themes
- Per-page theme preferences
- Theme preview in settings

## Support

For issues or questions about dark mode:
1. Check this guide
2. Review the ThemeProvider implementation
3. Ensure all new components use dark mode Tailwind variants
4. Test in both modes during development
