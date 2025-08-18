# DOGGIT Color Theme Documentation

## Color Palette

### Primary Colors
- **Accent (Purple)**: `#2E005D` - Used for primary actions, buttons, and brand elements
- **Gray (Dark)**: `#05070F` - Used as the base dark color for text and backgrounds

### Color Values

#### Light Mode
```css
--background: #FFFFFF
--foreground: #05070F (your gray)
--primary: #2E005D (your accent)
--accent: #2E005D
```

#### Dark Mode
```css
--background: #05070F (your gray)
--foreground: #FAFAFA
--primary: #2E005D (your accent)
--accent: #2E005D
```

## Using with Radix UI Themes

If you want to use Radix UI Themes directly, here's how to configure it:

### Installation
```bash
npm install @radix-ui/themes
```

### Configuration
```jsx
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

function App() {
  return (
    <Theme
      accentColor="purple"
      grayColor="gray"
      radius="medium"
      appearance="light" // or "dark"
    >
      {/* Your app */}
    </Theme>
  );
}
```

### Custom CSS Variables
Add to your CSS file:
```css
.radix-themes {
  --accent-1: #faf5ff;
  --accent-2: #f3e8ff;
  --accent-3: #e9d5ff;
  --accent-4: #d8b4fe;
  --accent-5: #c084fc;
  --accent-6: #a855f7;
  --accent-7: #9333ea;
  --accent-8: #7e22ce;
  --accent-9: #2E005D; /* Your accent color */
  --accent-10: #2E005D;
  --accent-11: #2E005D;
  --accent-12: #1e0040;
  
  --gray-1: #fafafa;
  --gray-2: #f4f4f5;
  --gray-3: #e4e4e7;
  --gray-4: #d4d4d8;
  --gray-5: #a1a1aa;
  --gray-6: #71717a;
  --gray-7: #52525b;
  --gray-8: #3f3f46;
  --gray-9: #27272a;
  --gray-10: #18181b;
  --gray-11: #05070F; /* Your gray color */
  --gray-12: #05070F;
}
```

## Current Implementation

We're using **shadcn/ui** which is built on top of Radix UI primitives. The color theme has been configured in:

1. **`app/globals.css`** - CSS variables for the theme
2. **`tailwind.config.ts`** - Tailwind configuration with custom colors
3. **`theme-config.json`** - Shareable theme configuration

## Sharing the Theme

To share this theme with others or use it in other projects:

1. Copy the `theme-config.json` file
2. Use the CSS variables from `app/globals.css`
3. Configure Tailwind with the colors from `tailwind.config.ts`

## Color Usage in Components

### Buttons
- Primary: `bg-primary text-primary-foreground` (Purple with white text)
- Secondary: `bg-secondary text-secondary-foreground`
- Outline: `border-border bg-background`

### Backgrounds
- Light mode: `bg-background` (white)
- Dark mode: `dark:bg-background` (#05070F)
- Cards: `bg-card`

### Text
- Primary text: `text-foreground`
- Muted text: `text-muted-foreground`
- Accent text: `text-accent`

## Tailwind Classes

The theme includes custom Tailwind classes:
- `jade-purple`: #2E005D
- `jade-purple-light`: #4C1D95
- `queen-purple`: #9B86FF
- `dark-gray`: #05070F

Use these in your components:
```jsx
<button className="bg-jade-purple text-white">
  Click me
</button>
```

## Dark Mode Support

The theme automatically switches between light and dark modes using:
- `next-themes` for theme management
- CSS variables that change based on `.dark` class
- Tailwind's dark mode utilities (`dark:bg-gray-900`)

## Accessibility

The color combinations have been chosen to ensure:
- WCAG AA compliance for text contrast
- Clear visual hierarchy
- Distinct interactive states