# Guía Rápida de Uso - ImagePreviewComponent

## 🎯 Importación Recomendada

```tsx
import { ImagePreviewComponent } from "@shared/ui/components";
import type { ImagePreviewItem } from "@shared/ui/components";
```

## ⚡ Casos de Uso Comunes

### 1. Logo de Empresa (Settings)

```tsx
// En: src/settings/bussinesConfig/ui/business-information/components/logo-manager/

import { ImagePreviewComponent } from "@shared/ui/components";
import { Card } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";

export const LogoManager = ({ logo, onLogoRemove, isUploading }) => {
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

      {logo && !isUploading && (
        <div className="space-y-4">
          <ImagePreviewComponent
            images={logo}
            size="small"
            onRemove={onLogoRemove}
          />
          <p className="text-tiny text-default-500">
            {t("settings_business_logo_recommended_size_with_weight")}
          </p>
        </div>
      )}
    </Card>
  );
};
```

### 2. Galería de Productos con Modal

```tsx
import { ImagePreviewComponent } from "@shared/ui/components";
import type { ImagePreviewItem } from "@shared/ui/components";
import { Modal, ModalContent, ModalBody, useDisclosure } from "@beweco/aurora-ui";
import { useState } from "react";

export const ProductGallery = ({ products }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState("");
  const [images, setImages] = useState<ImagePreviewItem[]>(products);

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
};
```

### 3. Avatares de Equipo (Sin Eliminar)

```tsx
import { ImagePreviewComponent } from "@shared/ui/components";

export const TeamMembers = ({ members }) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Miembros del Equipo</h3>
      <ImagePreviewComponent
        images={members.map(m => ({
          src: m.avatar,
          alt: m.name,
          id: m.id
        }))}
        size="micro"
        radius="full"
        showRemoveButton={false}
      />
    </div>
  );
};
```

### 4. Documentos con Vista Rápida

```tsx
import { ImagePreviewComponent } from "@shared/ui/components";

export const DocumentViewer = ({ documents }) => {
  const handleViewDocument = (doc: ImagePreviewItem) => {
    // Abrir visor de documentos
    openDocumentViewer(doc.src);
  };

  return (
    <ImagePreviewComponent
      images={documents}
      size="large"
      onImageClick={handleViewDocument}
      showRemoveButton={false}
    />
  );
};
```

### 5. Editor de Imágenes de Campaña

```tsx
import { ImagePreviewComponent } from "@shared/ui/components";

export const CampaignImageEditor = ({ images, onUpdate }) => {
  const handleEdit = (image: ImagePreviewItem) => {
    openImageEditor(image.src, (editedImage) => {
      onUpdate(image.id, editedImage);
    });
  };

  const handleDelete = (id?: string) => {
    if (confirm("¿Eliminar esta imagen?")) {
      onUpdate(id, null);
    }
  };

  return (
    <ImagePreviewComponent
      images={images}
      size="medium"
      onImageClick={handleEdit}
      onRemove={handleDelete}
    />
  );
};
```

## 🌍 Traducciones Automáticas

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

**No necesitas configurar nada** - las traducciones se cargan automáticamente.

## 🎨 Props Principales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `images` | `string \| ImagePreviewItem \| Array` | - | **REQUERIDO** - Imagen(es) a mostrar |
| `size` | `"micro" \| "small" \| "medium" \| "large"` | `"small"` | Tamaño del preview |
| `onRemove` | `(id?, index?) => void` | - | Callback al eliminar |
| `onImageClick` | `(image, index) => void` | - | Callback al hacer clic |
| `showRemoveButton` | `boolean` | `true` | Mostrar botón eliminar |
| `radius` | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"lg"` | Radio de bordes |

## 📊 Tamaños Disponibles

| Size | Dimensiones | Uso Recomendado |
|------|-------------|-----------------|
| `micro` | 48x48px | Avatares pequeños, badges |
| `small` | 100x100px | **Logos, perfiles** (predeterminado) |
| `medium` | 150x150px | Productos, galerías |
| `large` | 200x200px | Banners, destacados |

## ⚠️ Notas Importantes

1. **Traducciones Automáticas**: El wrapper maneja las traducciones automáticamente desde `common.json`
2. **Imágenes Clickeables**: Solo se activa si proporcionas `onImageClick`
3. **Arrays Flexibles**: Acepta strings simples, objetos ImagePreviewItem o arrays mixtos
4. **Dark Mode**: Funciona automáticamente sin configuración adicional
5. **Accesibilidad**: Navegación por teclado incluida (Tab, Enter, Space)

## 🔧 Migración desde Código Custom

Reemplaza bloques de código como este:

```tsx
// ❌ ANTES - Código custom
<div className="relative w-[100px]">
  <img src={logo} alt="Logo" className="w-[100px] h-[100px] ..." />
  <IconComponent icon="trash" onClick={onRemove} />
</div>

// ✅ DESPUÉS - Usando ImagePreviewComponent
<ImagePreviewComponent images={logo} size="small" onRemove={onRemove} />
```

**Beneficios**: -15 líneas, traducciones auto, accesibilidad completa, mantenimiento centralizado.





