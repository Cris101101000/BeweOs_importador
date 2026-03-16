# ImagePreviewComponent - BeweOS

Componente wrapper de `ImagePreview` de `@beweco/aurora-ui` integrado con el sistema de traducciones de BeweOS (@tolgee/react).

> **📦 Componente Base**: [`@beweco/aurora-ui`](https://www.npmjs.com/package/@beweco/aurora-ui) - ImagePreview  
> **📖 Documentación AuraUI**: [Ver README completo](../../../../../../auraui/src/components/image-preview/README.md)  
> **🎨 Storybook**: Ejecutar `bun run storybook` en `/auraui` → Components > ImagePreview  
> **⚡ Guía Rápida**: [USAGE_GUIDE.md](./USAGE_GUIDE.md) - Ejemplos de uso inmediato

---

## 🎯 ¿Por qué usar este Wrapper?

### Ventajas sobre Importación Directa

| Aspecto | ImagePreview (Aurora UI) | ImagePreviewComponent (Wrapper) |
|---------|--------------------------|----------------------------------|
| **Importación** | `@beweco/aurora-ui` | `@shared/ui/components` |
| **Traducciones** | ❌ Manual (prop translations) | ✅ **Automáticas** desde i18n |
| **Configuración i18n** | ⚠️ Requerida en cada uso | ✅ **Cero configuración** |
| **Keys de traducción** | ⚠️ Manual por componente | ✅ **Centralizadas** en common.json |
| **Mantenimiento** | ⚠️ Duplicado en cada uso | ✅ **Un solo lugar** |
| **Consistencia** | ⚠️ Puede variar | ✅ **Garantizada** |

### Cuándo Usar Cada Uno

✅ **Usar ImagePreviewComponent (Wrapper)** cuando:
- Estés trabajando en cualquier módulo de BeweOS
- Quieras traducciones automáticas del sistema i18n
- Necesites consistencia con el resto del proyecto
- Quieras menos código boilerplate

⚠️ **Usar ImagePreview directo** cuando:
- Trabajes fuera de BeweOS
- Necesites control total sobre traducciones
- No tengas acceso al sistema @tolgee/react

## 📋 Características

### Del Componente Base (@beweco/aurora-ui)
- ✅ **Soporte imagen única o múltiple** automático
- ✅ **Cuatro tamaños**: micro (48x48), small (100x100), medium (150x150), large (200x200)
- ✅ **Botón de eliminación** integrado con callback
- ✅ **Imágenes clickeables** para abrir modales, editores o acciones custom
- ✅ **Dark mode** totalmente soportado
- ✅ **Accesibilidad completa** (ARIA, navegación por teclado)
- ✅ **TypeScript** con tipado completo
- ✅ **Personalización visual** (radius, borders, background)

### Características del Wrapper BeweOS
- ✅ **Integración automática** con sistema de traducciones @tolgee/react
- ✅ **Traducciones por defecto** en español, inglés desde archivos de locales
- ✅ **Cero configuración** de traducciones necesaria
- ✅ **Sobrescritura opcional** de traducciones específicas

## 🚀 Uso Básico

> **💡 Recomendación**: Este componente es un wrapper del componente base de `@beweco/aurora-ui` con integración automática de traducciones. Para uso en BeweOS, **siempre importar desde `@shared/ui/components`**.

### Logo de Empresa (Single Image)

```tsx
import { ImagePreviewComponent } from "@shared/ui/components";

function BusinessLogoPreview() {
  const handleRemoveLogo = () => {
    // Lógica para eliminar logo
    console.log("Logo eliminado");
  };

  return (
    <ImagePreviewComponent
      images={companyLogo}
      size="small"
      onRemove={handleRemoveLogo}
    />
  );
}
```

### Importación Directa desde Aurora UI (Alternativa)

Si necesitas usar el componente sin la integración de traducciones de BeweOS:

```tsx
import { ImagePreview } from "@beweco/aurora-ui";
import type { ImagePreviewItem } from "@beweco/aurora-ui";

function DirectUsage() {
  return (
    <ImagePreview
      images={images}
      size="medium"
      translations={{
        previewAlt: "Custom preview alt",
        removeButtonAriaLabel: "Custom remove label"
      }}
      onRemove={(id) => handleRemove(id)}
    />
  );
}
```

> **⚠️ Nota**: La importación directa desde `@beweco/aurora-ui` requiere proporcionar manualmente las traducciones. El wrapper de BeweOS (`ImagePreviewComponent`) las proporciona automáticamente.

### Galería de Productos (Multiple Images)

```tsx
import { ImagePreviewComponent } from "@shared/ui/components";

function ProductGallery() {
  const products = [
    { src: "product1.jpg", alt: "Producto 1", id: "prod-1" },
    { src: "product2.jpg", alt: "Producto 2", id: "prod-2" },
    { src: "product3.jpg", alt: "Producto 3", id: "prod-3" },
  ];

  const handleRemoveProduct = (id?: string) => {
    console.log(`Eliminar producto: ${id}`);
  };

  return (
    <ImagePreviewComponent
      images={products}
      size="medium"
      onRemove={handleRemoveProduct}
    />
  );
}
```

## 🎯 Props

### Props Obligatorias

| Prop | Tipo | Descripción |
|------|------|-------------|
| `images` | `string \| ImagePreviewItem \| Array<string \| ImagePreviewItem>` | URL de imagen única o array de imágenes |

### Props Opcionales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `size` | `"micro" \| "small" \| "medium" \| "large"` | `"small"` | Tamaño del preview |
| `onRemove` | `(id?: string, index?: number) => void` | `undefined` | Callback cuando se elimina una imagen |
| `onImageClick` | `(image: ImagePreviewItem, index: number) => void` | `undefined` | Callback cuando se hace clic en una imagen |
| `showRemoveButton` | `boolean` | `true` | Mostrar botón de eliminar |
| `className` | `string` | `""` | Clases CSS adicionales |
| `backgroundColor` | `string` | `"bg-white dark:bg-gray-800"` | Color de fondo |
| `radius` | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"lg"` | Radio de los bordes |
| `showBorder` | `boolean` | `true` | Mostrar borde |
| `translations` | `Partial<ImagePreviewTranslations>` | `{}` | Sobrescribir traducciones específicas |

## 📖 Ejemplos Avanzados

### Con Modal de Pantalla Completa

```tsx
import { ImagePreviewComponent } from "@shared/ui/components";
import { Modal, ModalContent, ModalBody, useDisclosure } from "@beweco/aurora-ui";
import { useState } from "react";

function ClickableGallery() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState("");
  const [images, setImages] = useState([
    { src: "img1.jpg", alt: "Imagen 1", id: "1" },
    { src: "img2.jpg", alt: "Imagen 2", id: "2" },
    { src: "img3.jpg", alt: "Imagen 3", id: "3" },
  ]);

  const handleImageClick = (image: ImagePreviewItem) => {
    setSelectedImage(image.src);
    onOpen();
  };

  const handleRemove = (id?: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <>
      <ImagePreviewComponent
        images={images}
        size="medium"
        onImageClick={handleImageClick}
        onRemove={handleRemove}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalContent>
          <ModalBody className="p-0">
            <img 
              src={selectedImage} 
              alt="Vista ampliada" 
              className="w-full h-auto rounded-lg"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
```

### Uso en Settings - Logo Manager

```tsx
import { ImagePreviewComponent } from "@shared/ui/components";
import { Card } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";

function LogoManager({ logo, onLogoRemove }) {
  const { t } = useTranslate();

  return (
    <Card className="p-5 w-full gap-4">
      <div>
        <h2 className="font-medium text-lg">
          {t("settings_business_logo_title")}
        </h2>
        <p className="text-default-500 text-sm">
          {t("settings_business_logo_description")}
        </p>
      </div>

      {logo ? (
        <div className="space-y-4">
          <ImagePreviewComponent
            images={logo}
            size="small"
            onRemove={onLogoRemove}
          />
          <p className="text-tiny text-default-500 text-left">
            {t("settings_business_logo_recommended_size_with_weight")}
          </p>
        </div>
      ) : (
        <div className="border-2 border-dashed border-default-300 rounded-lg p-8 text-center">
          <p className="text-default-500">
            {t("no_logo_configured")}
          </p>
        </div>
      )}
    </Card>
  );
}
```

### Abrir Imagen en Nueva Pestaña

```tsx
import { ImagePreviewComponent } from "@shared/ui/components";

function DownloadableGallery() {
  const handleImageClick = (image: ImagePreviewItem) => {
    window.open(image.src, '_blank');
  };

  return (
    <ImagePreviewComponent
      images={downloadableImages}
      size="large"
      onImageClick={handleImageClick}
      showRemoveButton={false}
    />
  );
}
```

### Con Editor de Imágenes

```tsx
import { ImagePreviewComponent } from "@shared/ui/components";

function EditableGallery() {
  const handleImageClick = (image: ImagePreviewItem) => {
    // Abrir editor de imágenes externo
    openImageEditor(image.src);
  };

  const handleRemove = (id?: string) => {
    // Eliminar imagen del backend
    deleteImage(id);
  };

  return (
    <ImagePreviewComponent
      images={editableImages}
      size="medium"
      onImageClick={handleImageClick}
      onRemove={handleRemove}
    />
  );
}
```

### Avatares Circulares

```tsx
import { ImagePreviewComponent } from "@shared/ui/components";

function TeamAvatars() {
  const teamMembers = [
    { src: "avatar1.jpg", alt: "Usuario 1", id: "user-1" },
    { src: "avatar2.jpg", alt: "Usuario 2", id: "user-2" },
    { src: "avatar3.jpg", alt: "Usuario 3", id: "user-3" },
  ];

  return (
    <ImagePreviewComponent
      images={teamMembers}
      size="micro"
      radius="full"
      showRemoveButton={false}
    />
  );
}
```

## 🌍 Sistema de Traducciones

### Keys de Traducción Automáticas

El componente usa automáticamente estas claves del sistema i18n:

```json
// src/locales/es/common.json
{
  "image_preview_alt": "Vista previa de imagen",
  "image_preview_remove_aria_label": "Eliminar imagen",
  "image_preview_empty_state": "No hay imágenes para mostrar",
  "image_preview_clickable_aria_label": "Hacer clic para ampliar imagen"
}
```

### Sobrescribir Traducciones (Opcional)

Si necesitas traducciones específicas para un contexto:

```tsx
<ImagePreviewComponent
  images={logo}
  translations={{
    previewAlt: "Vista previa del logo de la empresa",
    removeButtonAriaLabel: "Eliminar logo de la empresa"
  }}
/>
```

## 🎨 Tipos

Todos los tipos están disponibles tanto desde el wrapper de BeweOS como desde Aurora UI:

```tsx
// Desde el wrapper de BeweOS
import type { 
  ImagePreviewComponentProps, 
  ImagePreviewItem,
  ImagePreviewTranslations 
} from "@shared/ui/components";

// O directamente desde Aurora UI
import type { 
  ImagePreviewProps,
  ImagePreviewItem,
  ImagePreviewTranslations 
} from "@beweco/aurora-ui";
```

### ImagePreviewItem
```typescript
interface ImagePreviewItem {
  src: string;       // URL de la imagen
  alt?: string;      // Texto alternativo
  id?: string;       // Identificador único
}
```

### ImagePreviewComponentProps (Wrapper BeweOS)
```typescript
interface ImagePreviewComponentProps extends Omit<ImagePreviewProps, "translations"> {
  images: string | ImagePreviewItem | (string | ImagePreviewItem)[];
  size?: "micro" | "small" | "medium" | "large";
  onRemove?: (id?: string, index?: number) => void;
  onImageClick?: (image: ImagePreviewItem, index: number) => void;
  showRemoveButton?: boolean;
  className?: string;
  backgroundColor?: string;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  showBorder?: boolean;
  translations?: Partial<ImagePreviewTranslations>; // Opcional - usa sistema i18n automáticamente
}
```

### ImagePreviewTranslations
```typescript
interface ImagePreviewTranslations {
  previewAlt?: string;
  removeButtonAriaLabel?: string;
  emptyStateText?: string;
  clickableImageAriaLabel?: string;
}
```

## ♿ Accesibilidad

- ✅ **ARIA Labels**: Todos los elementos interactivos tienen labels descriptivos
- ✅ **Navegación por teclado**: Tab, Enter, Space completamente funcional
- ✅ **Focus visible**: Estados de foco claramente definidos
- ✅ **Alt text**: Todas las imágenes tienen texto alternativo
- ✅ **Role button**: Imágenes clickeables tienen role apropiado
- ✅ **Contraste**: Cumple WCAG 2.1 AA en light y dark mode

## 🎯 Casos de Uso en BeweOS

### 1. Logo de Empresa (Settings)
```tsx
<ImagePreviewComponent images={logo} size="small" onRemove={handleRemove} />
```

### 2. Galería de Productos
```tsx
<ImagePreviewComponent images={products} size="medium" onRemove={handleDelete} />
```

### 3. Documentos Subidos
```tsx
<ImagePreviewComponent images={docs} size="large" showRemoveButton={false} />
```

### 4. Preview de Campaña con Edición
```tsx
<ImagePreviewComponent 
  images={campaignBanner} 
  size="large" 
  onImageClick={openEditor}
  onRemove={deleteBanner}
/>
```

### 5. Avatares de Equipo
```tsx
<ImagePreviewComponent 
  images={teamAvatars} 
  size="micro" 
  radius="full"
  showRemoveButton={false}
/>
```

## 📚 Referencias

- **Componente base**: [`@beweco/aurora-ui`](https://www.npmjs.com/package/@beweco/aurora-ui) - ImagePreview
- **Documentación completa**: [AuraUI ImagePreview README](../../../../../../auraui/src/components/image-preview/README.md)
- **Storybook**: Ejecutar `bun run storybook` en `/auraui` y navegar a Components > ImagePreview
- **Sistema i18n**: `@tolgee/react`
- **Arquitectura**: Hexagonal (Shared/UI/Components)
- **Proyecto**: BeweOS Management System

## 🔄 Migración desde Código Custom

Si tienes código custom similar al preview de logo, puedes migrarlo fácilmente:

**Antes** (código custom):
```tsx
<div className="relative w-[100px]">
  <img
    src={logo}
    alt="Vista previa del logo"
    className="w-[100px] h-[100px] object-contain rounded-lg bg-white shadow-sm border"
  />
  <IconComponent
    icon="solar:trash-bin-minimalistic-outline"
    className="absolute -top-2 -right-2 p-1 rounded-full bg-danger-500 text-white cursor-pointer"
    onClick={onLogoRemove}
  />
</div>
```

**Después** (usando ImagePreviewComponent):
```tsx
<ImagePreviewComponent
  images={logo}
  size="small"
  onRemove={onLogoRemove}
/>
```

### Beneficios de la Migración
- ✅ **-15 líneas de código**
- ✅ **Traducciones automáticas** del sistema i18n
- ✅ **Accesibilidad completa** incluida
- ✅ **Comportamiento consistente** en toda la aplicación
- ✅ **Mantenimiento centralizado** en AuraUI

## 🔧 Configuración de Traducciones

Para que el componente funcione correctamente, añade estas claves a tus archivos de locales:

### Español (es/common.json)
```json
{
  "image_preview_alt": "Vista previa de imagen",
  "image_preview_remove_aria_label": "Eliminar imagen",
  "image_preview_empty_state": "No hay imágenes para mostrar",
  "image_preview_clickable_aria_label": "Hacer clic para ampliar imagen"
}
```

### Inglés (en/common.json)
```json
{
  "image_preview_alt": "Image preview",
  "image_preview_remove_aria_label": "Remove image",
  "image_preview_empty_state": "No images to display",
  "image_preview_clickable_aria_label": "Click to enlarge image"
}
```

### Portugués (pt/common.json)
```json
{
  "image_preview_alt": "Visualização de imagem",
  "image_preview_remove_aria_label": "Remover imagem",
  "image_preview_empty_state": "Nenhuma imagem para exibir",
  "image_preview_clickable_aria_label": "Clique para ampliar imagem"
}
```

