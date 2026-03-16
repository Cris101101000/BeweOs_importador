# Campaigns UI - Vertical Slices Architecture

Este módulo implementa la interfaz de usuario para gestión de campañas siguiendo los principios de **Vertical Slice Architecture**.

## 📁 Estructura de Directorios

```
campaigns/ui/
├── _shared/                      # Componentes compartidos entre slices
│   ├── components/
│   └── types/
│
├── proposed-campaigns/           # Slice: Contenido propuesto por Linda
│   ├── pages/
│   │   └── proposed-campaigns-tab.page.tsx
│   └── index.ts
│
├── templates/                    # Slice: Gestión de plantillas
│   ├── pages/
│   │   └── templates-tab.page.tsx
│   └── index.ts
│
├── campaign-history/             # Slice: Historial de campañas
│   ├── pages/
│   │   └── campaign-history-tab.page.tsx
│   └── index.ts
│
├── pages/                        # Páginas principales (containers)
│   └── campanas.page.tsx
│
└── index.ts                      # Exportaciones principales
```

## 🎯 Slices Verticales

### 1. **Proposed Campaigns** (`proposed-campaigns/`)

**Responsabilidad**: Mostrar y gestionar contenido de campañas generado por Linda AI.

**Características**:
- ✅ Carousel 3D con contenido propuesto
- ✅ Banner informativo de Linda
- ✅ Preview modal para visualización
- ✅ Acciones: Ver, Editar, Eliminar, Publicar
- ✅ Navegación al wizard con datos pre-cargados

**Componentes principales**:
- `ProposedCampaignsTabPage`: Página con carousel de contenido propuesto

**Uso**:
```tsx
import { ProposedCampaignsTabPage } from '@campaigns/ui/proposed-campaigns';

<ProposedCampaignsTabPage />
```

---

### 2. **Templates** (`templates/`)

**Responsabilidad**: Gestión de plantillas de campañas.

**Características**:
- ✅ Tabla con listado de plantillas
- ✅ Búsqueda y filtrado avanzado
- ✅ Ordenamiento por columnas
- ✅ Acciones: Usar, Duplicar, Eliminar
- ✅ Modales de confirmación
- ✅ Indicadores de plantillas generadas con IA

**Componentes principales**:
- `TemplatesTabPage`: Página con tabla de plantillas

**Uso**:
```tsx
import { TemplatesTabPage } from '@campaigns/ui/templates';

<TemplatesTabPage />
```

---

### 3. **Campaign History** (`campaign-history/`)

**Responsabilidad**: Historial de campañas publicadas con métricas.

**Características**:
- ✅ Tabla con historial de campañas
- ✅ Métricas de engagement (delivery, open, click rates)
- ✅ Búsqueda y filtrado avanzado
- ✅ Paginación
- ✅ Acción: Repetir campaña
- ✅ Estados visuales (Publicado, Pendiente, etc.)

**Componentes principales**:
- `CampaignHistoryTabPage`: Página con tabla de historial

**Uso**:
```tsx
import { CampaignHistoryTabPage } from '@campaigns/ui/campaign-history';

<CampaignHistoryTabPage />
```

---

## 📄 Página Principal

### `CampanasPage`

Orquesta los tres slices a través de tabs:

```tsx
import { CampanasPage } from '@campaigns/ui/pages';

// Estructura interna:
<Tabs>
  <Tab title="Crear Contenido">
    <ProposedCampaignsTabPage />
  </Tab>
  
  <Tab title="Plantillas">
    <TemplatesTabPage />
  </Tab>
  
  <Tab title="Historial">
    <CampaignHistoryTabPage />
  </Tab>
</Tabs>
```

---

## 🔗 Integración con SocialMediaCarousel

El slice de **Proposed Campaigns** utiliza el componente `SocialMediaCarouselComponent` de `@shared/ui/components`:

```tsx
import { SocialMediaCarouselComponent } from '@shared/ui/components';
import type { SocialMediaCarouselItem } from '@shared/ui/components';

<SocialMediaCarouselComponent 
  items={carouselItems}
  onItemClick={handleCarouselItemClick}
  onEdit={handleEditCarouselItem}
  onDelete={handleDeleteCarouselItem}
  onPublish={handlePublishCarouselItem}
  onPreview={handlePreviewCarouselItem}
  emptyStateRedirectPath="/campaigns/create-campaign"
/>
```

**Ver documentación completa**: `@shared/ui/components/SocialMediaCarousel/README.md`

---

## 🎨 Características Comunes

### Dark Mode
Todos los componentes soportan modo oscuro con las clases de Tailwind:
- `dark:bg-*`
- `dark:text-*`
- `dark:border-*`

### Responsive Design
Grid adaptativo siguiendo breakpoints de BeweOS:
- **xs (320px)**: 1 columna
- **sm (640px)**: 1 columna
- **md (744px)**: 2 columnas
- **lg (1024px)**: 3 columnas
- **xl (1280px+)**: 4 columnas

### Accesibilidad
- ✅ ARIA labels en todos los controles
- ✅ Navegación por teclado
- ✅ Screen reader support
- ✅ Indicadores de foco visibles

---

## 📊 Flujo de Datos

```
Usuario interactúa
    ↓
Slice específico (proposed-campaigns/templates/campaign-history)
    ↓
Handlers de eventos (onClick, onEdit, onDelete, etc.)
    ↓
Navegación al wizard o actualización de estado
    ↓
Backend (cuando aplique)
```

---

## 🧪 Testing

Cada slice es independiente y testeable:

```typescript
// Ejemplo para proposed-campaigns
describe('ProposedCampaignsTabPage', () => {
  it('should render carousel with items', () => {
    // Test implementation
  });
  
  it('should navigate to wizard on publish', () => {
    // Test implementation
  });
});
```

---

## 🔄 Comparación con Social Networks

| Aspecto | Social Networks | Campaigns |
|---------|----------------|-----------|
| **Slices** | `content-creation`, `content-history`, `proposed-content` | `proposed-campaigns`, `templates`, `campaign-history` |
| **Carousel** | ✅ En `proposed-content` | ✅ En `proposed-campaigns` |
| **Tablas** | ✅ En `content-history` | ✅ En `templates` y `campaign-history` |
| **Estructura** | Vertical Slices UI | Vertical Slices UI |
| **Componentes compartidos** | `@shared/ui/components` | `@shared/ui/components` |

---

## 📚 Referencias

- **Vertical Slice Architecture**: Ver `.cursor/rules`
- **SocialMediaCarousel**: `@shared/ui/components/SocialMediaCarousel/README.md`
- **Aurora UI**: `@beweco/aurora-ui`
- **Patrón de referencia**: `src/social-networks/ui/`

---

## 🚀 Próximos Pasos

1. **Integración con Backend**: Conectar con APIs reales
2. **Hooks personalizados**: Crear hooks para lógica de negocio
3. **Estados de carga**: Implementar skeletons y spinners
4. **Optimización**: Memoización y lazy loading
5. **Tests**: Cobertura completa de tests unitarios

---

## 💡 Mejores Prácticas

1. **Mantener slices independientes**: Mínimas dependencias entre slices
2. **Compartir solo lo necesario**: Usar `_shared` solo para elementos comunes
3. **Exportar API pública**: Cada slice exporta solo lo necesario
4. **Documentar cambios**: Actualizar este README cuando se agreguen slices
5. **Seguir convenciones**: Mantener consistencia con `social-networks`

