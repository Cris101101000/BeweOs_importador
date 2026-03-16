# SocialMediaCarousel Component - BeweOS Wrapper

Wrapper del componente `SocialMediaCarousel` de `@beweco/aurora-ui` integrado con el sistema de traducciones de BeweOS (`@tolgee/react`).

## 📋 Características

- ✅ Carousel 3D especializado para contenido de redes sociales
- ✅ **Integración automática con sistema i18n de BeweOS** (`@tolgee/react`)
- ✅ SocialMediaBar integrada como footer por defecto
- ✅ Información de audiencia con contador, razones y tags
- ✅ Soporte para Instagram Post, Instagram Story, TikTok, WhatsApp
- ✅ Gestión completa de contenido (editar, eliminar, publicar)
- ✅ Traducciones por defecto en español desde archivos de locales
- ✅ Dark mode soportado
- ✅ Accesibilidad completa con ARIA labels
- ✅ TypeScript con tipado completo

## 🚀 Uso Básico

```tsx
import { SocialMediaCarouselComponent } from '@shared/ui/components';
import type { SocialMediaCarouselItem } from '@shared/ui/components';

function MyPage() {
  const socialItems: SocialMediaCarouselItem[] = [
    {
      id: "post-1",
      title: "Promoción Especial",
      caption: "¡Descuentos increíbles este fin de semana!",
      imageUrl: "/images/promo.jpg",
      gradient: "linear-gradient(45deg, #2D35EB 0%, #904ED4 100%)",
      type: "instagram-post",
      targetAudienceCount: 1250,
      audienceReason: "Clientes que compraron en los últimos 30 días",
      requiredTags: ["clientes_activos", "compras_recientes"]
    },
    {
      id: "story-1",
      title: "Nueva Colección",
      caption: "Descubre nuestra nueva colección de primavera",
      imageUrl: "/images/collection.jpg",
      gradient: "linear-gradient(45deg, #FF6B6B 0%, #FFE66D 100%)",
      type: "instagram-story",
      targetAudienceCount: 890,
      audienceReason: "Seguidores interesados en moda",
      requiredTags: ["moda", "tendencias"]
    }
  ];

  const handleEdit = (item: SocialMediaCarouselItem) => {
    console.log("Editar:", item);
    // Abrir modal de edición
  };

  const handleDelete = (item: SocialMediaCarouselItem) => {
    console.log("Eliminar:", item);
    // Mostrar confirmación y eliminar
  };

  const handlePublish = (item: SocialMediaCarouselItem) => {
    console.log("Publicar:", item);
    // Publicar en la red social
  };

  return (
    <SocialMediaCarouselComponent
      items={socialItems}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onPublish={handlePublish}
    />
  );
}
```

## 🎯 Props

### Props Obligatorias

| Prop | Tipo | Descripción |
|------|------|-------------|
| `items` | `SocialMediaCarouselItem[]` | Array de items de contenido social a mostrar |

### Props Opcionales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `onItemClick` | `(item: SocialMediaCarouselItem) => void` | `undefined` | Callback cuando se hace click en el item |
| `onEdit` | `(item: SocialMediaCarouselItem) => void` | `undefined` | Callback cuando se presiona editar |
| `onDelete` | `(item: SocialMediaCarouselItem) => void` | `undefined` | Callback cuando se presiona eliminar |
| `onPublish` | `(item: SocialMediaCarouselItem) => void` | `undefined` | Callback cuando se presiona publicar |
| `onPreview` | `(item: SocialMediaCarouselItem) => void` | `undefined` | Callback cuando se presiona preview (ojo) |
| `className` | `string` | `""` | Clases CSS adicionales para el contenedor |
| `emptyStateRedirectPath` | `string` | `"/contenidos-ai/crear-contenido"` | Ruta de redirección para el botón del estado vacío |
| `compactHeader` | `boolean` | `false` | Si true, muestra la audiencia en formato compacto |
| `campaignView` | `boolean` | `false` | Si true, optimiza el layout para vista de campañas |
| `hideFooter` | `boolean` | `false` | Si true, oculta la SocialMediaBar |
| `hideAudienceInfo` | `boolean` | `false` | Si true, oculta la información de audiencia |
| `translations` | `Partial<ContentCarouselTranslations>` | `{}` | Sobrescribir traducciones específicas |

## 📖 Ejemplos Avanzados

### Contenido de Instagram

```tsx
import { SocialMediaCarouselComponent } from '@shared/ui/components';

<SocialMediaCarouselComponent
  items={instagramPosts}
  onEdit={handleEditPost}
  onDelete={handleDeletePost}
  onPublish={handlePublishPost}
/>
```

### Campaña de WhatsApp

```tsx
<SocialMediaCarouselComponent
  items={whatsappCampaigns}
  campaignView={true}
  onEdit={handleEditCampaign}
  onPublish={handlePublishCampaign}
/>
```

### Sin Información de Audiencia

```tsx
<SocialMediaCarouselComponent
  items={items}
  hideAudienceInfo={true}
  onPublish={handlePublish}
/>
```

### Sin Footer (Solo Navegación)

```tsx
<SocialMediaCarouselComponent
  items={items}
  hideFooter={true}
  onItemClick={handleItemClick}
/>
```

### Con Traducciones Personalizadas

```tsx
<SocialMediaCarouselComponent
  items={items}
  translations={{
    publishButtonLabel: "Enviar ahora",
    editButtonLabel: "Modificar",
    deleteButtonLabel: "Descartar"
  }}
  onPublish={handlePublish}
/>
```

## 🎨 Tipos

### SocialMediaCarouselItem

```typescript
interface SocialMediaCarouselItem {
  // Campos obligatorios
  id: string;
  title: string;
  gradient: string;
  type: "instagram-post" | "instagram-story" | "tiktok-video" | "whatsapp" | "whatsapp-message";
  
  // Campos opcionales
  caption?: string;
  imageUrl?: string;
  targetAudienceCount?: number;
  audienceReason?: string;
  requiredTags?: string[];
  
  // Campos extendidos
  name?: string;
  category?: string;
  language?: string;
  variables?: Record<string, any>;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
}
```

## 🌐 Internacionalización

### Sistema de Traducciones

El componente usa **automáticamente** las traducciones del sistema i18n de BeweOS (`@tolgee/react`).

**Claves de traducción en archivos de locales** (`src/locales/[lang]/common.json`):

```json
{
  "carousel_empty_state_message": "No hay más contenido propuesto",
  "carousel_empty_state_button": "Crear contenido nuevo",
  "carousel_previous_button": "Anterior",
  "carousel_next_button": "Siguiente",
  "carousel_edit_button": "Editar",
  "carousel_delete_button": "Eliminar",
  "carousel_publish_button": "Publicar",
  "carousel_preview_button": "Ver vista previa",
  "carousel_go_to_item": "Ir al item"
}
```

### Traducciones Fallback

Si las claves no existen en el sistema i18n, el componente usa automáticamente traducciones por defecto en español.

### Sobrescribir Traducciones

Puedes sobrescribir traducciones específicas sin modificar los archivos de locales:

```tsx
<SocialMediaCarouselComponent
  items={items}
  translations={{
    publishButtonLabel: "Publicar ahora",
    editButtonLabel: "Modificar contenido"
  }}
/>
```

## 🔧 Integración con Sistema de Gestión

### Con Modal de Edición

```tsx
const [selectedItem, setSelectedItem] = useState<SocialMediaCarouselItem | null>(null);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);

const handleEdit = (item: SocialMediaCarouselItem) => {
  setSelectedItem(item);
  setIsEditModalOpen(true);
};

<>
  <SocialMediaCarouselComponent
    items={proposedContent}
    onEdit={handleEdit}
    onDelete={handleDelete}
    onPublish={handlePublish}
  />
  
  <EditContentModal
    isOpen={isEditModalOpen}
    item={selectedItem}
    onClose={() => setIsEditModalOpen(false)}
    onSave={handleSaveEdit}
  />
</>
```

### Con Confirmación de Eliminación

```tsx
const handleDeleteWithConfirmation = async (item: SocialMediaCarouselItem) => {
  const confirmed = window.confirm(
    `¿Estás seguro de eliminar "${item.title}"?`
  );
  
  if (confirmed) {
    try {
      await deleteContent(item.id);
      showSuccessToast("Contenido eliminado correctamente");
    } catch (error) {
      showErrorToast("Error al eliminar el contenido");
    }
  }
};

<SocialMediaCarouselComponent
  items={items}
  onDelete={handleDeleteWithConfirmation}
/>
```

### Con Publicación a Red Social

```tsx
const handlePublish = async (item: SocialMediaCarouselItem) => {
  try {
    await publishToSocialMedia({
      platform: item.type,
      content: {
        title: item.title,
        caption: item.caption,
        imageUrl: item.imageUrl
      }
    });
    
    showSuccessToast(`Publicado en ${item.type}`);
  } catch (error) {
    showErrorToast("Error al publicar");
  }
};

<SocialMediaCarouselComponent
  items={pendingContent}
  onPublish={handlePublish}
/>
```

## 🎯 Casos de Uso en BeweOS

### 1. Contenido Propuesto por IA (Linda)
Mostrar contenido generado por IA para revisión y aprobación:

```tsx
// En proposed-content-tab.page.tsx
<SocialMediaCarouselComponent
  items={aiProposedContent}
  onEdit={openEditModal}
  onDelete={confirmDelete}
  onPublish={publishContent}
/>
```

### 2. Gestión de Campañas
Administrar campañas de WhatsApp o contenido programado:

```tsx
// En campaigns page
<SocialMediaCarouselComponent
  items={campaigns}
  campaignView={true}
  onEdit={editCampaign}
  onPublish={launchCampaign}
/>
```

### 3. Historial de Contenido
Mostrar contenido publicado o en revisión:

```tsx
// En history-tab.page.tsx
<SocialMediaCarouselComponent
  items={contentHistory}
  hideFooter={true} // Solo ver, sin acciones
  onItemClick={viewDetails}
/>
```

## 🏗️ Arquitectura

Este componente es un **wrapper** que:

1. **Importa** `SocialMediaCarousel` desde `@beweco/aurora-ui`
2. **Integra** traducciones de `@tolgee/react`
3. **Proporciona** fallbacks en español
4. **Permite** sobrescribir traducciones específicas

```
SocialMediaCarouselComponent (BeweOS Wrapper)
    ↓ importa y configura
SocialMediaCarousel (@beweco/aurora-ui)
    ↓ extiende
ContentCarousel (Genérico)
    ↓ usa
SocialMediaBar (Footer)
```

## ♿ Accesibilidad

Hereda todas las características de accesibilidad del componente base:

- ✅ ARIA labels en todos los controles interactivos
- ✅ Navegación por teclado (Tab, Enter, Space)
- ✅ Indicadores de foco visibles
- ✅ Screen reader support con anuncios de cambios
- ✅ Contraste adecuado en overlays y textos
- ✅ Botones deshabilitados con estados claros

## 🎨 Personalización

### Ocultar Elementos

```tsx
// Solo carousel, sin audiencia ni footer
<SocialMediaCarouselComponent
  items={items}
  hideAudienceInfo={true}
  hideFooter={true}
/>

// Solo badge de plataforma (sin botones de acción)
<SocialMediaCarouselComponent
  items={items}
  hideAudienceInfo={true}
  // No pasar onEdit, onDelete, onPublish
/>
```

### Estilos Personalizados

```tsx
<SocialMediaCarouselComponent
  items={items}
  className="my-8 px-4"
  onPublish={handlePublish}
/>
```

## 📚 Componentes Relacionados

- **ContentCarousel**: Componente base genérico en `@beweco/aurora-ui`
- **SocialMediaBar**: Footer independiente para redes sociales
- **SocialMediaPreviewComponent**: Preview detallado de contenido social

## 🔗 Diferencia con ContentCarousel Base

| Característica | ContentCarousel (Base) | SocialMediaCarousel (Wrapper) |
|----------------|------------------------|-------------------------------|
| **Propósito** | Genérico, cualquier contenido | Específico para redes sociales |
| **Footer** | Ninguno por defecto | SocialMediaBar integrada |
| **Audiencia** | No | Sí (contador, razones, tags) |
| **Callbacks** | Solo `onItemClick` | `onEdit`, `onDelete`, `onPublish` |
| **Traducciones** | Props manuales | Integradas con @tolgee |
| **Tipo de item** | `CarouselItem` genérico | `SocialMediaCarouselItem` tipado |

## 📝 Notas Importantes

### Sistema de Traducciones

1. **Automático**: Las traducciones se cargan automáticamente desde los archivos de locales
2. **Fallbacks**: Si una clave no existe, usa traducciones por defecto en español
3. **Sobrescribible**: Puedes pasar `translations` prop para casos específicos
4. **Multiidioma**: Soporta español, inglés, portugués según configuración de BeweOS

### Importación Correcta

**✅ CORRECTO** (desde shared):
```tsx
import { SocialMediaCarouselComponent } from '@shared/ui/components';
```

**❌ INCORRECTO** (directo desde aurora-ui):
```tsx
// NO hacer esto en beweossmbs
import { SocialMediaCarousel } from '@beweco/aurora-ui';
```

**Razón**: El wrapper en `shared` integra el sistema de traducciones de BeweOS.

## 🔄 Flujo de Datos

```
Usuario interactúa
    ↓
SocialMediaCarouselComponent (wrapper)
    ↓ aplica traducciones de @tolgee
SocialMediaCarousel (@beweco/aurora-ui)
    ↓ gestiona navegación y renderizado
ContentCarousel (base genérica)
    ↓ renderiza con
SocialMediaBar (footer)
```

## 🎯 Mejores Prácticas

### 1. Gestión de Estados

```tsx
const [items, setItems] = useState<SocialMediaCarouselItem[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  loadProposedContent().then(setItems).finally(() => setIsLoading(false));
}, []);

if (isLoading) {
  return <Spinner />;
}

return (
  <SocialMediaCarouselComponent
    items={items}
    onPublish={handlePublish}
  />
);
```

### 2. Feedback al Usuario

```tsx
const handlePublish = async (item: SocialMediaCarouselItem) => {
  try {
    setIsPublishing(true);
    await publishContent(item);
    
    // Actualizar estado
    setItems(prev => prev.filter(i => i.id !== item.id));
    
    // Mostrar éxito
    showSuccessToast(`Contenido publicado en ${item.type}`);
  } catch (error) {
    showErrorToast("Error al publicar");
  } finally {
    setIsPublishing(false);
  }
};
```

### 3. Validación Antes de Publicar

```tsx
const handlePublish = (item: SocialMediaCarouselItem) => {
  // Validar que tenga imagen
  if (!item.imageUrl) {
    showWarningToast("El contenido debe tener una imagen");
    return;
  }
  
  // Validar que tenga caption
  if (!item.caption) {
    showWarningToast("El contenido debe tener una descripción");
    return;
  }
  
  // Proceder con publicación
  publishToSocialMedia(item);
};
```

## 📚 Referencias

- Basado en `SocialMediaCarousel` de `@beweco/aurora-ui`
- Integrado con sistema i18n de BeweOS
- Documentación completa en `@beweco/aurora-ui`
- Optimizado para flujos de trabajo de contenido social

