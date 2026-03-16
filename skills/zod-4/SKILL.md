# Zod 4 - Schema Validation

## Overview

This project uses **Zod 4.0.14** for runtime type validation and schema definition. Zod 4 introduces new APIs and improvements.

---

## Basic Schemas

```typescript
import { z } from "zod";

// Primitives
const stringSchema = z.string();
const numberSchema = z.number();
const booleanSchema = z.boolean();
const dateSchema = z.date();

// Zod 4: New shorthand methods
const emailSchema = z.email();      // ✅ Zod 4 (not z.string().email())
const uuidSchema = z.uuid();        // ✅ Zod 4 (not z.string().uuid())
const urlSchema = z.url();          // ✅ Zod 4 (not z.string().url())
```

---

## Object Schemas

```typescript
import { z } from "zod";

// Basic object
const userSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  email: z.email(),
  age: z.number().positive().optional(),
  isActive: z.boolean().default(true),
});

// Infer TypeScript type
type User = z.infer<typeof userSchema>;
// { id: string; name: string; email: string; age?: number; isActive: boolean }
```

---

## Form Validation Schemas

### With React Hook Form

```typescript
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.email({ message: "Email inválido" }),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginComponent = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Controller components */}
    </form>
  );
};
```

### Registration Form Example

```typescript
const registrationSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.email("Email inválido"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Teléfono inválido").optional(),
  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener una mayúscula")
    .regex(/[0-9]/, "Debe contener un número"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegistrationForm = z.infer<typeof registrationSchema>;
```

---

## Common Patterns

### Optional and Nullable

```typescript
const schema = z.object({
  // Optional (can be undefined or missing)
  middleName: z.string().optional(),

  // Nullable (can be null)
  bio: z.string().nullable(),

  // Optional and nullable
  avatar: z.string().optional().nullable(),

  // With default value
  role: z.string().default("user"),
});
```

### Arrays

```typescript
const schema = z.object({
  // Array of strings
  tags: z.array(z.string()),

  // Array with length constraints
  categories: z.array(z.string()).min(1).max(5),

  // Non-empty array
  items: z.array(z.string()).nonempty(),
});
```

### Enums

```typescript
// Zod enum
const statusSchema = z.enum(["pending", "active", "inactive"]);
type Status = z.infer<typeof statusSchema>; // "pending" | "active" | "inactive"

// From TypeScript enum (project standard: UPPER_CASE values)
enum UserRole {
  ADMIN = "admin",
  USER = "user",
  EDITOR = "editor",
}

const roleSchema = z.nativeEnum(UserRole);
```

### Unions and Discriminated Unions

```typescript
// Simple union
const idSchema = z.union([z.string(), z.number()]);

// Discriminated union (better error messages)
const responseSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.object({ id: z.string() }) }),
  z.object({ status: z.literal("error"), error: z.string() }),
]);
```

---

## Transformations

```typescript
const schema = z.object({
  // Transform to lowercase
  email: z.email().transform((val) => val.toLowerCase()),

  // Parse string to number
  age: z.string().transform((val) => parseInt(val, 10)),

  // Parse and validate
  price: z.string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), "Debe ser un número válido"),

  // Date from string
  createdAt: z.string().transform((val) => new Date(val)),
});
```

---

## Custom Validations

```typescript
// Custom refinement
const passwordSchema = z.string()
  .min(8)
  .refine(
    (val) => /[A-Z]/.test(val),
    { message: "Debe contener al menos una mayúscula" }
  )
  .refine(
    (val) => /[0-9]/.test(val),
    { message: "Debe contener al menos un número" }
  );

// Super refine for complex validations
const dateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).superRefine((data, ctx) => {
  if (data.endDate < data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La fecha final debe ser posterior a la inicial",
      path: ["endDate"],
    });
  }
});
```

---

## API Response Validation

```typescript
// API response schema
const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    users: z.array(z.object({
      id: z.uuid(),
      name: z.string(),
      email: z.email(),
    })),
    pagination: z.object({
      page: z.number(),
      totalPages: z.number(),
      totalItems: z.number(),
    }),
  }),
});

// Parse API response
const fetchUsers = async () => {
  const response = await fetch("/api/users");
  const json = await response.json();
  
  // Validate and get typed data
  const result = apiResponseSchema.safeParse(json);
  
  if (!result.success) {
    console.error("Invalid response:", result.error);
    throw new Error("Invalid API response");
  }
  
  return result.data;
};
```

---

## Schema Composition

### Extend

```typescript
const baseUserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
});

const adminSchema = baseUserSchema.extend({
  permissions: z.array(z.string()),
  department: z.string(),
});
```

### Merge

```typescript
const personalInfoSchema = z.object({
  name: z.string(),
  age: z.number(),
});

const contactInfoSchema = z.object({
  email: z.email(),
  phone: z.string(),
});

const fullUserSchema = personalInfoSchema.merge(contactInfoSchema);
```

### Pick and Omit

```typescript
const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

// Pick specific fields
const publicUserSchema = userSchema.pick({ id: true, name: true });

// Omit specific fields
const createUserSchema = userSchema.omit({ id: true });
```

### Partial and Required

```typescript
const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
});

// All fields optional
const updateUserSchema = userSchema.partial();

// All fields required
const requiredUserSchema = updateUserSchema.required();
```

---

## Error Handling

```typescript
const schema = z.object({
  email: z.email(),
  age: z.number().positive(),
});

// Safe parse (doesn't throw)
const result = schema.safeParse(data);

if (result.success) {
  // result.data is typed
  console.log(result.data.email);
} else {
  // result.error contains validation errors
  result.error.errors.forEach((err) => {
    console.log(`${err.path.join(".")}: ${err.message}`);
  });
}

// Parse (throws on error)
try {
  const data = schema.parse(input);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(error.errors);
  }
}
```

---

## Best Practices

### ✅ DO

```typescript
// Use Zod 4 shorthand methods
z.email()
z.uuid()
z.url()

// Define schemas outside components
const userSchema = z.object({ ... });

// Use safeParse for external data
const result = schema.safeParse(apiData);

// Provide custom error messages
z.string().min(1, "Campo requerido")

// Infer types from schemas
type User = z.infer<typeof userSchema>;
```

### ❌ DON'T

```typescript
// Don't use old string().email() pattern
z.string().email() // Use z.email() instead

// Don't define schemas inside components
const Component = () => {
  const schema = z.object({ ... }); // Bad
};

// Don't ignore parse errors
const data = schema.parse(input); // Can throw

// Don't duplicate type definitions
interface User { ... } // Don't do this if using zod
const userSchema = z.object({ ... }); // Use z.infer instead
```

---

## File Organization

> **Architecture Reference**: See [`bewe-architecture`](../bewe-architecture/SKILL.md) for complete module structure.

### Domain Validations (Business Logic)

Zod schemas for business logic validations go in `domain/[feature]/validations/`:

```
src/
└── [module]/
    └── domain/
        └── [feature]/
            └── validations/
                ├── user.validation.ts
                └── form.validation.ts
```

```typescript
// domain/[feature]/validations/user.validation.ts
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  email: z.email("Email inválido"),
  role: z.enum(["admin", "user", "editor"]),
});

export type CreateUserData = z.infer<typeof createUserSchema>;

// Pure validation functions (non-Zod)
export const isBusinessEmail = (email: string): boolean => {
  const freeEmailDomains = ['gmail.com', 'hotmail.com', 'yahoo.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return !freeEmailDomains.includes(domain);
};
```

### UI Form Validation

For form-specific validations, schemas can be in the feature's UI hooks:

```
src/
└── [module]/
    └── ui/
        └── features/
            └── [feature]/
                └── hooks/
                    └── use-[feature]-form.hook.ts  # Contains form schema
```

```typescript
// ui/features/[feature]/hooks/use-user-form.hook.ts
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

type FormData = z.infer<typeof formSchema>;

export const useUserForm = () => {
  const { control, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  
  return { control, handleSubmit, formState };
};
```

