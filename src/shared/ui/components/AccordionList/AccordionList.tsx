import { AccordionList } from "@beweco/aurora-ui";
import type {
	AccordionContentConfig,
	AccordionHeaderConfig,
	AccordionItemAction,
	AccordionItemMetadata,
	AccordionListProps as AuraAccordionListProps,
	BaseAccordionItem,
	EmptyStateConfig,
	PaginationConfig,
} from "@beweco/aurora-ui";

/**
 * Re-exportar tipos desde @beweco/aurora-ui para facilitar el uso
 */
export type {
	BaseAccordionItem,
	AccordionItemAction,
	AccordionItemMetadata,
	AccordionContentConfig,
	AccordionHeaderConfig,
	PaginationConfig,
	EmptyStateConfig,
};

/**
 * Props para AccordionListComponent - idéntico a AuraAccordionListProps
 */
export type AccordionListComponentProps<
	T extends BaseAccordionItem = BaseAccordionItem,
> = AuraAccordionListProps<T>;

/**
 * AccordionList Component - Wrapper para uso en BeweOSsmbs
 *
 * Este es un wrapper del componente AccordionList de @beweco/aurora-ui que facilita
 * su integración en el proyecto beweossmbs.
 *
 * El componente proporciona una interfaz flexible para mostrar listas de items en dos modos:
 * - **accordion**: Items expandibles con contenido detallado
 * - **list**: Vista de lista plana sin expansión
 *
 * ## 🎯 Características
 *
 * - ✅ Dos modos de visualización: accordion y list
 * - ✅ Header personalizable con title, subtitle y metadata chips
 * - ✅ Contenido expandible (solo en modo accordion)
 * - ✅ Acciones rápidas configurables por item
 * - ✅ Acciones condicionales basadas en propiedades del item
 * - ✅ Paginación integrada opcional
 * - ✅ Estado vacío personalizable
 * - ✅ Estado de carga
 * - ✅ Variantes de accordion: splitted, shadow, bordered, light
 * - ✅ Selección múltiple o individual (solo accordion)
 * - ✅ TypeScript con tipado genérico completo
 * - ✅ Dark mode soportado
 *
 * ## 📦 Casos de Uso
 *
 * ### 1. Contenido Propuesto de Redes Sociales
 * Lista de contenidos generados por AI con opciones de publicar, editar o eliminar.
 *
 * ### 2. Historial de Notas de Clientes
 * Vista de lista plana de notas con timestamps y autores.
 *
 * ### 3. Historial de Comunicaciones
 * Acordeón con emails, llamadas y mensajes agrupados por tipo.
 *
 * ### 4. Contenidos Publicados
 * Lista con paginación de posts publicados en redes sociales.
 *
 * @example
 * // Uso básico en modo accordion
 * <AccordionListComponent
 *   mode="accordion"
 *   items={myItems}
 *   sectionTitle="Mis Items"
 *   showCount
 *   header={{
 *     getTitle: (item) => item.title,
 *     getSubtitle: (item) => item.description,
 *   }}
 *   content={{
 *     render: (item) => <div>{item.details}</div>
 *   }}
 * />
 *
 * @example
 * // Modo list con metadata chips
 * <AccordionListComponent
 *   mode="list"
 *   items={notes}
 *   sectionTitle="Historial de Notas"
 *   sectionIcon="solar:notes-outline"
 *   showCount
 *   header={{
 *     getTitle: (item) => item.title,
 *     getSubtitle: (item) => item.description,
 *     getMetadata: (item) => [
 *       {
 *         key: 'author',
 *         label: item.author,
 *         color: 'primary',
 *         variant: 'flat',
 *       }
 *     ]
 *   }}
 * />
 *
 * @example
 * // Con acciones condicionales
 * <AccordionListComponent
 *   mode="accordion"
 *   items={contents}
 *   sectionTitle="Contenido"
 *   header={{
 *     getTitle: (item) => item.title,
 *   }}
 *   actions={[
 *     {
 *       key: 'edit',
 *       icon: 'solar:pen-outline',
 *       tooltip: 'Editar',
 *       color: 'default',
 *       onPress: (item) => handleEdit(item),
 *       show: (item) => !item.isPublished, // Solo mostrar si no está publicado
 *     },
 *     {
 *       key: 'delete',
 *       icon: 'solar:trash-bin-minimalistic-outline',
 *       tooltip: 'Eliminar',
 *       color: 'danger',
 *       onPress: (item) => handleDelete(item),
 *     },
 *   ]}
 * />
 *
 * @example
 * // Con paginación
 * <AccordionListComponent
 *   mode="list"
 *   items={currentPageItems}
 *   sectionTitle="Historial Paginado"
 *   header={{
 *     getTitle: (item) => item.title,
 *   }}
 *   pagination={{
 *     currentPage: 1,
 *     totalPages: 10,
 *     onPageChange: (page) => fetchPage(page),
 *     showControls: true,
 *     isCompact: true,
 *   }}
 * />
 *
 * @example
 * // Con estado vacío personalizado
 * <AccordionListComponent
 *   mode="accordion"
 *   items={[]}
 *   sectionTitle="Sin Contenido"
 *   header={{
 *     getTitle: (item) => item.title,
 *   }}
 *   emptyState={{
 *     icon: 'solar:inbox-line-bold-duotone',
 *     title: 'No hay contenido disponible',
 *     description: 'Crea tu primer contenido para comenzar',
 *     actionText: 'Crear Contenido',
 *     onAction: () => navigate('/crear'),
 *   }}
 * />
 *
 * @example
 * // Header personalizado con customRender
 * <AccordionListComponent
 *   mode="list"
 *   items={items}
 *   sectionTitle="Items Personalizados"
 *   header={{
 *     customRender: (item) => (
 *       <div className="flex items-center justify-between">
 *         <div>
 *           <p className="font-bold">{item.title}</p>
 *           <p className="text-sm text-default-500">{item.subtitle}</p>
 *         </div>
 *         <Chip size="sm" color="success">Activo</Chip>
 *       </div>
 *     ),
 *   }}
 * />
 *
 * ## 💡 Notas Importantes
 *
 * ### Tipado Genérico
 * El componente acepta un tipo genérico que extiende `BaseAccordionItem`:
 * ```typescript
 * interface MyItem extends BaseAccordionItem {
 *   title: string;
 *   description: string;
 *   customField: string;
 * }
 *
 * <AccordionListComponent<MyItem>
 *   items={myItems}
 *   header={{
 *     getTitle: (item) => item.title, // 'item' tiene tipo MyItem
 *   }}
 * />
 * ```
 *
 * ### Modos de Visualización
 * - **accordion**: Ideal para contenido extenso que necesita detalle
 * - **list**: Ideal para vistas rápidas sin expansión
 *
 * ### Acciones Condicionales
 * Las acciones pueden mostrarse/ocultarse dinámicamente:
 * ```typescript
 * {
 *   key: 'publish',
 *   icon: 'solar:plain-3-bold',
 *   onPress: (item) => publish(item),
 *   show: (item) => item.status === 'draft', // Solo para drafts
 * }
 * ```
 *
 * ### Paginación
 * - La paginación debe manejarse en el componente padre
 * - Solo pasar los items de la página actual
 * - `totalPages` debe calcularse con el total de registros en backend
 *
 * ### Empty State
 * - Soporta icono, título, descripción y acción opcional
 * - Se muestra automáticamente cuando items.length === 0
 *
 * ## 📚 Referencias
 *
 * - **Componente Base**: `@beweco/aurora-ui/AccordionList`
 * - **Documentación AuraUI**: Ver README en auraui/src/components/accordion-list/
 * - **Stories**: Ver auraui/stories/AccordionList.stories.tsx para más ejemplos
 */
export function AccordionListComponent<
	T extends BaseAccordionItem = BaseAccordionItem,
>(props: AccordionListComponentProps<T>) {
	// Simplemente pasar todas las props al componente de AuraUI
	// No necesitamos lógica adicional de i18n porque el componente ya no tiene textos internos
	// Todos los textos vienen de las props (sectionTitle, emptyState, etc.)
	return <AccordionList<T> {...props} />;
}
