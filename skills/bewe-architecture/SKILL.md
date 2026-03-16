# BeweOS Architecture - Hexagonal + Feature-based

## Overview

Arquitectura **Hexagonal (Ports & Adapters)** con organización **Feature-based** por capa.

---

## 🎯 IDENTIFICACIÓN DE FEATURES - OBLIGATORIO

### Antes de implementar CUALQUIER código, el agente DEBE:

1. **Analizar el módulo** e identificar qué features podrían existir
2. **Proponer las features** al usuario con justificación
3. **ESPERAR CONFIRMACIÓN** antes de crear estructura

### Cómo Identificar Features

Preguntarse:
- ¿Cuáles son los flujos de usuario principales?
- ¿Qué dominios de datos distintos existen?
- ¿Qué operaciones son independientes entre sí?

### Ejemplos de Features por Módulo

| Módulo | Features Típicas |
|--------|------------------|
| `clients` | `contact-list`, `contact-details`, `contact-import`, `contact-export` |
| `campaigns` | `campaign-creation`, `campaign-history`, `templates`, `analytics` |
| `lindaConfig` | `ingestion`, `faq`, `behavior-rules`, `knowledge-gaps` |
| `settings` | `profile`, `users`, `business-config`, `schedules` |

### Formato de Pregunta al Usuario

```
"Para el módulo [X], identifico las siguientes features:
- feature-1: [descripción breve]
- feature-2: [descripción breve]

¿Es correcto? ¿Hay features adicionales o debo ajustar alguna?"
```

---

## 📁 _shared/ vs shared/ - CUÁNDO USAR CADA UNO

### Regla Simple

| Carpeta | Cuándo Usar | Ejemplo |
|---------|-------------|---------|
| `[module]/[layer]/_shared/` | 2+ features del **MISMO módulo** comparten el código | `lindaConfig/ui/_shared/components/StatusBadge/` |
| `shared/[layer]/` | 2+ **MÓDULOS diferentes** comparten el código | `shared/ui/components/ConfirmationModal/` |
| `shared/features/[context]/` | 2+ **MÓDULOS** necesitan una **feature completa** | `shared/features/linda/content-generation/` |

### ❌ Errores Comunes

```typescript
// ❌ INCORRECTO: Poner en shared/ algo que solo usa 1 módulo
shared/ui/components/IngestionCard/  // Solo lo usa lindaConfig

// ✅ CORRECTO: Va en _shared del módulo o en la feature
lindaConfig/ui/_shared/components/IngestionCard/
// o si solo lo usa 1 feature:
lindaConfig/ui/features/ingestion/components/IngestionCard/

// ❌ INCORRECTO: Poner en _shared algo que usan 2+ módulos
lindaConfig/ui/_shared/components/Button/  // Lo usan todos los módulos

// ✅ CORRECTO: Va en shared global
shared/ui/components/Button/
```

### Decisión Rápida

```
¿Quién usa este código?
│
├── Solo 1 feature → [module]/[layer]/[feature]/
├── 2+ features del MISMO módulo → [module]/[layer]/_shared/
└── 2+ MÓDULOS diferentes → shared/[layer]/ o shared/features/
```

---

## 🚨 REGLAS CRÍTICAS DE UI - NON-NEGOTIABLE

> **En el folder `ui/` solo deben existir tres carpetas:**
> - `pages/`
> - `features/`
> - `_shared/`
>
> Cualquier otra carpeta o archivo a este nivel **está prohibido** (excepto un posible `index.ts`). Esto garantiza separación clara y consistencia, todo debe estar dentro de las carpetas mencionadas.

### Estructura Obligatoria

```
[module]/ui/
├── _shared/            # Componentes usados por 2+ features del módulo
│   └── components/
├── features/           # ⚠️ OBLIGATORIO - Toda la lógica UI
│   └── [feature]/
│       ├── components/ # Componentes SOLO de esta feature
│       ├── hooks/
│       ├── screens/
│       ├── store/
│       ├── DependencyInjection.ts  # ⚠️ OBLIGATORIO Y DEBE USARSE
│       └── index.ts
├── pages/              # ⚠️ OBLIGATORIO - Entry points para rutas
│   └── [page-name]/
│       └── [page-name].page.tsx    # Solo orquesta features
└── index.ts
```
### Dónde van los Componentes en UI

| Componente usado por... | Ubicación | Ejemplo |
|-------------------------|-----------|---------|
| **Solo 1 feature** | `ui/features/[feature]/components/` | `ui/features/ingestion/components/FileCard/` |
| **2+ features del módulo** | `ui/_shared/components/` | `ui/_shared/components/StatusBadge/` |
| **2+ módulos** | `shared/ui/components/` | `shared/ui/components/ConfirmModal/` |

```typescript
// ❌ INCORRECTO: Componente en ui/components/ (NO DEBE existir esta carpeta)
[module]/ui/components/MyComponent/  // ❌ NO

// ❌ INCORRECTO: Componente de 1 feature en _shared
[module]/ui/_shared/components/IngestionCard/  // Solo lo usa ingestion → ❌

// ✅ CORRECTO: Componente específico de feature
[module]/ui/features/ingestion/components/IngestionCard/

// ✅ CORRECTO: Componente compartido entre features del módulo
[module]/ui/_shared/components/StatusBadge/  // Lo usan ingestion y faq
```

### Reglas OBLIGATORIAS

| # | Regla |
|---|-------|
| 1 | **`features/` OBLIGATORIO** - Todo módulo debe tener `ui/features/` |
| 2 | **`pages/` OBLIGATORIO** - Todo módulo debe tener `ui/pages/` |
| 3 | **Pages orquestan, Features implementan** - Pages NO tienen lógica de negocio |
| 4 | **DependencyInjection DEBE USARSE** - Crear Y consumir en hooks/screens |
| 5 | **NO try-catch con Result** - Result ya encapsula errores |
| 6 | **Patrón de negación** - `if (!result.isSuccess) { return; }` sin else |

### ❌ PROHIBIDO

```typescript
// ❌ Módulo sin features/ o pages/
[module]/ui/
├── components/  // ❌ NO a nivel de ui/
└── index.ts     // ❌ Falta features/ y pages/

// ❌ Lógica de negocio en pages
export const MyPage = () => {
  const [data, setData] = useState([]);        // ❌ Lógica en page
  const handleSubmit = async () => { /* */ };  // ❌ Handlers en page
};

// ❌ DependencyInjection creado pero NO usado
// features/my-feature/DependencyInjection.ts existe pero no se importa

// ❌ try-catch con operaciones Result
const loadData = async () => {
  try {                            // ❌ Innecesario
    const result = await GetData();
  } catch (error) { }              // ❌ Nunca se ejecuta
};

// ❌ if-else en lugar de negación
if (result.isSuccess) {
  setData(result.value);
} else {
  showError();
}
```

### ✅ CORRECTO

```typescript
// ✅ Page orquesta, Feature implementa
// ui/pages/my-module/my-module.page.tsx
import { MyFeatureScreen } from "@myModule/ui/features/my-feature";

export const MyModulePage = () => {
  return <MyFeatureScreen />;  // ✅ Solo renderiza screen de feature
};

// ✅ Negación con early return
const handleAction = async () => {
  const result = await DoSomething();
  
  if (!result.isSuccess) {  // ✅ Validar negación primero
    showError();
    return;
  }
  
  setData(result.value);    // ✅ Flujo feliz sin else
};
```

---

## Module Structure

```
[module]/
├── domain/                     # Business Core (NO deps externas)
│   ├── [feature]/
│   │   ├── constants/
│   │   ├── enums/
│   │   ├── errors/             # Error classes para Result
│   │   ├── interfaces/
│   │   ├── ports/
│   │   └── validations/        # Lógica de negocio PURA (retorna boolean)
│   └── _shared/
│
├── application/                # Use Cases
│   ├── [feature]/
│   │   └── [action]-[entity].usecase.ts
│   └── _shared/
│
├── infrastructure/             # Implementaciones externas
│   ├── [feature]/
│   │   ├── adapters/
│   │   ├── dtos/
│   │   ├── mappers/
│   │   ├── mocks/
│   │   └── utils/              # Funciones de presentación (parsers, formatters)
│   └── _shared/
│
└── ui/                         # ⚠️ ESTRUCTURA OBLIGATORIA
    ├── _shared/                # (Opcional) Compartido entre features
    ├── features/               # ⚠️ OBLIGATORIO
    │   └── [feature]/
    │       ├── components/
    │       ├── hooks/
    │       ├── screens/
    │       ├── store/
    │       ├── DependencyInjection.ts
    │       └── index.ts
    ├── pages/                  # ⚠️ OBLIGATORIO
    │   └── [page-name]/
    │       └── [page-name].page.tsx
    └── index.ts
```

### Domain Validations vs Infrastructure Utils

| Ubicación | Qué va | Retorna | Ejemplo |
|-----------|--------|---------|---------|
| `domain/validations/` | Lógica de negocio PURA | `boolean`, `number` | `isValidDuration()`, `getMaxValue()` |
| `infrastructure/utils/` | Lógica de presentación | `string`, objetos UI | `parseDurationString()`, `formatDuration()` |

```typescript
// ✅ domain/validations/ - Retorna boolean
export const isValidDuration = (value: number, type: DurationType): boolean => {
  return value >= 0 && value <= DURATION_MAX[type];
};

// ✅ infrastructure/utils/ - Parsea/formatea para UI
export const formatDuration = (value: number, type: DurationType): string => {
  return `${value} ${type === 'HOURS' ? 'horas' : 'minutos'}`;
};
```

---

## Result Pattern (MANDATORY)

### 1. Error Class (domain)

```typescript
// domain/[feature]/errors/GetDataError.ts
export class GetDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GET_DATA_ERROR';
  }
}
```

### 2. Port con Result (domain)

```typescript
// domain/[feature]/ports/data.port.ts
import { Result } from "@shared/domain/errors/Result";

export interface IDataPort {
  getData(): Promise<Result<IData[], GetDataError>>;
  createData(data: IData): Promise<Result<IData, CreateDataError>>;
}
```

### 3. Adapter con Result (infrastructure)

```typescript
// infrastructure/[feature]/adapters/data.adapter.ts
export class DataAdapter implements IDataPort {
  async getData(): Promise<Result<IData[], GetDataError>> {
    const response = await httpService.get<DataDto>('data');
    
    if (response.success && response.data) {
      return Result.Ok(DataMapper.toDomainList(response.data));
    }
    return Result.Err(new GetDataError(response.error?.message || 'Failed'));
  }
}
```

### 4. Use Case (application)

```typescript
// application/[feature]/get-data.usecase.ts
export class GetDataUseCase {
  constructor(private readonly dataPort: IDataPort) {}

  async execute(): Promise<Result<IData[], GetDataError>> {
    return await this.dataPort.getData();
  }
}
```

### 5. DependencyInjection (ui) ⚠️ OBLIGATORIO

```typescript
// ui/features/[feature]/DependencyInjection.ts
import { GetDataUseCase } from "src/[module]/application/[feature]/get-data.usecase";
import { DataAdapter } from "src/[module]/infrastructure/[feature]/adapters/data.adapter";

const dataAdapter = new DataAdapter();

export const GetDataUseCase = () => new GetDataUseCase(dataAdapter).execute();
export const CreateDataUseCase = (data: IDataInput) => new CreateDataUseCase(dataAdapter).execute(data);
```

### 6. Consumir en UI (SIN try-catch)

```typescript
// ui/features/[feature]/hooks/use-data.hook.ts
import { GetDataUseCase, CreateDataUseCase } from "../DependencyInjection";

export const useData = () => {
  const { t } = useTranslate();
  const { showToast } = useAuraToast();
  const [data, setData] = useState<IData[]>([]);

  const loadData = async () => {
    const result = await GetDataUseCase();
    
    if (!result.isSuccess) {  // ✅ Patrón de negación
      showToast(configureErrorToastWithTranslation(EnumErrorType.Critical, t, "error_key"));
      return;
    }
    
    setData(result.value);  // ✅ Flujo feliz
  };

  const createData = async (input: IDataInput): Promise<boolean> => {
    const result = await CreateDataUseCase(input);
    
    if (!result.isSuccess) {
      showToast(configureErrorToastWithTranslation(EnumErrorType.Critical, t, "error_key"));
      return false;
    }
    
    showToast(configureSuccessToast(t("success_title"), t("data_created")));
    await loadData();
    return true;
  };

  return { data, loadData, createData };
};
```

### Cuándo SÍ usar try-catch

**SOLO** para APIs externas que NO usan Result:

```typescript
// ✅ try-catch SOLO para APIs del navegador/terceros
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast(configureSuccessToast(t("copied")));
  } catch {
    showToast(configureErrorToastWithTranslation(EnumErrorType.Warning, t, "copy_failed"));
  }
};
```

---

## File Naming Conventions

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Use Cases | `[action]-[entity].usecase.ts` | `get-files.usecase.ts` |
| Ports | `[feature].port.ts` | `files.port.ts` |
| Adapters | `[feature].adapter.ts` | `files.adapter.ts` |
| DTOs | `[entity]-response.dto.ts` | `assets-response.dto.ts` |
| Interfaces | `[entity].ts` | `files.ts` |
| Errors | `[ErrorName]Error.ts` | `GetFilesError.ts` |
| Enums | `[name].enum.ts` | `status.enum.ts` |
| Validations | `[entity].validation.ts` | `email.validation.ts` |
| Mappers | `[entity].mapper.ts` | `files.mapper.ts` |
| Components | `[name].component.tsx` | `file-upload.component.tsx` |
| Screens | `[feature].screen.tsx` | `ingestion.screen.tsx` |
| Hooks | `use-[name].hook.ts` | `use-files.hook.ts` |
| Store | `use-[feature].store.ts` | `use-ingestion.store.ts` |
| Store Types | `[feature].types.ts` | `ingestion.types.ts` |
| Pages | `[name].page.tsx` | `config.page.tsx` |
| DI | `DependencyInjection.ts` | `DependencyInjection.ts` |

---

## Quick Checklist

### 1. Identificación de Features (PRIMERO)

- [ ] **Analizar** el módulo e identificar features potenciales
- [ ] **Proponer** features al usuario con descripción
- [ ] **ESPERAR** confirmación antes de crear estructura
- [ ] **Buscar** código similar en `shared/`, `_shared/`, features existentes

### 2. Ubicación de Código

- [ ] **1 feature** → `[module]/[layer]/[feature]/`
- [ ] **2+ features mismo módulo** → `[module]/[layer]/_shared/`
- [ ] **2+ módulos** → `shared/[layer]/` o `shared/features/[context]/`

### 3. Estructura UI (NON-NEGOTIABLE)

- [ ] `ui/features/` existe con al menos una feature
- [ ] `ui/pages/` existe con al menos una page
- [ ] Pages SOLO orquestan (importan screens de features)
- [ ] `DependencyInjection.ts` creado **Y USADO** en hooks/screens
- [ ] NO hay try-catch con operaciones DependencyInjection
- [ ] Patrón de negación: `if (!result.isSuccess) { return; }`

### 4. Result Pattern (por feature)

- [ ] Errors en `domain/[feature]/errors/`
- [ ] Ports definen `Result<T, E>` return types
- [ ] Adapters retornan `Result.Ok()` o `Result.Err()`
- [ ] UI consume via `DependencyInjection.ts`

---

## Reference Implementation

Ver `src/lindaConfig/` para ejemplo completo:

```
src/lindaConfig/
├── domain/
│   ├── ingestion/
│   │   ├── errors/
│   │   ├── interfaces/
│   │   └── ports/
│   └── faq/
├── application/
│   ├── ingestion/
│   └── faq/
├── infrastructure/
│   ├── ingestion/
│   │   ├── adapters/
│   │   ├── dtos/
│   │   └── mappers/
│   └── faq/
└── ui/
    ├── features/
    │   ├── ingestion/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── screens/
    │   │   ├── store/
    │   │   ├── DependencyInjection.ts
    │   │   └── index.ts
    │   └── faq/
    └── pages/
        └── chatbot-config/
            └── chatbot-config.page.tsx
```

### Flujo: Page → Screen → Hook → DependencyInjection

```
Router → /chatbot-config
         └── ChatbotConfigPage (pages/)
               └── <IngestionScreen /> (features/ingestion/screens/)
                     └── useIngestion() (features/ingestion/hooks/)
                           └── GetFiles() (DependencyInjection.ts)
                                 └── GetFilesUseCase (application/)
                                       └── FilesAdapter (infrastructure/)
```
