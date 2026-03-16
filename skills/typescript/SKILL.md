# TypeScript - Conventions & Standards

## Overview

This project uses **TypeScript 5.8.3** with strict type checking. Follow these conventions for consistent, maintainable code.

---

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `userName`, `phoneNumber` |
| Functions | camelCase | `handleSubmit`, `formatDate` |
| Components | PascalCase | `UploadFileComponent`, `BusinessForm` |
| Types | PascalCase | `BusinessInformationForm`, `DomainConfig` |
| Interfaces | PascalCase | `UserData`, `ApiResponse` |
| Enum Types | PascalCase | `VerificationStatus`, `UserRole` |
| **Enum Values** | **UPPER_CASE** | `PENDING`, `VERIFIED`, `FAILED` |
| Constants | UPPER_CASE | `MAX_FILE_SIZE`, `API_ENDPOINTS` |
| CSS Classes | kebab-case | `form-container`, `upload-area` |

---

## Enum Values - Project Standard

**CRITICAL**: Use UPPER_CASE for enum values (project standard exception to some linters):

```typescript
// ✅ CORRECT - Use UPPER_CASE for enum values
export enum VerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  FAILED = "failed",
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  EDITOR = "editor",
}

// ❌ INCORRECT - Don't use PascalCase for enum values
export enum VerificationStatus {
  Pending = "pending",
  Verified = "verified",
  Failed = "failed",
}
```

---

## Interface Guidelines

### Flat Interfaces (One Level Depth)

```typescript
// ✅ CORRECT: Flat interface
interface UserData {
  id: string;
  name: string;
  email: string;
  roleId: string;
}

// ✅ CORRECT: Nested object → dedicated interface
interface UserWithPermissions {
  user: UserData;
  permissions: UserPermissions;
}

interface UserPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
}

// ❌ INCORRECT: Inline nested objects
interface BadUserData {
  id: string;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
  };
}
```

### Interface Reuse with `extends`

```typescript
// ✅ Base interface
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Extended interface
interface User extends BaseEntity {
  name: string;
  email: string;
}

interface Product extends BaseEntity {
  name: string;
  price: number;
}
```

---

## Type vs Interface

```typescript
// ✅ Use `interface` for object shapes
interface UserData {
  id: string;
  name: string;
}

// ✅ Use `type` for unions, primitives, utilities
type Status = "pending" | "active" | "inactive";
type ID = string | number;
type Nullable<T> = T | null;

// ✅ Use `type` for function signatures
type HandleClick = (id: string) => void;
type FetchData = (params: FetchParams) => Promise<Response>;
```

---

## Const Assertions

```typescript
// ✅ For configuration objects
const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
} as const;

type Route = (typeof ROUTES)[keyof typeof ROUTES];
// Type: "/" | "/dashboard" | "/settings"

// ✅ For status values
const STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];
```

---

## Strict Types (Avoid `any`)

```typescript
// ❌ NEVER use `any`
const data: any = fetchData();
const handleClick = (e: any) => {};

// ✅ Use proper types
const data: UserData = fetchData();
const handleClick = (e: MouseEvent) => {};

// ✅ Use `unknown` when type is truly unknown
const parseJson = (json: string): unknown => JSON.parse(json);

// ✅ Use generics for flexible typing
const fetchData = <T>(url: string): Promise<T> => {
  return fetch(url).then((res) => res.json());
};
```

---

## Utility Types

```typescript
// Partial - all properties optional
type PartialUser = Partial<User>;

// Required - all properties required
type RequiredUser = Required<User>;

// Pick - select specific properties
type UserName = Pick<User, "name" | "email">;

// Omit - exclude specific properties
type UserWithoutId = Omit<User, "id">;

// Record - key-value mapping
type UserMap = Record<string, User>;

// ReturnType - extract function return type
type FetchResult = ReturnType<typeof fetchData>;
```

---

## Generic Patterns

```typescript
// ✅ Generic component props
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

// ✅ Generic hook
const useAsync = <T>(asyncFn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    asyncFn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [asyncFn]);

  return { data, loading, error };
};
```

---

## File Naming

> **Architecture Reference**: See [`bewe-architecture`](../bewe-architecture/SKILL.md) for complete file naming conventions.

| Type | Pattern | Example |
|------|---------|---------|
| Domain Interfaces | `[entity].ts` | `files.ts`, `user.ts` |
| Types | `[entity].types.ts` | `form.types.ts` |
| Enums | `[name].enum.ts` | `training-status.enum.ts` |
| Errors | `[ErrorName]Error.ts` | `GetFilesError.ts` |
| DTOs | `[entity]-response.dto.ts` | `assets-response.dto.ts` |
| Ports | `[feature].port.ts` | `files.port.ts` |
| Adapters | `[feature].adapter.ts` | `files.adapter.ts` |
| Use Cases | `[action]-[entity].usecase.ts` | `get-files.usecase.ts` |
| Validations | `[entity].validation.ts` | `email.validation.ts` |
| Mappers | `[entity].mapper.ts` | `files.mapper.ts` |
| Constants | `[feature].constants.ts` | `ingestion.constants.ts` |

---

## ⚠️ CRITICAL: No Type Duplication Rule

**NEVER** duplicate types, interfaces, or enums that already exist elsewhere in the project.

### Where Types Should Be Defined (Single Source of Truth)

| Type Category | Location | Example |
|---------------|----------|---------|
| Domain entities | `domain/[feature]/interfaces/` | `IClient`, `IFile` |
| Enums | `domain/[feature]/enums/` | `TrainingStatus` |
| DTOs | `infrastructure/[feature]/dtos/` | `ClientResponseDto` |
| Error classes | `domain/[feature]/errors/` | `GetFilesError` |
| Store state/actions | `ui/features/[feature]/store/` | `IIngestionState` |
| Component props | Component file or `.types.ts` | `ButtonProps` |

### ✅ CORRECT: Import existing types

```typescript
// In store types
import type { IFile } from "src/module/domain/feature/interfaces/files";
import { TrainingStatus } from "src/module/domain/feature/enums/training-status.enum";

export interface IIngestionState {
  files: IFile[];                    // ← Imported
  status: TrainingStatus;            // ← Imported
  isLoading: boolean;                // ← UI-specific, defined here
}
```

### ❌ INCORRECT: Duplicating types

```typescript
// ❌ DON'T: Redefine what exists in domain
interface IFile {                    // Already in domain/interfaces!
  id: string;
  name: string;
}

// ❌ DON'T: Redefine enums
enum TrainingStatus {                // Already in domain/enums!
  PENDING = 'pending',
}
```

---

## Anti-Patterns

```typescript
// ❌ Using `any`
const data: any = {};

// ❌ Type assertions without validation
const user = data as User;

// ❌ Inline nested objects in interfaces
interface Bad {
  nested: { prop: string };
}

// ❌ PascalCase for enum values (use UPPER_CASE)
enum Status {
  Pending = "pending", // ❌
}

// ❌ Non-descriptive names
const x = "value";
const fn = () => {};

// ❌ Optional chaining without handling null
user?.name.toLowerCase(); // Could throw if name is undefined

// ❌ Duplicating types that exist elsewhere
interface IClient { ... } // If exists in domain, IMPORT it!
```

---

## Best Practices

```typescript
// ✅ Descriptive variable names
const userEmailAddress = "user@example.com";
const isFormValid = true;

// ✅ Handle nullable types
const displayName = user?.name ?? "Anonymous";

// ✅ Type guards
const isUser = (data: unknown): data is User => {
  return typeof data === "object" && data !== null && "id" in data;
};

// ✅ Discriminated unions
interface LoadingState {
  status: "loading";
}

interface SuccessState {
  status: "success";
  data: UserData;
}

interface ErrorState {
  status: "error";
  error: Error;
}

type State = LoadingState | SuccessState | ErrorState;
```

