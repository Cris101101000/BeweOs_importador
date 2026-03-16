# SocialMediaPreview Component

Componente de vista previa de publicaciones para múltiples plataformas de redes sociales: Instagram, Facebook, TikTok, y Twitter. Diseñado para mostrar una representación realista de cómo se verá el contenido en cada plataforma.

## 📋 Características

- ✅ Soporte para 4 plataformas: Instagram, Facebook, TikTok, Twitter
- ✅ Múltiples variantes: `compact`, `full`, `story`
- ✅ **Soporte para múltiples relaciones de aspecto en Instagram**: `square` (1:1), `portrait` (4:5), `landscape` (1.91:1)
- ✅ Internacionalización completa mediante props `translations`
- ✅ Soporte para modo oscuro
- ✅ Manejo de truncado de texto con "ver más/menos"
- ✅ Avatar personalizable
- ✅ TypeScript con tipado completo
- ✅ Accesibilidad integrada
- ✅ Responsive design

## 🚀 Uso Básico

```tsx
import { SocialMediaPreviewComponent } from "@shared/ui/components/SocialMediaPreview";

function Example() {
  return (
    <SocialMediaPreviewComponent
      platform="instagram"
      imageUrl="/path/to/image.jpg"
      caption="¡Mira nuestro nuevo producto! #awesome"
      variant="full"
      showHeader={true}
    />
  );
}
```

## 🎯 Props

### Props Obligatorias

| Prop | Tipo | Descripción |
|------|------|-------------|
| `platform` | `"instagram" \| "facebook" \| "tiktok" \| "twitter"` | Plataforma de red social a previsualizar |
| `caption` | `string` | Texto del pie de foto/contenido |

### Props Opcionales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `imageUrl` | `string` | `undefined` | URL de la imagen a mostrar |
| `variant` | `"compact" \| "full" \| "story"` | `"full"` | Variante de vista previa |
| `postAspectRatio` | `"square" \| "portrait" \| "landscape"` | `"square"` | Relación de aspecto para posts de Instagram |
| `showHeader` | `boolean` | `true` | Mostrar cabecera con información de usuario |
| `maxCaptionLength` | `number` | `125` | Longitud máxima antes de truncar |
| `onToggleCaption` | `() => void` | `undefined` | Callback para toggle de "ver más/menos" |
| `showFullCaption` | `boolean` | `false` | Estado de caption expandida |
| `username` | `string` | `"tu_negocio"` | Nombre de usuario personalizado |
| `avatarUrl` | `string` | `undefined` | URL del avatar personalizado |
| `translations` | `SocialMediaPreviewTranslations` | `{}` | Traducciones para i18n |
| `className` | `string` | `""` | Clases CSS adicionales |
| `imageProps` | `Omit<ImageProps, "src" \| "alt">` | `{}` | Props para el componente Image |

## 📖 Ejemplos Avanzados

### Instagram Post Completo

```tsx
import { useState } from "react";
import { SocialMediaPreviewComponent } from "@shared/ui/components/SocialMediaPreview";

function InstagramPostExample() {
  const [showFullCaption, setShowFullCaption] = useState(false);
  
  return (
    <div className="max-w-md">
      <SocialMediaPreviewComponent
        platform="instagram"
        imageUrl="/product.jpg"
        caption="¡Nuevo producto disponible! 🎉\n\nDescubre nuestra última colección con descuentos increíbles. #newproduct #sale"
        variant="full"
        showHeader={true}
        username="mi_tienda"
        onToggleCaption={() => setShowFullCaption(!showFullCaption)}
        showFullCaption={showFullCaption}
      />
    </div>
  );
}
```

### Instagram Story

```tsx
function InstagramStoryExample() {
  return (
    <div className="w-72">
      <SocialMediaPreviewComponent
        platform="instagram"
        imageUrl="/story-bg.jpg"
        caption="¡Ofertas especiales hoy!"
        variant="story"
        showHeader={true}
        username="mi_marca"
      />
    </div>
  );
}
```

### Instagram con Diferentes Relaciones de Aspecto

#### Formato Cuadrado (1:1)
Formato clásico de Instagram, perfecto para imágenes cuadradas y composiciones centradas.

```tsx
function InstagramSquareExample() {
  return (
    <SocialMediaPreviewComponent
      platform="instagram"
      imageUrl="/product.jpg"
      caption="Formato cuadrado clásico de Instagram 📸"
      variant="full"
      postAspectRatio="square"
    />
  );
}
```

#### Formato Vertical (4:5)
Formato recomendado actualmente por Instagram, ocupa más espacio en el feed.

```tsx
function InstagramPortraitExample() {
  return (
    <SocialMediaPreviewComponent
      platform="instagram"
      imageUrl="/tall-product.jpg"
      caption="Formato vertical perfecto para productos 📱"
      variant="full"
      postAspectRatio="portrait"
    />
  );
}
```

#### Formato Horizontal (1.91:1)
Ideal para imágenes panorámicas, paisajes y banners horizontales.

```tsx
function InstagramLandscapeExample() {
  return (
    <SocialMediaPreviewComponent
      platform="instagram"
      imageUrl="/landscape-banner.jpg"
      caption="Formato horizontal para imágenes panorámicas 🌄"
      variant="full"
      postAspectRatio="landscape"
    />
  );
}
```

### Facebook Post

```tsx
function FacebookPostExample() {
  return (
    <div className="max-w-lg">
      <SocialMediaPreviewComponent
        platform="facebook"
        imageUrl="/announcement.jpg"
        caption="Estamos emocionados de anunciar nuestra nueva línea de productos. ¡No te lo pierdas!"
        variant="full"
        showHeader={true}
        username="Mi Empresa"
        avatarUrl="/company-logo.png"
      />
    </div>
  );
}
```

### TikTok Video Preview

```tsx
function TikTokExample() {
  return (
    <div className="w-72">
      <SocialMediaPreviewComponent
        platform="tiktok"
        imageUrl="/video-thumbnail.jpg"
        caption="Tutorial rápido de nuestro producto #tutorial #howto"
        variant="full"
        username="mi_canal"
      />
    </div>
  );
}
```

### Twitter Tweet

```tsx
function TwitterExample() {
  return (
    <div className="max-w-xl">
      <SocialMediaPreviewComponent
        platform="twitter"
        imageUrl="/news.jpg"
        caption="Grandes noticias para nuestros clientes: Lanzamos una nueva característica que revolucionará tu experiencia. 🚀 #innovation #tech"
        variant="full"
        showHeader={true}
        username="MiEmpresaTech"
      />
    </div>
  );
}
```

### Variante Compacta para Carrusel

```tsx
function CarouselItemExample() {
  return (
    <div className="w-60">
      <SocialMediaPreviewComponent
        platform="instagram"
        imageUrl="/product-1.jpg"
        caption="Producto destacado de la semana con un precio increíble"
        variant="compact"
        showHeader={true}
        maxCaptionLength={50}
      />
    </div>
  );
}
```

## 🎨 Tipos

### SocialMediaPreviewProps

```typescript
interface SocialMediaPreviewProps {
  platform: SocialPlatform;
  imageUrl?: string;
  caption: string;
  variant?: PreviewVariant;
  postAspectRatio?: PostAspectRatio;
  showHeader?: boolean;
  maxCaptionLength?: number;
  onToggleCaption?: () => void;
  showFullCaption?: boolean;
  username?: string;
  avatarUrl?: string;
  translations?: Partial<SocialMediaPreviewTranslations>;
  className?: string;
  imageProps?: Omit<ImageProps, "src" | "alt">;
}
```

### SocialPlatform

```typescript
type SocialPlatform = "instagram" | "facebook" | "tiktok" | "twitter";
```

### PreviewVariant

```typescript
type PreviewVariant = "compact" | "full" | "story";
```

### PostAspectRatio

```typescript
type PostAspectRatio = "square" | "portrait" | "landscape";
```

**Dimensiones de Instagram:**
- `square`: 1:1 (1080 x 1080px) - Formato clásico cuadrado
- `portrait`: 4:5 (1080 x 1350px) - Formato vertical, recomendado actualmente
- `landscape`: 1.91:1 (1080 x 566px) - Formato horizontal para panorámicas

### SocialMediaPreviewTranslations

```typescript
interface SocialMediaPreviewTranslations {
  username?: string;
  sendMessage?: string;
  viewMore?: string;
  viewLess?: string;
  timeAgo?: string;
  imageAlt?: string;
}
```

## 🌐 Internacionalización

El componente soporta internacionalización completa mediante la prop `translations`. Por defecto, utiliza el sistema de traducciones de BeweOS (`@tolgee/react`).

### Uso con el sistema i18n de BeweOS

```tsx
import { SocialMediaPreviewComponent } from "@shared/ui/components/SocialMediaPreview";

// El componente automáticamente usa las traducciones de @tolgee/react
<SocialMediaPreviewComponent
  platform="instagram"
  imageUrl="/image.jpg"
  caption="Check this out!"
/>
```

### Sobrescribir traducciones específicas

```tsx
import type { SocialMediaPreviewTranslations } from "@shared/ui/components/SocialMediaPreview";

const customTranslations: Partial<SocialMediaPreviewTranslations> = {
  username: "my_custom_business",
  viewMore: "read more",
  viewLess: "show less",
};

<SocialMediaPreviewComponent
  platform="instagram"
  imageUrl="/image.jpg"
  caption="Your caption here"
  translations={customTranslations}
/>
```

### Traducciones por defecto

El componente incluye traducciones por defecto en español desde el sistema de locales de BeweOS:

- `social_preview_username`: "tu_negocio"
- `social_preview_send_message`: "Enviar mensaje"
- `social_preview_view_more`: "ver más"
- `social_preview_view_less`: "ver menos"
- `social_preview_time_ago`: "hace unos momentos"
- `social_preview_image_alt`: "Vista previa de red social"

## 📐 Variantes

### `full` - Vista Completa
Diseñada para modales y wizards. Muestra la preview completa con todos los detalles.

### `compact` - Vista Compacta
Para elementos de carrusel o listas. Muestra una versión comprimida con truncado agresivo.

### `story` - Historia Vertical
Solo para Instagram y Facebook. Formato vertical 9:16 para stories/historias.

## 🎯 Plataformas Soportadas

### Instagram
- **Posts con múltiples relaciones de aspecto:**
  - Cuadrado (1:1) - 1080 x 1080px
  - Vertical (4:5) - 1080 x 1350px
  - Horizontal (1.91:1) - 1080 x 566px
- Story vertical (9:16) - 1080 x 1920px
- Iconos y estilo de Instagram
- Gradiente característico en avatar

### Facebook
- Post estándar con imagen
- Botones de interacción (Me gusta, Comentar, Compartir)
- Estilo de Facebook

### TikTok
- Formato vertical (9:16)
- Sidebar con estadísticas
- Botones de acción característicos
- Diseño de video

### Twitter
- Tweet estándar con imagen
- Estadísticas de interacción
- Verificación de cuenta
- Estilo minimalista de Twitter

## ♿ Accesibilidad

- ✅ Textos alternativos en imágenes
- ✅ Botones con type explícito
- ✅ Contraste adecuado en modo oscuro
- ✅ Navegación por teclado
- ✅ Tamaños de texto legibles

## 🔧 Integración con BeweOS

Este componente es un wrapper del componente base de `@beweco/aurora-ui` que proporciona:

1. **Integración automática con @tolgee/react**: Las traducciones se cargan automáticamente del sistema de locales de BeweOS
2. **Traducciones por defecto**: Fallbacks en español si las traducciones no están disponibles
3. **Uso simplificado**: No es necesario pasar manualmente las traducciones en cada uso

### Arquitectura

```
BeweOS Project
├── @beweco/aurora-ui (librería base)
│   └── SocialMediaPreview (componente base sin dependencias de i18n)
└── src/shared/ui/components/SocialMediaPreview (wrapper BeweOS)
    └── SocialMediaPreviewComponent (con integración @tolgee/react)
```

## 💡 Casos de Uso

1. **Wizard de creación de contenido**: Vista previa antes de publicar
2. **Carrusel de contenido**: Múltiples previews en formato compacto
3. **Editor de publicaciones**: Vista previa en tiempo real
4. **Galería de contenido publicado**: Historial con previews
5. **Propuestas de IA**: Mostrar sugerencias de contenido generado
6. **Planificador de contenido**: Programar publicaciones con preview

## 📐 Guía de Relaciones de Aspecto para Instagram

### ¿Cuándo usar cada formato?

#### Cuadrado (1:1) - `postAspectRatio="square"`
- ✅ Imágenes de productos individuales
- ✅ Fotos de perfil o retratos
- ✅ Composiciones centradas
- ✅ Feed estético uniforme

#### Vertical (4:5) - `postAspectRatio="portrait"`
- ✅ **Recomendado por Instagram** - ocupa más espacio en el feed
- ✅ Retratos de personas
- ✅ Productos completos de cuerpo entero
- ✅ Mayor visibilidad en móviles
- ✅ Infografías verticales

#### Horizontal (1.91:1) - `postAspectRatio="landscape"`
- ✅ Paisajes y panorámicas
- ✅ Banners promocionales
- ✅ Imágenes de eventos
- ✅ Fotos de grupo
- ✅ Contenido cinematográfico

### 🖼️ Comportamiento de Imágenes

El componente está diseñado para **mostrar la imagen completa sin recortes** usando `object-contain`:

- ✅ La imagen se muestra completamente visible
- ✅ Se centra vertical y horizontalmente
- ✅ Los espacios vacíos se rellenan con **fondo negro** (como en Instagram)
- ✅ La relación de aspecto del contenedor se respeta

**Ejemplo:** Si subes una imagen horizontal (16:9) en un post cuadrado (1:1), verás barras negras arriba y abajo, pero la imagen completa será visible.

### Ejemplo de Selección Automática

```tsx
function SmartAspectRatioExample({ imageWidth, imageHeight, imageUrl }: { 
  imageWidth: number; 
  imageHeight: number; 
  imageUrl: string;
}) {
  // Calcular la relación de aspecto de la imagen
  const ratio = imageWidth / imageHeight;
  
  // Determinar el mejor formato
  let aspectRatio: PostAspectRatio;
  if (ratio > 1.5) {
    aspectRatio = "landscape"; // Imagen ancha
  } else if (ratio < 0.9) {
    aspectRatio = "portrait"; // Imagen alta
  } else {
    aspectRatio = "square"; // Imagen cuadrada
  }
  
  return (
    <SocialMediaPreviewComponent
      platform="instagram"
      imageUrl={imageUrl}
      caption="Formato automático basado en dimensiones de imagen"
      postAspectRatio={aspectRatio}
    />
  );
}
```

## ⚠️ Notas Importantes

1. El componente es puramente visual - no realiza publicaciones reales
2. Las estadísticas mostradas son ejemplos estáticos
3. Los botones de interacción no tienen funcionalidad real
4. La variante `story` solo está disponible para Instagram y Facebook
5. El truncado automático solo aplica en variante `compact`
6. **La prop `postAspectRatio` solo afecta a posts de Instagram** (no aplica a stories, ni a otras plataformas)
7. **Manejo de imágenes en posts de Instagram:**
   - Las imágenes se muestran completas sin recortes (`object-contain`)
   - Los espacios vacíos se rellenan con fondo negro
   - La imagen se centra vertical y horizontalmente
   - Esto replica el comportamiento real de Instagram cuando una imagen no coincide exactamente con el formato seleccionado

## 🎨 Personalización

### Estilos Personalizados

```tsx
<SocialMediaPreviewComponent
  platform="instagram"
  imageUrl="/image.jpg"
  caption="Custom styled preview"
  className="border-4 border-blue-500 shadow-2xl"
/>
```

### Props de Imagen

```tsx
<SocialMediaPreviewComponent
  platform="instagram"
  imageUrl="/image.jpg"
  caption="High quality image"
  imageProps={{
    loading: "lazy",
    classNames: {
      wrapper: "custom-wrapper-class"
    }
  }}
/>
```

## 📚 Referencias

- Inspirado en las interfaces reales de Instagram, Facebook, TikTok y Twitter
- Sigue las reglas de diseño BeweOS
- Compatible con todas las reglas del proyecto
- Utiliza componentes de HeroUI como base (Image, Icon)
- Basado en `@beweco/aurora-ui` como librería base

