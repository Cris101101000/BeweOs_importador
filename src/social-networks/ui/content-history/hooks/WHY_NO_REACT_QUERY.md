# Por qué NO usar React Query en este proyecto

## 🔴 Problema Original

El hook `usePostsHistory` inicialmente usaba `useQuery` de la siguiente manera:

```typescript
import { useQuery } from '@beweco/aurora-ui'; // ❌ INCORRECTO
```

### **Error #1: Import Incorrecto**
`@beweco/aurora-ui` es una **biblioteca de componentes UI** (botones, inputs, tablas, etc.), NO una biblioteca de gestión de datos. `useQuery` NO existe en Aurora UI.

### **Error #2: React Query no está instalado**
`useQuery` es parte de `@tanstack/react-query` (anteriormente `react-query`), que **NO está instalado** en este proyecto.

```bash
# Para instalar React Query (NO RECOMENDADO en este proyecto)
npm install @tanstack/react-query
```

---

## ✅ Solución Implementada

El proyecto usa el patrón **`useState` + `useEffect`**, que es el estándar en todo el codebase.

### **Implementación Actual**

```typescript
import { useState, useEffect, useCallback } from 'react';

export const usePostsHistory = (params?: IGetPostsParams) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isErrorPosts, setIsErrorPosts] = useState(false);
  const [errorPosts, setErrorPosts] = useState<Error | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    setIsErrorPosts(false);
    setErrorPosts(null);

    try {
      const response = await getPostsUseCase(params);
      setPosts(response.items);
      setTotalPosts(response.total);
    } catch (error) {
      setIsErrorPosts(true);
      setErrorPosts(error as Error);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    totalPosts,
    isLoadingPosts,
    isErrorPosts,
    errorPosts,
    refetchPosts: fetchPosts,
    getPostById,
  };
};
```

---

## 🤔 ¿Por qué React Query sería útil? (Contexto educativo)

React Query proporciona funcionalidades avanzadas que **no son necesarias** en este proyecto, pero son útiles en aplicaciones más complejas:

### **1. Cache Automático**
```typescript
// Con React Query
const { data } = useQuery(['posts'], fetchPosts, {
  staleTime: 5 * 60 * 1000, // Cache por 5 minutos
});
// Si vuelves a montar el componente, NO hace otra petición
```

### **2. Deduplicación de Peticiones**
```typescript
// Si 3 componentes piden lo mismo al mismo tiempo
// React Query solo hace 1 petición HTTP
```

### **3. Refetch Automático**
```typescript
// Con React Query
useQuery(['posts'], fetchPosts, {
  refetchOnWindowFocus: true,  // Refresca al volver a la ventana
  refetchInterval: 30000,      // Refresca cada 30 segundos
});
```

### **4. Retry Automático**
```typescript
// Con React Query
useQuery(['posts'], fetchPosts, {
  retry: 3,           // Reintentar 3 veces si falla
  retryDelay: 1000,   // Esperar 1 segundo entre reintentos
});
```

### **5. Mutaciones Optimistas**
```typescript
// Con React Query
const mutation = useMutation(createPost, {
  onMutate: async (newPost) => {
    // Actualizar UI inmediatamente antes de la respuesta
    queryClient.setQueryData(['posts'], (old) => [...old, newPost]);
  },
});
```

### **6. Invalidación de Cache**
```typescript
// Con React Query
const mutation = useMutation(updatePost, {
  onSuccess: () => {
    // Invalida automáticamente las queries relacionadas
    queryClient.invalidateQueries(['posts']);
  },
});
```

---

## 📊 Comparación: useState vs React Query

| Característica | useState + useEffect | React Query |
|----------------|---------------------|-------------|
| **Setup inicial** | ✅ Simple | ⚠️ Requiere configuración |
| **Cache** | ❌ Manual | ✅ Automático |
| **Deduplicación** | ❌ No | ✅ Sí |
| **Retry automático** | ❌ Manual | ✅ Automático |
| **Refetch background** | ❌ Manual | ✅ Automático |
| **DevTools** | ❌ No | ✅ Sí |
| **Bundle size** | ✅ 0 KB | ⚠️ ~13 KB |
| **Curva aprendizaje** | ✅ Fácil | ⚠️ Media |
| **Consistencia proyecto** | ✅ Sí (usado en todo el proyecto) | ❌ No |

---

## 🎯 Por qué NO migrar a React Query en este proyecto

### **1. Consistencia del Codebase**
El proyecto usa `useState` + `useEffect` en todos los módulos:
- `src/smart-tags/ui/hooks/use-smart-tags-hook.ts`
- `src/smart-tags/ui/hooks/use-tag-assignments.hook.ts`
- Muchos otros hooks del proyecto

**Migrar solo un módulo crearía inconsistencia.**

### **2. No hay necesidad real**
Las funcionalidades que React Query proporciona no son críticas para este proyecto:
- El cache manual funciona bien
- No hay múltiples componentes solicitando los mismos datos simultáneamente
- El refetch manual con `refetchPosts()` es suficiente

### **3. Overhead innecesario**
- Añade 13 KB al bundle
- Requiere configurar un `QueryClient` global
- Requiere envolver la app en `QueryClientProvider`
- Equipo necesitaría aprender nuevas APIs

### **4. Complejidad adicional**
```typescript
// Con useState (actual) - Simple
useEffect(() => {
  fetchPosts();
}, [params]);

// Con React Query - Más complejo
const queryClient = new QueryClient();
// ... configuración global ...
useQuery(['posts', params], () => fetchPosts(params), {
  staleTime: 5000,
  cacheTime: 10000,
  refetchOnMount: true,
  // ... más configuración ...
});
```

---

## 🚀 Si en el futuro quieren usar React Query

### **Paso 1: Instalar**
```bash
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools --save-dev
```

### **Paso 2: Configurar Provider**
```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### **Paso 3: Migrar hooks uno por uno**
Empezar con los módulos más críticos y migrar gradualmente.

---

## 📝 Conclusión

**Para este proyecto, `useState` + `useEffect` es la mejor opción porque:**

✅ Es consistente con el resto del codebase  
✅ Es más simple y fácil de entender  
✅ No requiere dependencias adicionales  
✅ Cubre todas las necesidades actuales  
✅ Menor curva de aprendizaje para el equipo  

**React Query sería útil si:**
- ❌ Tuviéramos múltiples componentes solicitando los mismos datos
- ❌ Necesitáramos cache persistente entre navegaciones
- ❌ Requiriéramos mutaciones optimistas complejas
- ❌ Tuviéramos problemas de performance por exceso de peticiones

**Ninguno de estos casos aplica al proyecto actual.**

