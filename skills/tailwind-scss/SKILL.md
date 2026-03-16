# Tailwind CSS + SCSS - Styling Guidelines

## Overview

This project uses **Tailwind CSS 3.4.17** for utility classes combined with **SCSS** for complex or component-specific styles.

---

## Tailwind CSS Usage

### Basic Utility Classes

```typescript
// ✅ Single class
<div className="bg-slate-800 text-white p-4 rounded-lg">

// ✅ Multiple utilities
<button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors">
```

### Responsive Design

```typescript
// ✅ Mobile-first approach
<div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">

// ✅ Grid responsive
<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```

### Dark Mode

```typescript
// ✅ Dark mode variants
<div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">

// ✅ Dark mode with hover
<button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
```

---

## Conditional Classes with `cn()`

### Using cn() Utility

```typescript
import { cn } from "@/lib/utils";

// ✅ Merge multiple classes conditionally
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "bg-primary",
  className
)}>

// ✅ Complex conditions
<button
  className={cn(
    "px-4 py-2 rounded-md transition-colors",
    {
      "bg-primary text-white": variant === "primary",
      "bg-secondary text-white": variant === "secondary",
      "bg-gray-200 text-gray-800": variant === "ghost",
      "opacity-50 cursor-not-allowed": disabled,
    }
  )}
>
```

### Dynamic Values

```typescript
// ✅ Use style for dynamic values
<div 
  className="absolute top-0 left-0"
  style={{ width: `${percentage}%` }}
>

// ❌ NEVER use var() in className
<div className="w-[var(--dynamic-width)]">

// ❌ NEVER use hex colors in className
<div className="bg-[#ff0000]">
```

---

## SCSS Guidelines

### Co-location with Components

```
components/
└── MyComponent/
    ├── MyComponent.tsx
    ├── MyComponent.types.ts
    └── MyComponent.scss       # Co-located styles
```

### SCSS Structure

```scss
// MyComponent.scss

.my-component {
  // Base styles
  display: flex;
  flex-direction: column;
  
  // Child elements
  &__header {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  &__content {
    flex: 1;
    overflow-y: auto;
  }
  
  // Modifiers
  &--active {
    border-color: var(--primary-color);
  }
  
  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  
  // State classes
  &.is-loading {
    .my-component__content {
      display: none;
    }
  }
  
  // Responsive
  @media (min-width: 768px) {
    flex-direction: row;
  }
}
```

### Using in Component

```typescript
import "./MyComponent.scss";

export const MyComponent = ({ isActive, isDisabled }: Props) => {
  return (
    <div 
      className={cn(
        "my-component",
        isActive && "my-component--active",
        isDisabled && "my-component--disabled"
      )}
    >
      <div className="my-component__header">Header</div>
      <div className="my-component__content">Content</div>
    </div>
  );
};
```

---

## CSS Variables

### Global Variables (in `shared/styles/`)

```scss
// shared/styles/variables.scss
:root {
  // Colors
  --primary-color: #3b82f6;
  --secondary-color: #6366f1;
  --success-color: #22c55e;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  
  // Spacing
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  // Typography
  --font-family: 'Inter', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  
  // Borders
  --border-radius: 0.5rem;
  --border-color: #e5e7eb;
  
  // Dark mode
  &.dark {
    --border-color: #374151;
  }
}
```

### Using Variables in SCSS

```scss
.component {
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  font-family: var(--font-family);
}
```

---

## Responsive Grid System

| Breakpoint | Width | Columns | Tailwind Class |
|------------|-------|---------|----------------|
| xs | 320px | 1 | `grid-cols-1` |
| sm | 640px | 1 | `sm:grid-cols-1` |
| md | 744px | 2 | `md:grid-cols-2` |
| lg | 1024px | 3 | `lg:grid-cols-3` |
| xl | 1280px+ | 4 | `xl:grid-cols-4` |

```typescript
// ✅ Standard responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

---

## Animations

### Tailwind Animations

```typescript
// ✅ Built-in animations
<div className="animate-spin">Loading...</div>
<div className="animate-pulse">Skeleton</div>
<div className="animate-bounce">Bounce</div>

// ✅ Transition utilities
<button className="transition-all duration-200 ease-in-out hover:scale-105">
```

### SCSS Animations

```scss
// Custom animation
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

// Respect reduced motion
@media (prefers-reduced-motion: reduce) {
  .fade-in {
    animation: none;
  }
}
```

---

## Best Practices

### ✅ DO

```typescript
// Use Tailwind utilities for common styles
<div className="flex items-center justify-between p-4">

// Use cn() for conditional classes
<button className={cn("btn", isActive && "btn--active")}>

// Use style for dynamic values
<div style={{ width: `${value}%` }}>

// Co-locate SCSS with components
import "./Component.scss";

// Use CSS variables for themes
.component { color: var(--text-color); }
```

### ❌ DON'T

```typescript
// Don't use var() in className
<div className="w-[var(--width)]">

// Don't use hex colors in className
<div className="bg-[#ff0000]">

// Don't mix inline styles with Tailwind excessively
<div className="p-4" style={{ padding: "20px" }}>

// Don't create global styles without namespacing
.button { } // Too generic
```

---

## File Structure

```
src/
├── shared/
│   └── styles/
│       ├── variables.scss    # Global CSS variables
│       ├── mixins.scss       # SCSS mixins
│       ├── utilities.scss    # Custom utility classes
│       └── reset.scss        # CSS reset
├── index.css                 # Tailwind imports
└── [feature]/
    └── ui/
        └── components/
            └── [Component]/
                ├── [Component].tsx
                └── [Component].scss  # Co-located styles
```

