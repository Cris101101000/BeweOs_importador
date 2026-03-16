# ContentCarousel Component

Componente de carousel 3D para mostrar contenido de inspiración en el módulo de Redes Sociales.

## Características

- ✅ **Carousel 3D** con efectos de perspectiva y profundidad
- ✅ **Navegación intuitiva** con botones y click en items
- ✅ **Responsive** y optimizado para todos los dispositivos
- ✅ **Transiciones suaves** con animaciones CSS
- ✅ **Indicadores de posición** con dots navegables
- ✅ **Tailwind CSS** para estilos consistentes con BeweOS
- ✅ **TypeScript** con tipado completo
- ✅ **Accesibilidad** con ARIA labels

## Uso Básico

```tsx
import { ContentCarousel } from '@contenidos-ai/ui/components';
import type { CarouselItem } from '@contenidos-ai/ui/components';

const items: CarouselItem[] = [
  {
    id: 'item-1',
    title: 'Promoción Especial',
    imageUrl: 'https://example.com/image1.jpg',
    gradient: 'linear-gradient(45deg, #2D35EB 0%, #904ED4 100%)',
    type: 'instagram-post'
  },
  // ... más items
];

function MyPage() {
  const handleItemClick = (item: CarouselItem) => {
    console.log('Item clicked:', item);
    // Navegar o abrir modal
  };

  return (
    <ContentCarousel 
      items={items}
      onItemClick={handleItemClick}
      className="py-4"
    />
  );
}
```

## Props

### ContentCarouselProps

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `items` | `CarouselItem[]` | ✅ | Array de items a mostrar en el carousel |
| `onItemClick` | `(item: CarouselItem) => void` | ❌ | Callback cuando se hace click en el item central |
| `className` | `string` | ❌ | Clases CSS adicionales para el contenedor |

### CarouselItem

| Propiedad | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | `string` | ✅ | Identificador único del item |
| `title` | `string` | ✅ | Título del contenido |
| `imageUrl` | `string` | ❌ | URL de la imagen a mostrar |
| `gradient` | `string` | ✅ | Gradiente CSS de fondo (fallback si no hay imagen) |
| `type` | `'instagram-post' \| 'instagram-story' \| 'tiktok-video'` | ✅ | Tipo de contenido |

## Comportamiento

### Navegación

- **Botón Izquierdo**: Navega al item anterior
- **Botón Derecho**: Navega al siguiente item
- **Click en Item Central**: Ejecuta `onItemClick` con el item actual
- **Click en Item Lateral**: Navega hacia ese item (lo centra)
- **Indicadores (dots)**: Click directo para saltar a cualquier item

### Posiciones

El carousel utiliza un sistema de 5 posiciones:

```
[-2]  [-1]  [0]  [1]  [2]
                  ^
               centro
```

- **Posición 0** (centro): Item principal, 100% opacidad, sin blur, escala 1.0
- **Posición ±1** (laterales cercanos): 70% opacidad, blur 1px, escala 0.9
- **Posición ±2** (laterales lejanos): 40% opacidad, blur 3px, escala 0.8

### Efectos Visuales

- **Transform**: Translate X + Scale según posición
- **Opacity**: Disminuye con la distancia del centro
- **Blur**: Aumenta con la distancia (efecto de profundidad)
- **Grayscale**: Ligero desaturado en items no centrales
- **Hover**: Overlay oscuro con icono de ojo en item central

## Ejemplos Avanzados

### Con Imágenes Personalizadas

```tsx
const carouselItems: CarouselItem[] = [
  {
    id: 'promo-1',
    title: 'Black Friday',
    imageUrl: '/assets/black-friday.jpg',
    gradient: 'linear-gradient(45deg, #000 0%, #333 100%)',
    type: 'instagram-post'
  },
  {
    id: 'story-1',
    title: 'Behind the Scenes',
    imageUrl: '/assets/behind-scenes.jpg',
    gradient: 'linear-gradient(45deg, #2D35EB 0%, #22c1c3 100%)',
    type: 'instagram-story'
  }
];
```

### Con Navegación Personalizada

```tsx
const handleCarouselItemClick = (item: CarouselItem) => {
  // Abrir modal de edición
  if (item.type === 'instagram-post') {
    openInstagramPostEditor(item);
  } else if (item.type === 'instagram-story') {
    openStoryEditor(item);
  }
};

<ContentCarousel 
  items={carouselItems}
  onItemClick={handleCarouselItemClick}
/>
```

### Con Estilos Personalizados

```tsx
<ContentCarousel 
  items={carouselItems}
  onItemClick={handleClick}
  className="my-8 px-4 bg-gray-50 rounded-lg"
/>
```

## Estructura de Archivos

```
content-carousel/
├── content-carousel.component.tsx  # Componente principal
├── content-carousel.types.ts       # Tipos TypeScript
├── index.ts                        # Exports públicos
└── README.md                       # Esta documentación
```

## Integración con BeweOS

El componente está totalmente integrado con el sistema de diseño BeweOS:

- ✅ Usa componentes de **@beweco/aurora-ui** (Button, IconComponent)
- ✅ Estilos con **Tailwind CSS**
- ✅ Compatible con **modo oscuro** (`dark:` classes)
- ✅ **Responsive** según breakpoints BeweOS
- ✅ **Accesibilidad** completa con ARIA labels

## Personalización

### Cambiar Gradientes

Modifica el array `gradient` de cada item con gradientes CSS personalizados:

```tsx
{
  id: 'custom',
  title: 'Custom Gradient',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  type: 'instagram-post'
}
```

### Ajustar Animaciones

Las transiciones están definidas en el componente. Para modificarlas, edita:

```tsx
className="... transition-all duration-300 ease-in-out"
```

### Cambiar Iconos de Navegación

Los iconos se pueden cambiar editando las props de `IconComponent`:

```tsx
<IconComponent icon="solar:arrow-left-bold" />  // Cambiar icono
```

## Notas de Implementación

- **Perspectiva 3D**: Usa CSS `perspective: 300px` para el efecto 3D
- **Posicionamiento absoluto**: Todos los items están en posición absoluta dentro del contenedor
- **Circular**: El carousel es circular (el último item conecta con el primero)
- **Lazy render**: Solo renderiza items con posición entre -2 y 2 (optimización)
- **Click inteligente**: Click en laterales navega, click en centro ejecuta acción

## Rendimiento

- ✅ **Lazy rendering** de items fuera del rango visible
- ✅ **Transiciones CSS** (más eficiente que JS)
- ✅ **Optimización de imágenes** con lazy loading
- ✅ **Callbacks memoizados** con `useCallback`

## Compatibilidad

- ✅ React 18+
- ✅ TypeScript 4.9+
- ✅ Tailwind CSS 3.x
- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)

## Mejoras Futuras

- [ ] Soporte para touch/swipe en móviles
- [ ] Auto-play opcional
- [ ] Animaciones personalizables
- [ ] Thumbnails preview
- [ ] Keyboard navigation (arrow keys)

