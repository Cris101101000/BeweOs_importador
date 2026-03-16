# AccordionList Component

Wrapper del componente `AccordionList` de `@beweco/aurora-ui` para uso en BeweOSsmbs.

## 📋 Descripción

El `AccordionListComponent` proporciona una interfaz flexible para mostrar listas de items en dos modos:
- **accordion**: Items expandibles con contenido detallado
- **list**: Vista de lista plana sin expansión

Este wrapper facilita la integración del componente en el proyecto beweossmbs, proporcionando documentación específica del proyecto y abstrayendo la dependencia externa.

## 🚀 Características

- ✅ Dos modos de visualización: accordion y list
- ✅ Header personalizable con title, subtitle y metadata chips
- ✅ Contenido expandible (solo en modo accordion)
- ✅ Acciones rápidas configurables por item
- ✅ Acciones condicionales basadas en propiedades del item
- ✅ Paginación integrada opcional
- ✅ Estado vacío personalizable
- ✅ Estado de carga
- ✅ Variantes de accordion: splitted, shadow, bordered, light
- ✅ Selección múltiple o individual (solo accordion)
- ✅ TypeScript con tipado genérico completo
- ✅ Dark mode soportado

## 🎯 Uso Básico

```typescript
import { AccordionListComponent, type BaseAccordionItem } from '@shared/ui/components';

interface MyItem extends BaseAccordionItem {
  title: string;
  description: string;
}

function MyPage() {
  const items: MyItem[] = [
    { id: '1', title: 'Item 1', description: 'Description 1' },
    { id: '2', title: 'Item 2', description: 'Description 2' },
  ];

  return (
    <AccordionListComponent<MyItem>
      mode="accordion"
      items={items}
      sectionTitle="Mis Items"
      showCount
      header={{
        getTitle: (item) => item.title,
        getSubtitle: (item) => item.description,
      }}
      content={{
        render: (item) => (
          <div>{item.description}</div>
        ),
      }}
    />
  );
}
```

## 📦 Casos de Uso en BeweOSsmbs

### 1. Contenido Propuesto de Redes Sociales

**Ubicación**: `/src/social-networks/ui/proposed-content/pages/proposed-content-tab.page.tsx`

Lista de contenidos generados por Linda AI con opciones de publicar, editar o eliminar.

```typescript
<AccordionListComponent<SocialMediaCarouselItem & BaseAccordionItem>
  mode="accordion"
  items={carouselItems}
  sectionTitle="Otros contenidos propuestos"
  sectionIcon="solar:document-text-bold-duotone"
  showCount
  accordionVariant="splitted"
  selectionMode="multiple"
  header={{
    getTitle: (item) => item.title,
    getMetadata: (item) => [
      {
        key: 'channel',
        label: 'Instagram',
        color: 'secondary',
        variant: 'flat',
      },
    ],
  }}
  content={{
    render: (item) => (
      <div>
        <p>{item.caption}</p>
        <button onClick={() => publish(item)}>Publicar</button>
      </div>
    ),
  }}
  actions={[
    {
      key: 'edit',
      icon: 'solar:pen-outline',
      tooltip: 'Editar contenido',
      color: 'default',
      onPress: (item) => handleEdit(item),
    },
    {
      key: 'delete',
      icon: 'solar:trash-bin-minimalistic-outline',
      tooltip: 'Eliminar contenido',
      color: 'danger',
      onPress: (item) => handleDelete(item),
    },
  ]}
/>
```

### 2. Historial de Notas de Clientes

**Uso potencial**: `/src/clients/ui/`

Vista de lista plana de notas con timestamps y autores.

```typescript
<AccordionListComponent
  mode="list"
  items={notes}
  sectionTitle="Historial de Notas"
  sectionIcon="solar:notes-outline"
  showCount
  header={{
    getTitle: (item) => item.title,
    getSubtitle: (item) => item.description,
    getMetadata: (item) => [
      {
        key: 'author',
        label: item.createdBy,
        color: 'primary',
        variant: 'flat',
      },
    ],
  }}
  actions={[
    {
      key: 'edit',
      icon: 'solar:pen-outline',
      onPress: (item) => handleEditNote(item),
    },
  ]}
/>
```

### 3. Historial de Comunicaciones

**Uso potencial**: `/src/clients/ui/`

Acordeón con emails, llamadas y mensajes agrupados.

```typescript
<AccordionListComponent
  mode="accordion"
  items={communications}
  sectionTitle="Comunicaciones"
  sectionIcon="solar:chat-dots-outline"
  showCount
  accordionVariant="shadow"
  header={{
    getTitle: (item) => item.subject,
    getMetadata: (item) => [
      {
        key: 'type',
        label: item.type, // Email, Call, SMS
        color: getColorForType(item.type),
        variant: 'flat',
        icon: getIconForType(item.type),
      },
    ],
  }}
  content={{
    render: (item) => (
      <div>
        <p>{item.message}</p>
        <p className="text-xs text-default-500">
          {new Date(item.createdAt).toLocaleString()}
        </p>
      </div>
    ),
  }}
/>
```

## 📊 Props

### Props Obligatorias

| Prop | Tipo | Descripción |
|------|------|-------------|
| `mode` | `"accordion" \| "list"` | Modo de visualización |
| `items` | `T[]` (extends `BaseAccordionItem`) | Array de items a mostrar |
| `header` | `AccordionHeaderConfig<T>` | Configuración del header |

### Props Opcionales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `sectionTitle` | `string` | `undefined` | Título de la sección |
| `sectionIcon` | `string` | `undefined` | Icono de la sección (Iconify) |
| `showCount` | `boolean` | `false` | Mostrar badge con conteo |
| `content` | `AccordionContentConfig<T>` | `undefined` | Config del contenido expandible |
| `actions` | `AccordionItemAction<T>[]` | `undefined` | Acciones rápidas |
| `accordionVariant` | `"splitted" \| "shadow" \| "bordered" \| "light"` | `"splitted"` | Variante del accordion |
| `selectionMode` | `"none" \| "single" \| "multiple"` | `"none"` | Modo de selección |
| `pagination` | `PaginationConfig` | `undefined` | Configuración de paginación |
| `emptyState` | `EmptyStateConfig` | `undefined` | Estado vacío personalizado |
| `isLoading` | `boolean` | `false` | Estado de carga |
| `className` | `string` | `""` | Clases CSS adicionales |

## 🎨 Configuraciones Avanzadas

### Header Configuration

```typescript
interface AccordionHeaderConfig<T> {
  /** Función para extraer el título */
  getTitle: (item: T) => string;
  /** Función para extraer el subtitle (opcional) */
  getSubtitle?: (item: T) => string;
  /** Función para extraer metadata chips (opcional) */
  getMetadata?: (item: T) => AccordionItemMetadata[];
  /** Render custom del header (sobrescribe otras configs) */
  customRender?: (item: T) => ReactNode;
}
```

### Content Configuration

```typescript
interface AccordionContentConfig<T> {
  /** Función de render del contenido expandible */
  render: (item: T) => ReactNode;
}
```

### Action Configuration

```typescript
interface AccordionItemAction<T> {
  /** Identificador único de la acción */
  key: string;
  /** Icono de Iconify */
  icon: string;
  /** Tooltip (opcional) */
  tooltip?: string;
  /** Color del botón */
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  /** Callback de la acción */
  onPress: (item: T) => void;
  /** Mostrar/ocultar condicionalmente */
  show?: boolean | ((item: T) => boolean);
}
```

### Pagination Configuration

```typescript
interface PaginationConfig {
  /** Página actual (1-indexed) */
  currentPage: number;
  /** Total de páginas */
  totalPages: number;
  /** Callback de cambio de página */
  onPageChange: (page: number) => void;
  /** Mostrar controles */
  showControls?: boolean;
  /** Estilo compacto */
  isCompact?: boolean;
}
```

## 💡 Notas Importantes

### Tipado Genérico

El componente acepta un tipo genérico que extiende `BaseAccordionItem`:

```typescript
interface MyItem extends BaseAccordionItem {
  title: string;
  description: string;
  customField: string;
}

<AccordionListComponent<MyItem>
  items={myItems}
  header={{
    getTitle: (item: MyItem) => item.title, // 'item' tiene tipo MyItem
  }}
/>
```

### Modos de Visualización

- **accordion**: Ideal para contenido extenso que necesita detalle
- **list**: Ideal para vistas rápidas sin expansión

### Acciones Condicionales

Las acciones pueden mostrarse/ocultarse dinámicamente:

```typescript
actions={[
  {
    key: 'publish',
    icon: 'solar:plain-3-bold',
    onPress: (item) => publish(item),
    show: (item) => item.status === 'draft', // Solo para drafts
  },
]}
```

### Paginación

**IMPORTANTE**: La paginación debe manejarse en el componente padre

```typescript
// ✅ CORRECTO: Padre maneja la paginación
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
const totalPages = Math.ceil(totalItems / itemsPerPage);

// Solo pasar items de la página actual
const currentPageItems = items.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

<AccordionListComponent
  items={currentPageItems} // Solo página actual
  pagination={{
    currentPage,
    totalPages, // Basado en total de registros
    onPageChange: (page) => {
      setCurrentPage(page);
      fetchItems(page); // Fetch del backend
    },
  }}
/>
```

### Empty State

El estado vacío se muestra automáticamente cuando `items.length === 0`:

```typescript
<AccordionListComponent
  items={[]}
  emptyState={{
    icon: 'solar:inbox-line-bold-duotone',
    title: 'No hay contenido',
    description: 'Crea tu primer item para comenzar',
    actionText: 'Crear Item',
    onAction: () => navigate('/crear'),
  }}
/>
```

## ♿ Accesibilidad

El componente incluye:
- Navegación por teclado completa
- Etiquetas ARIA apropiadas
- Soporte para lectores de pantalla
- Focus management automático

## 🌐 Integración con el Proyecto

### Sistema de Toast

```typescript
import { useAuraToast } from "@beweco/aurora-ui";

const { showToast } = useAuraToast();

<AccordionListComponent
  actions={[
    {
      key: 'delete',
      icon: 'solar:trash-bin-minimalistic-outline',
      onPress: (item) => {
        deleteItem(item.id);
        showToast({
          color: 'success',
          title: 'Item eliminado',
        });
      },
    },
  ]}
/>
```

### Sistema de Navegación

```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

<AccordionListComponent
  actions={[
    {
      key: 'edit',
      icon: 'solar:pen-outline',
      onPress: (item) => {
        navigate(`/edit/${item.id}`);
      },
    },
  ]}
/>
```

### Sistema de i18n (Tolgee)

```typescript
import { useTranslate } from "@tolgee/react";

const { t } = useTranslate();

<AccordionListComponent
  sectionTitle={t('section_title', 'Mis Items')}
  emptyState={{
    title: t('empty_state_title', 'No hay items'),
    description: t('empty_state_description', 'Crea tu primer item'),
    actionText: t('empty_state_action', 'Crear Item'),
  }}
/>
```

## 🔄 Migración desde Import Directo

Si ya estás usando el componente importándolo directamente de `@beweco/aurora-ui`, migra siguiendo estos pasos:

### Antes
```typescript
import { AccordionList } from "@beweco/aurora-ui";
import type { BaseAccordionItem } from "@beweco/aurora-ui";

function MyPage() {
  return <AccordionList items={items} />;
}
```

### Después
```typescript
import { AccordionListComponent, type BaseAccordionItem } from '@shared/ui/components';

function MyPage() {
  return <AccordionListComponent items={items} />;
}
```

## 📚 Referencias

- **Componente Base**: `@beweco/aurora-ui/AccordionList`
- **Implementación Original**: `auraui/src/components/accordion-list/AccordionList.tsx`
- **Documentación Completa**: `auraui/src/components/accordion-list/README.md`
- **Stories de Storybook**: `auraui/stories/AccordionList.stories.tsx`
- **Wrapper en beweossmbs**: `/src/shared/ui/components/AccordionList/AccordionList.tsx`

## 🔧 Mantenimiento

Este wrapper es un re-export directo del componente de aurora-ui sin modificaciones. Si se necesita añadir lógica específica del proyecto, se puede modificar el wrapper manteniendo la misma API pública.

## ⚠️ Notas Técnicas

1. **Tipado genérico**: Siempre especifica el tipo genérico `<T extends BaseAccordionItem>` para mejor type safety
2. **Handlers tipados**: Asegúrate de tipar explícitamente los parámetros en getTitle, getMetadata y render
3. **Paginación**: El padre debe manejar la lógica de paginación y solo pasar items de la página actual
4. **Performance**: Para listas grandes, considera virtualización o paginación

## 🚀 Próximos Pasos

Para ampliar el uso del componente en el proyecto:

1. **Historial de Notas**: Implementar en módulo de clientes
2. **Comunicaciones**: Mostrar historial de emails y llamadas
3. **Contenido Publicado**: Vista de posts ya publicados en redes sociales
4. **Campañas de WhatsApp**: Listar campañas con detalles expandibles
