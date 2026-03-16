# ContentPreviewModal - Migración a Shared Components

**Fecha:** 2026-01-09  
**Tipo:** Migración de Feature-Specific a Shared Component

---

## 📋 Resumen

El componente `ContentPreviewModal` ha sido migrado desde `social-networks/ui/_shared/components/` a `shared/ui/components/` debido a que se utiliza en múltiples features del proyecto.

---

## 🎯 Razón de la Migración

**Regla de Arquitectura Violada:**
> Si un componente se usa en más de un feature, **DEBE** estar en `shared/ui/components/`

**Features que usaban el componente:**
1. ✅ `social-networks` - Sugerencias de Linda (proposed content)
2. ✅ `social-networks` - Historial de contenidos (history table)  
3. ✅ `campaigns` - Campañas de WhatsApp

---

## 📦 Ubicaciones

### ❌ Ubicación Anterior
```
src/social-networks/ui/_shared/components/content-preview-modal/
├── content-preview-modal.component.tsx
├── content-preview-modal.types.ts
└── index.ts
```

### ✅ Nueva Ubicación
```
src/shared/ui/components/content-preview-modal/
├── content-preview-modal.component.tsx
├── content-preview-modal.types.ts
└── index.ts
```

---

## 🔄 Cambios en Importaciones

### Antes (❌ Incorrecto)
```typescript
// En social-networks
import { ContentPreviewModal } from '@social-networks/ui/_shared';

// En campaigns (violación de arquitectura)
import { ContentPreviewModal } from '@social-networks/ui/_shared';
```

### Después (✅ Correcto)
```typescript
// En todos los features
import { ContentPreviewModal } from '@shared/ui/components';

// O importación específica
import { ContentPreviewModal } from '@shared/ui/components/content-preview-modal';
```

---

## 📝 Archivos Actualizados

### 1. **Archivos Migrados**
- ✅ `content-preview-modal.component.tsx` → Copiado a shared
- ✅ `content-preview-modal.types.ts` → Copiado a shared
- ✅ `index.ts` → Copiado a shared

### 2. **Exports Actualizados**
- ✅ `shared/ui/components/index.ts` → Añadido export de ContentPreviewModal
- ✅ `social-networks/ui/_shared/index.ts` → Removido export de ContentPreviewModal

### 3. **Importaciones Actualizadas**
- ✅ `social-networks/ui/proposed-content/components/content-carousel/content-carousel.component.tsx`
- ✅ `social-networks/ui/proposed-content/pages/proposed-content-tab.page.tsx`
- ✅ `social-networks/ui/content-history/pages/history-tab.page.tsx`
- ✅ `campaigns/ui/pages/campanas.page.tsx`

### 4. **Archivos Eliminados**
- ✅ `social-networks/ui/_shared/components/content-preview-modal/` → Carpeta completa eliminada

---

## 🔧 API del Componente

### Props Interface

```typescript
export interface ContentPreviewModalProps {
  /** Indica si el modal está abierto */
  isOpen: boolean;
  
  /** Callback para cerrar el modal */
  onClose: () => void;
  
  /** Plataforma de red social */
  platform: SocialPlatform;
  
  /** URL de la imagen del contenido */
  imageUrl: string;
  
  /** Texto del caption/descripción */
  caption: string;
  
  /** Título del contenido (opcional) */
  title?: string;
  
  /** Variante del preview (opcional, por defecto "full") */
  variant?: PreviewVariant;
  
  /** Mostrar header del preview (opcional, por defecto true) */
  showHeader?: boolean;

  /** Contenido adicional para el footer (botones de acción personalizados) */
  footerActions?: ReactNode;

  /** Tamaño del modal (opcional, por defecto "2xl") */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}
```

### Ejemplo de Uso

```typescript
import { ContentPreviewModal } from '@shared/ui/components';
import { Button } from '@beweco/aurora-ui';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ContentPreviewModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      platform="instagram"
      imageUrl="https://example.com/image.jpg"
      caption="Mi contenido de Instagram"
      title="Vista previa"
      footerActions={
        <>
          <Button color="danger" onPress={handleDelete}>
            Eliminar
          </Button>
          <Button color="primary" onPress={handleEdit}>
            Editar
          </Button>
          <Button color="success" onPress={handlePublish}>
            Publicar
          </Button>
        </>
      }
    />
  );
}
```

---

## ⚠️ Breaking Changes para Campaigns

**NOTA IMPORTANTE:** El archivo `campaigns/ui/pages/campanas.page.tsx` tiene **errores de TypeScript** porque usa la API antigua del componente (que estaba en el duplicado eliminado).

### Problema en campanas.page.tsx

```typescript
// ❌ API antigua (ya no existe)
<ContentPreviewModal
  content={selectedItem}           // ❌ Esta prop no existe
  onEdit={(item) => {...}}         // ❌ Esta prop no existe
  onDelete={(item) => {...}}       // ❌ Esta prop no existe
  onPublish={(item) => {...}}      // ❌ Esta prop no existe
/>
```

### Solución Requerida

```typescript
// ✅ API correcta
<ContentPreviewModal
  platform={selectedItem?.platform || 'instagram'}
  imageUrl={selectedItem?.imageUrl || ''}
  caption={selectedItem?.caption || ''}
  title={selectedItem?.title}
  footerActions={
    <>
      <Button color="danger" onPress={() => handleDelete(selectedItem)}>
        Eliminar
      </Button>
      <Button color="primary" onPress={() => handleEdit(selectedItem)}>
        Editar
      </Button>
      <Button color="success" onPress={() => handlePublish(selectedItem)}>
        Publicar
      </Button>
    </>
  }
/>
```

---

## ✅ Verificación de Migración

### Checklist

- [x] Componente copiado a `shared/ui/components/content-preview-modal/`
- [x] Export añadido en `shared/ui/components/index.ts`
- [x] Importaciones actualizadas en social-networks (3 archivos)
- [x] Importaciones actualizadas en campaigns (1 archivo)
- [x] Export removido de `social-networks/ui/_shared/index.ts`
- [x] Carpeta original eliminada de social-networks
- [x] No hay referencias rotas en el proyecto
- [ ] ⚠️ Errores de TypeScript en campanas.page.tsx pendientes de corrección

### Importaciones Verificadas

```bash
# Todas las importaciones ahora apuntan a @shared/ui/components ✅
grep -r "import.*ContentPreviewModal" src/

# Resultado:
src/campaigns/ui/pages/campanas.page.tsx:
  import { SocialMediaCarouselComponent, ContentPreviewModal } from '@shared/ui/components';

src/social-networks/ui/content-history/pages/history-tab.page.tsx:
  import { ContentPreviewModal } from '@shared/ui/components';

src/social-networks/ui/proposed-content/pages/proposed-content-tab.page.tsx:
  import { ContentPreviewModal } from '@shared/ui/components';

src/social-networks/ui/proposed-content/components/content-carousel/content-carousel.component.tsx:
  import { ContentPreviewModal } from '@shared/ui/components';
```

---

## 📊 Beneficios de la Migración

1. ✅ **Cumple con la arquitectura** - Componentes compartidos en `shared/`
2. ✅ **Elimina dependencias circulares** - Campaigns ya no importa desde social-networks
3. ✅ **DRY (Don't Repeat Yourself)** - Una única fuente de verdad
4. ✅ **Mantenibilidad** - Cambios en un solo lugar afectan a todos los features
5. ✅ **Descubribilidad** - Los componentes compartidos están centralizados

---

## 🎯 Próximos Pasos

1. **URGENTE:** Corregir errores de TypeScript en `campaigns/ui/pages/campanas.page.tsx`
2. **Validación:** Ejecutar tests para verificar que no se rompió funcionalidad
3. **Code Review:** Revisar que todas las importaciones estén correctas
4. **Commit:** Hacer commit de los cambios de migración

---

## 📚 Documentación Relacionada

- `src/social-networks/CLEANUP_REPORT.md` - Reporte completo de limpieza del feature
- `src/shared/ui/components/index.ts` - Index de componentes compartidos
- Reglas de arquitectura del proyecto - `.cursor/rules/`

