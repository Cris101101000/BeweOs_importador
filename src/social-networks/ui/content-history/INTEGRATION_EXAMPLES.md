# Ejemplos de Integración del Hook usePostsHistory

Este documento contiene ejemplos prácticos de cómo integrar el hook `usePostsHistory` en diferentes escenarios.

## 📋 Tabla de Contenidos

1. [Ejemplo Básico](#ejemplo-básico)
2. [Ejemplo con Paginación](#ejemplo-con-paginación)
3. [Ejemplo con Filtros](#ejemplo-con-filtros)
4. [Ejemplo con Búsqueda](#ejemplo-con-búsqueda)
5. [Ejemplo con Cards](#ejemplo-con-cards)
6. [Ejemplo con Refresh Manual](#ejemplo-con-refresh-manual)
7. [Ejemplo Completo Avanzado](#ejemplo-completo-avanzado)

---

## Ejemplo Básico

Lista simple de posts sin filtros ni paginación.

```typescript
import { usePostsHistory } from '@social-networks/ui/content-history/hooks';

export function SimplePostList() {
  const { posts, isLoadingPosts, isErrorPosts } = usePostsHistory();

  if (isLoadingPosts) return <Spinner />;
  if (isErrorPosts) return <Alert color="danger">Error al cargar posts</Alert>;

  return (
    <div className="grid gap-4">
      {posts.map(post => (
        <div key={post.id} className="p-4 border rounded">
          <h3>{post.name}</h3>
          <p>{post.description}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Ejemplo con Paginación

Implementación de paginación básica.

```typescript
import { useState } from 'react';
import { usePostsHistory } from '@social-networks/ui/content-history/hooks';
import { Pagination } from '@beweco/aurora-ui';

export function PostListWithPagination() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const { 
    posts, 
    totalPosts, 
    isLoadingPosts 
  } = usePostsHistory({
    limit: itemsPerPage,
    offset: (page - 1) * itemsPerPage,
  });

  const totalPages = Math.ceil(totalPosts / itemsPerPage);

  return (
    <div>
      {/* Lista de posts */}
      <div className="grid grid-cols-3 gap-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          total={totalPages}
          onChange={setPage}
          className="mt-6"
        />
      )}

      {/* Info de resultados */}
      <p className="text-sm text-gray-600 mt-4">
        Mostrando {posts.length} de {totalPosts} posts
      </p>
    </div>
  );
}
```

---

## Ejemplo con Filtros

Implementación con múltiples filtros.

```typescript
import { useState } from 'react';
import { usePostsHistory } from '@social-networks/ui/content-history/hooks';
import { EnumPostState, EnumChannel } from '@social-networks/domain';
import { Select, SelectItem } from '@beweco/aurora-ui';

export function PostListWithFilters() {
  const [selectedState, setSelectedState] = useState<EnumPostState>();
  const [selectedChannel, setSelectedChannel] = useState<EnumChannel>();

  const { posts, isLoadingPosts } = usePostsHistory({
    state: selectedState,
    channel: selectedChannel,
  });

  return (
    <div>
      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <Select
          label="Estado"
          placeholder="Todos los estados"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value as EnumPostState)}
        >
          <SelectItem value={EnumPostState.PUBLISHED}>Publicado</SelectItem>
          <SelectItem value={EnumPostState.DRAFT}>Borrador</SelectItem>
          <SelectItem value={EnumPostState.PENDING}>Pendiente</SelectItem>
        </Select>

        <Select
          label="Canal"
          placeholder="Todos los canales"
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value as EnumChannel)}
        >
          <SelectItem value={EnumChannel.INSTAGRAM}>Instagram</SelectItem>
          <SelectItem value={EnumChannel.FACEBOOK}>Facebook</SelectItem>
          <SelectItem value={EnumChannel.TIKTOK}>TikTok</SelectItem>
        </Select>
      </div>

      {/* Lista de posts */}
      {isLoadingPosts ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Ejemplo con Búsqueda

Búsqueda con debounce para optimizar llamadas a la API.

```typescript
import { useState, useEffect } from 'react';
import { usePostsHistory } from '@social-networks/ui/content-history/hooks';
import { Input, IconComponent } from '@beweco/aurora-ui';

export function PostListWithSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { posts, isLoadingPosts, totalPosts } = usePostsHistory({
    search: debouncedSearch || undefined,
  });

  return (
    <div>
      {/* Search input */}
      <Input
        placeholder="Buscar posts..."
        value={searchTerm}
        onValueChange={setSearchTerm}
        startContent={
          <IconComponent icon="solar:magnifer-outline" size="sm" />
        }
        className="mb-6"
      />

      {/* Results info */}
      {debouncedSearch && (
        <p className="text-sm text-gray-600 mb-4">
          {totalPosts} resultado{totalPosts !== 1 ? 's' : ''} para "{debouncedSearch}"
        </p>
      )}

      {/* Lista de posts */}
      {isLoadingPosts ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <EmptyState message="No se encontraron posts" />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Ejemplo con Cards

Implementación con cards visuales de posts.

```typescript
import { usePostsHistory } from '@social-networks/ui/content-history/hooks';
import { Card, CardBody, Image, Chip } from '@beweco/aurora-ui';
import { EnumPostState } from '@social-networks/domain';

export function PostCardsGrid() {
  const { posts, isLoadingPosts } = usePostsHistory({
    state: EnumPostState.PUBLISHED,
    limit: 12,
  });

  const getStateColor = (state: EnumPostState) => {
    return state === EnumPostState.PUBLISHED ? 'success' : 'warning';
  };

  if (isLoadingPosts) return <Spinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {posts.map(post => (
        <Card key={post.id} className="hover:shadow-lg transition-shadow">
          <CardBody className="p-0">
            {/* Imagen del post */}
            <Image
              src={post.imageUrl}
              alt={post.name}
              className="w-full h-48 object-cover"
            />

            {/* Contenido */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                {post.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {post.description}
              </p>

              {/* Metadata */}
              <div className="flex items-center gap-2 flex-wrap">
                <Chip size="sm" color={getStateColor(post.state)}>
                  {post.state}
                </Chip>
                
                <Chip size="sm" variant="flat">
                  {post.channel}
                </Chip>

                {post.aiGenerationType !== 'no' && (
                  <Chip size="sm" className="bg-purple-100 text-purple-700">
                    IA
                  </Chip>
                )}
              </div>

              {/* Fecha */}
              <p className="text-xs text-gray-500 mt-3">
                {new Date(post.date).toLocaleDateString('es-ES')}
              </p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
```

---

## Ejemplo con Refresh Manual

Actualización manual de datos con botón de refresh.

```typescript
import { usePostsHistory } from '@social-networks/ui/content-history/hooks';
import { Button, IconComponent, useAuraToast } from '@beweco/aurora-ui';
import { configureSuccessToast } from '@shared/utils/toast-config.utils';

export function PostListWithRefresh() {
  const { showToast } = useAuraToast();
  const { posts, isLoadingPosts, refetchPosts } = usePostsHistory();

  const handleRefresh = async () => {
    await refetchPosts();
    showToast(
      configureSuccessToast(
        'Posts actualizados',
        'La lista de posts se ha actualizado correctamente'
      )
    );
  };

  return (
    <div>
      {/* Header con botón de refresh */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Posts Recientes</h2>
        
        <Button
          onPress={handleRefresh}
          isLoading={isLoadingPosts}
          startContent={
            <IconComponent icon="solar:refresh-outline" size="sm" />
          }
        >
          Actualizar
        </Button>
      </div>

      {/* Lista de posts */}
      <div className="grid gap-4">
        {posts.map(post => (
          <PostListItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
```

---

## Ejemplo Completo Avanzado

Implementación completa con todas las funcionalidades.

```typescript
import { useState, useEffect, useMemo } from 'react';
import { usePostsHistory } from '@social-networks/ui/content-history/hooks';
import { 
  EnumPostState, 
  EnumChannel, 
  EnumPostType 
} from '@social-networks/domain';
import {
  Input,
  Select,
  SelectItem,
  Pagination,
  Button,
  Spinner,
  IconComponent,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  type SortDescriptor,
} from '@beweco/aurora-ui';

export function AdvancedPostList() {
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterState, setFilterState] = useState<EnumPostState>();
  const [filterChannel, setFilterChannel] = useState<EnumChannel>();
  const [filterPostType, setFilterPostType] = useState<EnumPostType>();

  // Pagination
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'date',
    direction: 'descending',
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Build order parameter
  const orderParam = useMemo(() => {
    if (!sortDescriptor.column) return undefined;
    const prefix = sortDescriptor.direction === 'descending' ? '-' : '';
    return `${prefix}${sortDescriptor.column}`;
  }, [sortDescriptor]);

  // Fetch posts
  const {
    posts,
    totalPosts,
    isLoadingPosts,
    isErrorPosts,
    errorPosts,
    refetchPosts,
  } = usePostsHistory({
    limit: itemsPerPage,
    offset: (page - 1) * itemsPerPage,
    search: debouncedSearch || undefined,
    state: filterState,
    channel: filterChannel,
    postType: filterPostType,
    order: orderParam,
  });

  // Calculate pagination
  const totalPages = Math.ceil(totalPosts / itemsPerPage);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setFilterState(undefined);
    setFilterChannel(undefined);
    setFilterPostType(undefined);
    setPage(1);
  };

  // Check if filters are active
  const hasActiveFilters = 
    debouncedSearch || 
    filterState || 
    filterChannel || 
    filterPostType;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Historial de Posts</h1>
          <p className="text-gray-600 mt-1">
            {totalPosts} post{totalPosts !== 1 ? 's' : ''} en total
          </p>
        </div>
        
        <Button
          onPress={refetchPosts}
          isLoading={isLoadingPosts}
          startContent={<IconComponent icon="solar:refresh-outline" />}
        >
          Actualizar
        </Button>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            placeholder="Buscar posts..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            startContent={
              <IconComponent icon="solar:magnifer-outline" size="sm" />
            }
          />
        </div>

        {/* State Filter */}
        <Select
          placeholder="Estado"
          value={filterState}
          onChange={(e) => {
            setFilterState(e.target.value as EnumPostState);
            setPage(1);
          }}
        >
          <SelectItem value={EnumPostState.PUBLISHED}>Publicado</SelectItem>
          <SelectItem value={EnumPostState.DRAFT}>Borrador</SelectItem>
          <SelectItem value={EnumPostState.PENDING}>Pendiente</SelectItem>
        </Select>

        {/* Channel Filter */}
        <Select
          placeholder="Canal"
          value={filterChannel}
          onChange={(e) => {
            setFilterChannel(e.target.value as EnumChannel);
            setPage(1);
          }}
        >
          <SelectItem value={EnumChannel.INSTAGRAM}>Instagram</SelectItem>
          <SelectItem value={EnumChannel.FACEBOOK}>Facebook</SelectItem>
          <SelectItem value={EnumChannel.TIKTOK}>TikTok</SelectItem>
        </Select>

        {/* Post Type Filter */}
        <Select
          placeholder="Tipo"
          value={filterPostType}
          onChange={(e) => {
            setFilterPostType(e.target.value as EnumPostType);
            setPage(1);
          }}
        >
          <SelectItem value={EnumPostType.POST}>Post</SelectItem>
          <SelectItem value={EnumPostType.STORY}>Story</SelectItem>
          <SelectItem value={EnumPostType.REEL}>Reel</SelectItem>
        </Select>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtros activos:</span>
          
          {debouncedSearch && (
            <Chip onClose={() => setSearchTerm('')} size="sm">
              Búsqueda: {debouncedSearch}
            </Chip>
          )}
          
          {filterState && (
            <Chip onClose={() => setFilterState(undefined)} size="sm">
              Estado: {filterState}
            </Chip>
          )}
          
          {filterChannel && (
            <Chip onClose={() => setFilterChannel(undefined)} size="sm">
              Canal: {filterChannel}
            </Chip>
          )}
          
          {filterPostType && (
            <Chip onClose={() => setFilterPostType(undefined)} size="sm">
              Tipo: {filterPostType}
            </Chip>
          )}
          
          <Button size="sm" variant="light" onPress={handleResetFilters}>
            Limpiar todo
          </Button>
        </div>
      )}

      {/* Error State */}
      {isErrorPosts && (
        <Alert color="danger">
          Error al cargar posts: {errorPosts?.message}
        </Alert>
      )}

      {/* Table */}
      <Table
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader>
          <TableColumn key="name" allowsSorting>NOMBRE</TableColumn>
          <TableColumn key="channel" allowsSorting>CANAL</TableColumn>
          <TableColumn key="postType" allowsSorting>TIPO</TableColumn>
          <TableColumn key="state" allowsSorting>ESTADO</TableColumn>
          <TableColumn key="date" allowsSorting>FECHA</TableColumn>
        </TableHeader>
        
        <TableBody
          items={posts}
          isLoading={isLoadingPosts}
          loadingContent={<Spinner />}
          emptyContent="No se encontraron posts"
        >
          {(post) => (
            <TableRow key={post.id}>
              <TableCell>{post.name}</TableCell>
              <TableCell>{post.channel}</TableCell>
              <TableCell>{post.postType}</TableCell>
              <TableCell>
                <Chip size="sm" color="success">
                  {post.state}
                </Chip>
              </TableCell>
              <TableCell>
                {new Date(post.date).toLocaleDateString('es-ES')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={page}
            total={totalPages}
            onChange={setPage}
            showControls
          />
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Mejores Prácticas

1. **Usar debounce en búsquedas** para evitar llamadas excesivas a la API
2. **Reset page a 1** cuando cambien los filtros
3. **Manejar estados de loading y error** apropiadamente
4. **Usar useMemo** para cálculos derivados como el total de páginas
5. **Usar useCallback** para funciones que se pasan como props
6. **Mostrar feedback visual** cuando se actualicen los datos
7. **Implementar paginación** para grandes volúmenes de datos
8. **Usar enums** en lugar de strings mágicos para filtros

## 📚 Recursos Adicionales

- [Documentación del módulo](../../README.md)
- [React Hooks](https://react.dev/reference/react)
- [Aurora UI Components](https://aurora-ui.beweco.com)

