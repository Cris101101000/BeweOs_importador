# React Hook Form - Controller Pattern (MANDATORY)

## Overview

This project uses **React Hook Form 7.61.1**. When working with custom components from `@beweco/aurora-ui` or `@/shared/ui/components`, you **MUST** use `Controller` instead of `register()`.

---

## Critical Rule

```
Is it a native HTML input (<input>, <textarea>, <select>)?
├── YES → You can use register()
└── NO → YOU MUST use Controller
    ├── Is it from @beweco/aurora-ui? → Controller MANDATORY
    ├── Is it from @/shared/ui/components? → Controller MANDATORY
    └── Is it from third-party? → Controller MANDATORY
```

---

## Controller Pattern (MANDATORY)

### Basic Structure

```typescript
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@beweco/aurora-ui";
import { z } from "zod";

const schema = z.object({
  email: z.email(),
  name: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

const MyForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label={t("field_name")}
            placeholder={t("placeholder_enter_name")}
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name}
            isRequired
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label={t("field_email")}
            placeholder={t("placeholder_enter_email")}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            isRequired
          />
        )}
      />

      <Button type="submit">{t("button_save")}</Button>
    </form>
  );
};
```

---

## Component Examples

### Input Component

```typescript
<Controller
  name="name"
  control={control}
  render={({ field }) => (
    <Input
      {...field}
      label={t("field_name")}
      placeholder={t("placeholder_enter_name")}
      errorMessage={errors.name?.message}
      isInvalid={!!errors.name}
      isRequired
    />
  )}
/>
```

### Select Component

```typescript
<Controller
  name="role"
  control={control}
  render={({ field }) => (
    <Select
      {...field}
      label={t("field_role")}
      placeholder={t("placeholder_select_role")}
      errorMessage={errors.role?.message}
      isInvalid={!!errors.role}
    >
      <SelectItem value="admin">{t("role_admin")}</SelectItem>
      <SelectItem value="user">{t("role_user")}</SelectItem>
    </Select>
  )}
/>
```

### Phone Component

```typescript
<Controller
  name="phone"
  control={control}
  render={({ field }) => (
    <Phone
      {...field}
      label={t("field_phone")}
      required
      errorMessage={errors.phone?.message}
      error={!!errors.phone}
    />
  )}
/>
```

### Textarea Component

```typescript
<Controller
  name="description"
  control={control}
  render={({ field }) => (
    <Textarea
      {...field}
      label={t("field_description")}
      placeholder={t("placeholder_enter_description")}
      errorMessage={errors.description?.message}
      isInvalid={!!errors.description}
      minRows={3}
      isRequired
    />
  )}
/>
```

### Checkbox Component

```typescript
<Controller
  name="acceptTerms"
  control={control}
  render={({ field }) => (
    <Checkbox
      {...field}
      isSelected={field.value}
      onValueChange={field.onChange}
    >
      {t("accept_terms")}
    </Checkbox>
  )}
/>
```

---

## Custom Hook Pattern

**MANDATORY**: When creating custom form hooks, export `control`, NOT `register`:

### ✅ Correct Hook

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface UseBusinessFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
}

export const useBusinessForm = ({ initialData, onSubmit }: UseBusinessFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
    },
  });

  return {
    control,           // ✅ Export control for Controller
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isDirty,
    isValid,
    isSubmitting,
    reset,
    watch,
    setValue,
  };
};
```

### ❌ Incorrect Hook

```typescript
export const useBadForm = ({ initialData }) => {
  const { control, register, handleSubmit, formState: { errors } } = useForm();

  return {
    control,
    register,  // ❌ DON'T export register
    handleSubmit,
    errors,
  };
};
```

---

## Using Custom Hook in Component

```typescript
import { Controller } from "react-hook-form";
import { Input } from "@beweco/aurora-ui";
import { useBusinessForm } from "./hooks/useBusinessForm";

const BusinessForm = ({ initialData, onSubmit }) => {
  const { t } = useTranslate();
  const {
    control,
    handleSubmit,
    errors,
    isDirty,
    isValid,
    isSubmitting,
  } = useBusinessForm({ initialData, onSubmit });

  return (
    <form onSubmit={handleSubmit}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label={t("field_name")}
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label={t("field_email")}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
          />
        )}
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        isDisabled={!isDirty || !isValid}
      >
        {t("button_save")}
      </Button>
    </form>
  );
};
```

---

## Common Issues & Solutions

### Problem 1: Value Disappears on Click

```typescript
// 🔴 PROBLEM
<Input {...register("name")} />

// ✅ SOLUTION
<Controller
  name="name"
  control={control}
  render={({ field }) => <Input {...field} />}
/>
```

### Problem 2: Field Doesn't Update

```typescript
// 🔴 PROBLEM: Partial field spread
<Controller
  name="name"
  control={control}
  render={({ field }) => (
    <Input value={field.value} onChange={field.onChange} />
  )}
/>

// ✅ SOLUTION: Use complete spread
<Controller
  name="name"
  control={control}
  render={({ field }) => <Input {...field} />}
/>
```

### Problem 3: Validation Not Working

```typescript
// 🔴 PROBLEM: Missing mode
const { control } = useForm({
  resolver: zodResolver(schema),
});

// ✅ SOLUTION: Add mode
const { control } = useForm({
  resolver: zodResolver(schema),
  mode: "onChange",  // ✅ Real-time validation
});
```

---

## Comparison: register() vs Controller

| Aspect | `register()` | `Controller` |
|--------|--------------|--------------|
| Native HTML inputs | ✅ Works perfectly | ✅ Works (unnecessary) |
| Custom components | ❌ DOESN'T work | ✅ Works perfectly |
| Aurora UI components | ❌ DOESN'T work | ✅ MANDATORY |
| @/shared components | ❌ DOESN'T work | ✅ MANDATORY |
| Third-party with custom API | ❌ DOESN'T work | ✅ MANDATORY |
| Simplicity | ✅ Simpler | ⚠️ More verbose |
| Full control | ⚠️ Limited | ✅ Complete control |

---

## Validation Checklist

Before creating a form, verify:

- [ ] **Custom components**: All use `Controller` instead of `register()`
- [ ] **Correct import**: `import { Controller } from "react-hook-form"`
- [ ] **Field spread**: All Controllers use `{...field}` in component
- [ ] **Control exported**: Custom hook exports `control`, not `register`
- [ ] **Errors handled**: All fields show `errorMessage` and `isInvalid`
- [ ] **Translations**: Labels and placeholders use `t()` from useTranslate
- [ ] **Accessibility**: Labels correctly associated with `htmlFor`

