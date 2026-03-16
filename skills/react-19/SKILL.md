# React 19 - Functional Components & Hooks

## Overview

This project uses **React 19.2.0** with functional components and hooks. Class components are NOT allowed.

---

## Critical Import Rules

```typescript
// ✅ ALWAYS - Named imports
import { useState, useEffect, useCallback, useMemo, useId, useTransition } from "react";

// ❌ NEVER - Default or namespace imports
import React from "react";
import * as React from "react";
import React, { useState } from "react";
```

---

## Component Patterns

### Functional Component

```typescript
import { useState, useEffect } from "react";

interface UserCardProps {
  userId: string;
  onSelect?: (id: string) => void;
}

export const UserCard = ({ userId, onSelect }: UserCardProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Skeleton />;
  if (!user) return <EmptyState />;

  return (
    <Card>
      <CardBody>
        <h2>{user.name}</h2>
        <Button onPress={() => onSelect?.(userId)}>Select</Button>
      </CardBody>
    </Card>
  );
};
```

### Custom Hook

```typescript
import { useState, useCallback } from "react";

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounter = (initialValue = 0): UseCounterReturn => {
  const [count, setCount] = useState(initialValue);

  // ✅ Use functional setState for stable callbacks (Vercel: rerender-functional-setstate)
  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
};
```

---

## Hook Guidelines

### useState

```typescript
// ✅ With type inference
const [count, setCount] = useState(0);

// ✅ With explicit type
const [user, setUser] = useState<User | null>(null);

// ✅ With lazy initialization for expensive values (Vercel: rerender-lazy-state-init)
const [data, setData] = useState(() => computeExpensiveValue());

// ✅ Functional setState for stable callbacks (Vercel: rerender-functional-setstate)
const increment = useCallback(() => setCount((c) => c + 1), []);
```

### useEffect

```typescript
// ✅ With cleanup
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);

// ✅ With primitive dependencies (Vercel: rerender-dependencies)
useEffect(() => {
  fetchData(userId);
}, [userId]); // ✅ Primitive string, not object

// ❌ Missing dependencies
useEffect(() => {
  fetchData(userId); // userId missing in deps
}, []);

// ❌ Object dependencies cause unnecessary re-runs (Vercel: rerender-dependencies)
useEffect(() => {
  doSomething(user.id);
}, [user]); // ❌ Object reference changes every render

// ✅ Use primitive from object
useEffect(() => {
  doSomething(userId);
}, [userId]); // ✅ Primitive doesn't change unless value changes
```

### useCallback

```typescript
// ✅ Memoize callbacks for child components
const handleClick = useCallback((id: string) => {
  setSelectedId(id);
}, []);

// ✅ With functional setState - no dependencies needed (Vercel: rerender-functional-setstate)
const increment = useCallback(() => {
  setCount((prev) => prev + 1);
}, []); // ✅ Empty deps because functional setState

// ❌ Unnecessary dependency
const increment = useCallback(() => {
  setCount(count + 1);
}, [count]); // ❌ Causes new callback on every count change
```

### useMemo

```typescript
// ✅ Expensive calculations only
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// ✅ Complex derived state
const stats = useMemo(
  () => calculateStats(data),
  [data]
);

// ❌ DON'T wrap simple expressions (Vercel: rerender-simple-expression-in-memo)
const isActive = useMemo(() => status === "active", [status]); // ❌ Unnecessary

// ✅ Simple expressions don't need useMemo
const isActive = status === "active"; // ✅ Computed inline
```

### useId

```typescript
import { useId } from "react";

const MyForm = () => {
  const phoneId = useId();
  const emailId = useId();

  return (
    <div>
      <label htmlFor={phoneId}>Phone</label>
      <Phone id={phoneId} />

      <label htmlFor={emailId}>Email</label>
      <Input id={emailId} />
    </div>
  );
};
```

### useTransition (Vercel: rerender-transitions)

```typescript
import { useState, useTransition } from "react";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setQuery(value); // ✅ Urgent: update input immediately
    
    startTransition(() => {
      // ✅ Non-urgent: defer expensive filter
      setResults(filterLargeDataset(value));
    });
  };

  return (
    <div>
      <Input value={query} onChange={handleSearch} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </div>
  );
};
```

---

## Performance Patterns (from Vercel Best Practices)

### Defer State Reads (rerender-defer-reads)

```typescript
// ❌ Subscribes to state only used in callback
const FilteredList = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState(""); // Re-renders on every filter change

  const handleExport = () => {
    exportItems(items.filter((i) => i.name.includes(filter)));
  };

  return <Button onClick={handleExport}>Export</Button>;
};

// ✅ Use ref for values only needed in callbacks
const FilteredList = () => {
  const [items, setItems] = useState([]);
  const filterRef = useRef("");

  const handleExport = () => {
    exportItems(items.filter((i) => i.name.includes(filterRef.current)));
  };

  return <Button onClick={handleExport}>Export</Button>;
};
```

### Extract to Memoized Components (rerender-memo)

```typescript
import { memo } from "react";

// ✅ Extract expensive rendering into memoized component
const ExpensiveChart = memo(({ data }: { data: ChartData }) => {
  return <Chart data={data} />;
});

// ✅ Parent can re-render without affecting chart
const Dashboard = () => {
  const [counter, setCounter] = useState(0);
  const chartData = useChartData();

  return (
    <div>
      <button onClick={() => setCounter((c) => c + 1)}>{counter}</button>
      <ExpensiveChart data={chartData} />
    </div>
  );
};
```

### Hoist Static JSX (rendering-hoist-jsx)

```typescript
// ❌ Creates new object every render
const Component = () => {
  return (
    <div>
      <StaticHeader /> {/* Recreated every render */}
      <DynamicContent />
    </div>
  );
};

// ✅ Hoist static elements outside component
const staticHeader = <StaticHeader />;

const Component = () => {
  return (
    <div>
      {staticHeader} {/* Same reference, no recreation */}
      <DynamicContent />
    </div>
  );
};
```

### Conditional Rendering (rendering-conditional-render)

```typescript
// ❌ && can render "0" or "false" as string
{count && <Component />}     // Renders "0" when count is 0
{isValid && <Component />}   // Renders "false" when false

// ✅ Use explicit ternary
{count > 0 ? <Component /> : null}
{isValid ? <Component /> : null}

// ✅ Or double negation for boolean coercion
{!!count && <Component />}
```

### Subscribe to Derived State (rerender-derived-state)

```typescript
// ❌ Re-renders on every items change
const Component = ({ items }) => {
  const hasItems = items.length > 0;
  // ...
};

// ✅ For stores: subscribe to derived boolean
const hasItems = useStore((state) => state.items.length > 0);
```

---

## Component Guidelines

### Props Interface

```typescript
// ✅ Flat interface (one level)
interface ButtonProps {
  label: string;
  variant: "primary" | "secondary";
  onClick: () => void;
  disabled?: boolean;
}

// ✅ Nested object → dedicated interface
interface UserProps {
  user: UserData;
  permissions: UserPermissions;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface UserPermissions {
  canEdit: boolean;
  canDelete: boolean;
}

// ❌ Inline nested objects
interface BadProps {
  user: {
    id: string;
    name: string;
    permissions: {
      canEdit: boolean;
    };
  };
}
```

### Event Handlers

```typescript
// ✅ Naming convention
const handleClick = () => {};
const handleSubmit = (e: FormEvent) => {};
const handleChange = (value: string) => {};

// ✅ In props
interface Props {
  onClick?: () => void;
  onSubmit?: (data: FormData) => void;
  onChange?: (value: string) => void;
}
```

### Conditional Rendering

```typescript
// ✅ Early returns for states
if (loading) return <Skeleton />;
if (error) return <ErrorState message={error.message} />;
if (!data) return <EmptyState />;

// ✅ Explicit ternary conditionals (Vercel: rendering-conditional-render)
return (
  <div>
    {isVisible ? <Component /> : null}
    {status === "active" ? <ActiveBadge /> : <InactiveBadge />}
  </div>
);
```

---

## File Organization

### Component File

```typescript
// [component-name].component.tsx
import { useState, memo } from "react";
import type { ComponentProps } from "./[component-name].types";

export const ComponentName = memo(({ prop1, prop2 }: ComponentProps) => {
  // hooks
  const [state, setState] = useState();

  // handlers (use functional setState)
  const handleAction = useCallback(() => {
    setState((prev) => ({ ...prev, updated: true }));
  }, []);

  // render
  return <div></div>;
});
```

### Types File

```typescript
// [component-name].types.ts
export interface ComponentProps {
  prop1: string;
  prop2?: number;
  onAction?: (id: string) => void;
}

export interface ComponentState {
  isOpen: boolean;
  data: DataType | null;
}
```

### Hook File

```typescript
// use[hook-name].ts
import { useState, useCallback } from "react";

export const useHookName = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  // ✅ Functional setState - stable callback
  const updateValue = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return { value, updateValue };
};
```

---

## Anti-Patterns to Avoid

```typescript
// ❌ Class components
class BadComponent extends React.Component {}

// ❌ Default React import
import React from "react";

// ❌ Using `any`
const [data, setData] = useState<any>(null);

// ❌ Direct DOM manipulation
document.getElementById("myElement").innerHTML = "";

// ❌ Nested inline objects in props
<Component user={{ name: "John", permissions: { canEdit: true } }} />

// ❌ Object dependencies in useEffect (Vercel: rerender-dependencies)
useEffect(() => { ... }, [user]); // Object changes every render

// ❌ useMemo for simple expressions (Vercel: rerender-simple-expression-in-memo)
const isActive = useMemo(() => status === "active", [status]);

// ❌ && with falsy values (Vercel: rendering-conditional-render)
{count && <Component />} // Renders "0" when count is 0

// ❌ Non-functional setState in callbacks
const increment = useCallback(() => setCount(count + 1), [count]);
```

---

## Quick Reference: Vercel Performance Rules

| Rule | Description |
|------|-------------|
| `rerender-lazy-state-init` | Use `useState(() => expensive())` for costly initial values |
| `rerender-functional-setstate` | Use `setState(prev => ...)` for stable callbacks |
| `rerender-dependencies` | Use primitives, not objects, in effect dependencies |
| `rerender-defer-reads` | Use refs for state only accessed in callbacks |
| `rerender-memo` | Extract expensive renders into `memo()` components |
| `rerender-transitions` | Use `useTransition` for non-urgent updates |
| `rendering-hoist-jsx` | Hoist static JSX outside components |
| `rendering-conditional-render` | Use ternary, not `&&`, for conditionals |

For the complete 45-rule guide, see [`vercel-react-best-practices`](../vercel-react-best-practices/SKILL.md)
