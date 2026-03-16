# Patrones UI de BeweOS

## Descripción General

BeweOS sigue patrones UI específicos combinando **Arquitectura Hexagonal Basada en Features** con diseño basado en componentes. Los componentes UI actúan como **adapters** conectando a la **capa de aplicación** a través de **ports** bien definidos.

> **Referencia de Arquitectura**: Ver [`bewe-architecture`](../bewe-architecture/SKILL.md) para estructura completa de módulos y patrón Result.

---

## Jerarquía de Prioridad de Componentes (OBLIGATORIA)

Seguir esta jerarquía EXACTA al seleccionar componentes. **Si una carpeta/librería no existe en el proyecto, saltar a la siguiente prioridad.**

### Prioridad 1: Componentes Personalizados del Proyecto (`@/shared/ui/components/`)

> **Nota**: Si la carpeta `@/shared/ui/components/` no existe o el componente no se encuentra, continuar a Prioridad 2.

```typescript
// ✅ MAYOR PRIORIDAD: Wrappers documentados en @/shared (si existen)
import { MiComponente } from "@shared/ui/components/{MiComponente}";
```

### Prioridad 2: Componentes Aurora UI (`@beweco/aurora-ui`)

> **Nota**: Si `@beweco/aurora-ui` no está instalado o el componente no existe, continuar a Prioridad 3.
> 
> **Referencia Completa**: Ver [`aurora-ui`](../aurora-ui/SKILL.md) para documentación detallada de componentes personalizados y proxy.

---

## Flujo de Decisión

```
¿Necesitas un componente?
├── ¿Existe la carpeta @/shared/ui/components/?
│   ├── NO → Saltar a siguiente prioridad
│   └── SÍ → ¿El componente existe ahí?
│       ├── SÍ → USAR componente del proyecto ✅
│       └── NO → Continuar
├── ¿Está instalado @beweco/aurora-ui?
│   ├── NO → Saltar a siguiente prioridad
│   └── SÍ → ¿El componente existe?
│       ├── SÍ → Seguir documentación segun aurora-ui
│       └── NO → Continuar
└── ⚠️ PREGUNTAR AL USUARIO:
    "El componente no existe en las librerías del proyecto.
     ¿Desea que lo construya con librerías externas o Tailwind CSS?"
    ├── SÍ → Construir con librerías externas/Tailwind ✅
    └── NO → Informar y esperar instrucciones
```

---

## Reglas Críticas de Import

### Jerarquía de Imports

```typescript
// ✅ SIEMPRE respetar esta jerarquía de prioridades
import { MyComponent } from "@shared/ui/components/MyComponent/MyComponent";  // Prioridad 1: @shared
import { Phone } from "@beweco/aurora-ui";                                    // Prioridad 2: aurora-ui
import { Modal } from "@beweco/aurora-ui";                                    // Prioridad 2: aurora-ui
```

```typescript
// ❌ NUNCA saltar prioridades
import { Button } from "@heroui/react";         // ❌ Existe en @shared y aurora-ui
import { Phone } from "react-phone-input-2";    // ❌ Existe en aurora-ui
import { Modal } from "@heroui/react";          // ❌ Existe en aurora-ui
```

### Regla Crítica de Iconos

**SIEMPRE** usar el wrapper de Icons del shared. **NUNCA** usar SVG directamente ni otras librerías de iconos.

| Componente | Descripción | Import |
|------------|-------------|--------|
| **Icons** | Wrapper para @solar-icons/react | `@shared/ui/components/Icons` |

```typescript
// ✅ CORRECTO: Usar Icons del shared
import { Icons } from "@shared/ui/components/Icons";

<Icons.Calendar size={24} />
<Icons.User size={20} />
<Icons.Settings size={16} />
```

```typescript
// ❌ NUNCA hacer esto
import CalendarIcon from "./icons/calendar.svg";        // ❌ NO usar SVG directamente
import { FaCalendar } from "react-icons/fa";            // ❌ NO usar react-icons
import { CalendarIcon } from "@heroicons/react/24/solid"; // ❌ NO usar heroicons
import { Calendar } from "lucide-react";                // ❌ NO usar lucide
```
## Grid Responsivo

| Breakpoint | Ancho | Columnas |
|------------|-------|----------|
| xl | 1280px+ | 4 columnas |
| lg | 1024px | 3 columnas |
| md | 744px | 2 columnas |
| sm | 640px | 1 columna |
| xs | 320px | 1 columna |

---

## Animaciones

- **Duraciones estándar**: 150–600 ms
- **Curvas de easing**: `ease-in`, `ease-out`, `ease-in-out`
- **Accesibilidad**: Respetar preferencia `prefers-reduced-motion`

---

## Modo Oscuro

- Adaptaciones requeridas para fondos, bordes y textos
- Probar visibilidad en ambos modos
- Usar variantes `dark:` de Tailwind

---

## Tamaño y Complejidad de Componentes

### Semáforo de Longitud

| Líneas | Estado | Acción |
|--------|--------|--------|
| **< 50** | ✨ Ideal | Fácil de testear y entender |
| **50 - 150** | ⚠️ Precaución | Considera extraer lógica a un hook |
| **+ 200** | 🚨 Alerta | "Componente Monstruo" - Divídelo urgentemente |

> **Referencia**: El número "mágico" está entre **60 y 100 líneas**. Si supera las 100 líneas, probablemente viola el *Principio de Responsabilidad Única*.

### Qué Hacer si es Muy Largo

1. **Extrae sub-componentes** → Trozos de JSX que se repiten o tienen lógica propia
2. **Mueve lógica a Custom Hooks** → Ubicar en `features/[feature]/hooks/` o `_shared/hooks/`
3. **Saca configuración fuera** → Objetos de configuración, constantes y estilos fuera de la función del componente

### Señales de División (Independiente de Líneas)

A veces un componente de 30 líneas es más difícil de leer que uno de 80. Fíjate en estas señales:

| Señal | Problema | Solución |
|-------|----------|----------|
| **Múltiples `useEffect`** | 3+ efectos manejando cosas distintas | Extraer a hooks en `hooks/` |
| **Demasiados estados** | 10+ `useState` en un componente | Usar `useReducer` o dividir componente |
| **JSX profundamente anidado** | Muchos niveles de indentación | Niveles internos → componentes en `components/` |

### Ubicación de Componentes Extraídos

```
features/[feature]/
├── components/          # Sub-componentes específicos de la feature
│   ├── feature-header.component.tsx
│   └── feature-item.component.tsx
├── hooks/               # Hooks extraídos de componentes
│   └── use-feature-logic.hook.ts
└── screens/             # Pantallas principales (mantener < 100 líneas)
    └── feature.screen.tsx

_shared/
├── components/          # Componentes reutilizables entre features
└── hooks/               # Hooks compartidos entre features
```

---
