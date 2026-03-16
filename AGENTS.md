# BeweOS SMBs - AI Agent Ruleset

> **Skills Reference**: For detailed patterns, use these skills:
> - [`jira-workflow`](./skills/jira-workflow/SKILL.md) - **⚠️ MANDATORY when Jira issue referenced** - Workflow for implementing Jira issues
> - [`bewe-architecture`](./skills/bewe-architecture/SKILL.md) - Hexagonal Architecture + Feature-based organization + Result Pattern
> - [`bewe-ui`](./skills/bewe-ui/SKILL.md) - BeweOS-specific UI patterns and components
> - [`aurora-ui`](./skills/aurora-ui/SKILL.md) - Aurora UI proxy/wrapper for HeroUI
> - [`api-gateway`](./skills/api-gateway/SKILL.md) - BeweOS API Gateway documentation, endpoints, Swagger UI
> - [`react-19`](./skills/react-19/SKILL.md) - React 19 functional components, hooks
> - [`typescript`](./skills/typescript/SKILL.md) - TypeScript conventions, naming standards
> - [`tailwind-scss`](./skills/tailwind-scss/SKILL.md) - Tailwind CSS + SCSS styling
> - [`react-hook-form`](./skills/react-hook-form/SKILL.md) - Forms with Controller (MANDATORY)
> - [`tolgee-i18n`](./skills/tolgee-i18n/SKILL.md) - Internationalization with @tolgee/react
> - [`zustand-5`](./skills/zustand-5/SKILL.md) - State management with Zustand 5
> - [`zod-4`](./skills/zod-4/SKILL.md) - Schema validation with Zod 4
> - [`vercel-react-best-practices`](./skills/vercel-react-best-practices/SKILL.md) - React/Next.js performance optimization (45 rules)

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| User references Jira issue (BEW-XXX, PROJ-123, etc.) | `jira-workflow` ⚠️ **MANDATORY** |
| User says "lee el issue", "revisa el ticket", "implementa BEW-XX" | `jira-workflow` ⚠️ **MANDATORY** |
| Creating feature modules (domain/application/infrastructure/ui) | `bewe-architecture` |
| Working with ports, adapters, use cases | `bewe-architecture` |
| Implementing Result pattern for error handling | `bewe-architecture` |
| Creating DependencyInjection.ts files | `bewe-architecture` |
| Creating/modifying BeweOS UI components | `bewe-ui` |
| Using Aurora UI or HeroUI components | `aurora-ui` |
| Working with component hierarchy (Button, Input, Select, Card) | `aurora-ui` |
| Writing React components | `react-19` + `vercel-react-best-practices` |
| Creating hooks or functional components | `react-19` + `vercel-react-best-practices` |
| Writing TypeScript types/interfaces | `typescript` |
| Defining enums (UPPER_CASE values) | `typescript` |
| Working with Tailwind classes | `tailwind-scss` |
| Adding SCSS styles to components | `tailwind-scss` |
| Creating forms with react-hook-form | `react-hook-form` |
| Using Controller for custom components | `react-hook-form` |
| Adding translations or locales | `tolgee-i18n` |
| Creating locale files (common.json, module.json) | `tolgee-i18n` |
| Using Zustand stores | `zustand-5` |
| Creating Zod schemas | `zod-4` |
| Optimizing React performance | `vercel-react-best-practices` |
| Eliminating async waterfalls | `vercel-react-best-practices` |
| Reducing bundle size | `vercel-react-best-practices` |
| Server-side rendering optimization | `vercel-react-best-practices` |

---

## Regla de prueba
- Siempre mencione la palabra "AGENTS_SMBS_OK" en su respuesta.

## 🎫 JIRA WORKFLOW

Cuando detectes `BEW-XX`, `PROJ-123` o frases como "lee el issue" → usar `jira-workflow` skill.

> **CRÍTICO**: NUNCA implementar sin confirmación del usuario.

---

## REGLAS CRÍTICAS

### React
- `import { useState } from "react"` (NUNCA `import React`)
- Functional components only

### Imports de Componentes (Prioridad)
1. `@/shared/ui/components/` → Button, Input, Select, Card
2. `@beweco/aurora-ui` → Phone, Table, Modal,Skeleton, Spinner

### Forms
- SIEMPRE usar `Controller` de react-hook-form (NUNCA `register()`)

### Traducciones
- SIEMPRE usar `useTranslate()` de `@tolgee/react`
- Keys en snake_case: `button_save`, `field_name`

### Types
- NUNCA duplicar types/interfaces → importar de `domain/[feature]/interfaces/`
- Interfaces flat (un nivel de profundidad)

---

## NAMING

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Variables/Funciones | camelCase | `userName`, `handleSubmit` |
| Componentes | PascalCase | `BusinessForm` |
| Types/Interfaces | PascalCase | `IBusinessData` |
| Enum Values | UPPER_CASE | `PENDING`, `VERIFIED` |
| CSS Classes | kebab-case | `form-container` |

---

## ESTRUCTURA

```
[module]/
├── domain/[feature]/        # interfaces/, ports/, errors/, enums/
├── application/[feature]/   # *.usecase.ts
├── infrastructure/[feature]/# adapters/, dtos/, mappers/, mocks/, utils/
├── ui/_shared/              # components/, hooks/, screens/, store/, DependencyInjection.ts
├── ui/features/[feature]/   # components/, screens/, store/, DependencyInjection.ts
└── ui/pages/[page]/         # [page].page.tsx
shared/ // Shared code for the entire application
├── components/              # Button, Input, Select, Card
├── context/                 # Contexts for global state
├── providers/               # Providers for global state
├── styles/                  # Global styles
└── utils/                   # Global utils

```

**Referencia**: `src/lindaConfig/`

---

## COMANDOS

```bash
bun run dev          # Iniciar desarrollo
bun run lint         # Verificar errores (NO usar :fix)
bun run check        # Verificar Biome (NO usar :fix)
```

⚠️ **PROHIBIDO**: `bun run lint:fix`, `bun run check:fix` (modifica todo el proyecto)

---

## STACK

React 19 | TypeScript 5.8 | Tailwind 3.4 | Zod 4 | Zustand 5 | @beweco/aurora-ui

