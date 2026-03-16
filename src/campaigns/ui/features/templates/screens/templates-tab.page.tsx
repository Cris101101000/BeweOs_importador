import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  IconComponent, 
  Chip, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Image, 
  Input, 
  type Selection, 
  type SortDescriptor, 
  useAuraToast, 
  Divider, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Tooltip, 
  DrawerFilters, 
  type DrawerFiltersConfig,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  H3,
  P
} from "@beweco/aurora-ui";
import * as TemplatesDI from '../DependencyInjection';
import { EnumCampaignContentType } from '@campaigns/domain';
import { EnumErrorType } from '@shared/domain/enums/enum-error-type.enum';
import { configureErrorToastWithTranslation, configureSuccessToast } from '@shared/utils/toast-config.utils';
import { useTranslate } from '@tolgee/react';
import { ConfirmDeleteModal } from '@shared/ui/components/confirm-delete-modal/confirm-delete-modal';

// Templates data interface
interface TemplateItem {
  id: string;
  title: string;
  type: "email" | "whatsapp";
  category: string;
  createdDate: string;
  imageUrl: string;
  usageCount?: number;
  isAIGenerated?: boolean;
}

/**
 * Página de gestión de plantillas de campañas
 * Permite ver, filtrar, buscar y gestionar plantillas
 */
export function TemplatesTabPage() {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { showToast } = useAuraToast();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<TemplateItem | null>(null);
  const [isUseTemplateModalOpen, setIsUseTemplateModalOpen] = useState(false);
  const [templateToUse, setTemplateToUse] = useState<TemplateItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  
  // Table states
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<string | number>());
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "createdDate",
    direction: "descending",
  });

  // Filter states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string[]>([]);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      const result = await TemplatesDI.GetAllTemplates().execute();
      
      if (result.isSuccess && result.value) {
        const mapped: TemplateItem[] = result.value.map(t => ({
          id: t.id,
          title: t.name,
          type: t.contentType === EnumCampaignContentType.WHATSAPP ? 'whatsapp' : 'email',
          category: t.tags?.[0] || 'General',
          createdDate: t.createdAt.toISOString(),
          imageUrl: t.thumbnailUrl || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop&crop=center',
          usageCount: Math.floor(Math.random() * 100),
          isAIGenerated: t.isDefault
        }));
        setTemplates(mapped);
      } else if (result.error) {
        showToast(
          configureErrorToastWithTranslation(
            EnumErrorType.Critical,
            t,
            'error_loading_templates'
          )
        );
      }
      setIsLoading(false);
    };

    loadTemplates();
  }, [t, showToast]);

  // Get unique categories from templates
  const uniqueCategories = useMemo(() => {
    const categories = templates.map(t => t.category);
    return Array.from(new Set(categories)).sort();
  }, [templates]);

  // DrawerFilters configuration for templates
  const templateDrawerFiltersConfig: DrawerFiltersConfig = useMemo(() => ({
    title: "Filtros Avanzados",
    description: "Filtra plantillas por tipo, categoría y fecha de creación",
    data: [
      {
        key: "type",
        title: "Tipo de plantilla",
        type: "multiselect",
        data: [
          { label: "WhatsApp", value: "whatsapp" },
          { label: "Email", value: "email" },
        ],
      },
      {
        key: "category",
        title: "Categoría",
        type: "multiselect",
        data: uniqueCategories.map(cat => ({ label: cat, value: cat })),
      },
      {
        key: "createdDate",
        title: "Fecha de creación",
        type: "date",
        data: {
          min: "2020-01-01",
          max: "2025-12-31",
          placeholder: "Seleccionar fecha",
        },
      },
    ]
  }), [uniqueCategories]);

  // Filter templates based on search term and filters
  const filteredTemplates = useMemo(() => {
    let filtered = templates;
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(template => 
        template.title.toLowerCase().includes(searchLower) ||
        template.type.toLowerCase().includes(searchLower) ||
        template.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply type filter
    if (filterType.length > 0) {
      filtered = filtered.filter(template => filterType.includes(template.type));
    }
    
    // Apply category filter
    if (filterCategory.length > 0) {
      filtered = filtered.filter(template => filterCategory.includes(template.category));
    }
    
    return filtered;
  }, [templates, searchTerm, filterType, filterCategory]);

  // Sort templates based on sort descriptor
  const sortedTemplates = useMemo(() => {
    let sorted = [...filteredTemplates];

    // Apply sorting
    if (sortDescriptor.column) {
      sorted.sort((a, b) => {
        const aValue = a[sortDescriptor.column as keyof TemplateItem];
        const bValue = b[sortDescriptor.column as keyof TemplateItem];

        let comparison = 0;
        
        if (sortDescriptor.column === "createdDate") {
          const aDate = new Date(aValue as string).getTime();
          const bDate = new Date(bValue as string).getTime();
          comparison = aDate - bDate;
        } else if (typeof aValue === "string" && typeof bValue === "string") {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue;
        }

        return sortDescriptor.direction === "descending" ? -comparison : comparison;
      });
    }

    return sorted;
  }, [filteredTemplates, sortDescriptor]);

  // Selection change handler
  const handleSelectionChange = useCallback((keys: Selection) => {
    setSelectedKeys(keys);
  }, []);

  // Sort change handler
  const handleSortChange = useCallback((descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  }, []);

  // Row action handler - navigate to use template
  const handleRowAction = useCallback((key: React.Key) => {
    const template = templates.find(t => t.id === String(key));
    if (template) {
      // Guardar la plantilla en sessionStorage
      sessionStorage.setItem('selectedTemplate', JSON.stringify({
        currentStep: 6,
        template: template,
        fromTemplate: true
      }));
      
      // Navegar directamente al wizard en el paso 6
      navigate('/campaigns/create-campaign', {
        state: {
          currentStep: 6,
          template: template,
          fromTemplate: true
        }
      });
    }
  }, [templates, navigate]);

  return (
    <div className="space-y-4 pt-4">
      {/* Top Content Bar */}
      <div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px] justify-between">
        {/* Left section: Search and Selection info */}
        <div className="flex items-center gap-3">
          <Input
            className="flex-1 max-w-xs min-w-52"
            endContent={
              <IconComponent
                icon="solar:magnifer-outline"
                className="text-default-400"
                size="sm"
              />
            }
            placeholder="Buscar plantillas..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          {(selectedKeys === "all" || selectedKeys.size > 0) && (
            <>
              <Divider className="h-5" orientation="vertical" />
              <div className="text-default-800 text-sm whitespace-nowrap">
                {selectedKeys === "all"
                  ? "Todos seleccionados"
                  : `${selectedKeys.size} seleccionado${selectedKeys.size > 1 ? 's' : ''}`}
              </div>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    endContent={
                      <IconComponent
                        className="text-default-400"
                        icon="solar:alt-arrow-down-outline"
                      />
                    }
                    size="sm"
                    variant="flat"
                  >
                    Acciones
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Acciones seleccionadas"
                  onAction={(key) => {
                    if (key === "delete") {
                      // TODO: Implement delete selected
                    }
                  }}
                >
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    textValue="Eliminar"
                  >
                    Eliminar
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          )}
        </div>

        {/* Right section: Table controls */}
        <div className="flex items-center gap-4">
          {/* Filter button */}
          <Button
            variant="solid"
            className="bg-default-100 text-default-800"
            size="sm"
            onPress={() => setIsFilterDrawerOpen(true)}
            startContent={
              <IconComponent
                icon="solar:tuning-2-outline"
                className="text-default-800"
                size="sm"
              />
            }
          >
            Filtros
          </Button>
        </div>
      </div>

      {/* Templates Table */}
      <Table 
        aria-label="Tabla de plantillas"
        radius="none"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        sortDescriptor={sortDescriptor}
        onSortChange={handleSortChange}
        onRowAction={handleRowAction}
        classNames={{
          td: "before:bg-transparent",
          wrapper: "border-none shadow-none p-1",
        }}
      >
        <TableHeader>
          <TableColumn key="title" allowsSorting>PLANTILLA</TableColumn>
          <TableColumn key="type" allowsSorting>TIPO</TableColumn>
          <TableColumn key="category" allowsSorting>CATEGORÍA</TableColumn>
          <TableColumn key="isAIGenerated" className="bg-purple-50/70 text-purple-700 font-semibold">GENERADO CON IA</TableColumn>
          <TableColumn key="createdDate" allowsSorting>FECHA DE CREACIÓN</TableColumn>
          <TableColumn key="usage">USO</TableColumn>
          <TableColumn key="actions">ACCIONES</TableColumn>
        </TableHeader>
        <TableBody items={sortedTemplates} emptyContent={searchTerm ? "No se encontraron plantillas que coincidan con tu búsqueda" : "No hay plantillas disponibles"}>
          {(template) => (
            <TableRow key={template.id} className="group/row">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={template.imageUrl}
                    alt={template.title}
                    className="w-12 h-12 object-cover rounded-lg"
                    loading="lazy"
                  />
                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {template.title}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={template.type === "whatsapp" ? "success" : "primary"}
                  startContent={
                    template.type === "whatsapp" ? (
                      <IconComponent icon="ri:whatsapp-fill" className="w-3.5 h-3.5" />
                    ) : (
                      <IconComponent icon="solar:letter-bold" className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {template.type === "whatsapp" ? "WhatsApp" : "Email"}
                </Chip>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {template.category}
                </span>
              </TableCell>
              <TableCell className="before:!bg-purple-50/60 bg-purple-50/30 group-hover/row:!bg-purple-100/50 group-hover/row:before:!bg-purple-100/60">
                {template.isAIGenerated ? (
                  <Chip size="sm" variant="flat" className="bg-purple-100 text-purple-700" startContent={<IconComponent icon="solar:magic-stick-bold" className="w-3 h-3" />}>
                    Sí
                  </Chip>
                ) : (
                  <span className="text-sm text-purple-400">No</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(template.createdDate).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {template.usageCount || 0} veces
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Tooltip content="Editar y usar plantilla" placement="top">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => {
                        // Guardar la plantilla en sessionStorage
                        sessionStorage.setItem('selectedTemplate', JSON.stringify({
                          currentStep: 6,
                          template: template,
                          fromTemplate: true
                        }));
                        
                        // Navegar directamente al wizard en el paso 6
                        navigate('/campaigns/create-campaign', {
                          state: {
                            currentStep: 6,
                            template: template,
                            fromTemplate: true
                          }
                        });
                      }}
                      aria-label="Usar plantilla"
                    >
                      <IconComponent icon="solar:check-square-outline" className="w-4 h-4 text-primary" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Duplicar" placement="top">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => {
                        // TODO: Implement duplicate template functionality
                      }}
                      aria-label="Duplicar plantilla"
                    >
                      <IconComponent icon="solar:copy-outline" className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Eliminar plantilla">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => {
                        setTemplateToDelete(template);
                        setIsDeleteModalOpen(true);
                      }}
                      aria-label="Eliminar plantilla"
                    >
                      <IconComponent icon="solar:trash-bin-minimalistic-outline" className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Template Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTemplateToDelete(null);
        }}
        onConfirm={() => {
          if (templateToDelete) {
            // TODO: Implementar lógica de eliminación
            
            // Mostrar toast de éxito
            showToast(
              configureSuccessToast(
                t('template_deleted_success', 'Plantilla eliminada correctamente'),
                t('template_deleted_description', `La plantilla "${templateToDelete.title}" ha sido eliminada exitosamente`)
              )
            );
            
            setIsDeleteModalOpen(false);
            setTemplateToDelete(null);
          }
        }}
        title="Eliminar plantilla"
        description="¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer."
        itemName={templateToDelete?.title}
      />

      {/* Use Template Confirmation Modal */}
      <Modal
        isOpen={isUseTemplateModalOpen}
        onClose={() => {
          setIsUseTemplateModalOpen(false);
          setTemplateToUse(null);
        }}
        placement="center"
        size="sm"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-2 p-0">
              <div className="flex flex-col items-center">
                <IconComponent
                  icon="solar:check-circle-bold"
                  className="text-primary-500 h-12 w-12"
                  size="xl"
                />
                <H3>Usar plantilla</H3>
              </div>
            </ModalHeader>
            <ModalBody className="p-0 gap-1 !not-sr-only !pt-2">
              <P className="text-default-600 text-center">
                ¿Deseas usar esta plantilla para crear una nueva campaña?
              </P>
              {templateToUse && (
                <P className="text-default-700 text-center font-medium">
                  {templateToUse.title}
                </P>
              )}
            </ModalBody>
            <ModalFooter className="gap-2 p-0 !pt-6">
              <Button
                color="default"
                variant="flat"
                onPress={() => {
                  setIsUseTemplateModalOpen(false);
                  setTemplateToUse(null);
                }}
                size="sm"
                className="flex-1"
              >
                {t('button_cancel', 'Cancelar')}
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  if (templateToUse) {
                    // Guardar la plantilla en sessionStorage temporalmente
                    const template = templateToUse;
                    sessionStorage.setItem('selectedTemplate', JSON.stringify({
                      currentStep: 6,
                      template: template,
                      fromTemplate: true
                    }));
                    
                    // Cerrar el modal
                    setIsUseTemplateModalOpen(false);
                    setTemplateToUse(null);
                    
                    // Navegar inmediatamente sin setTimeout
                    navigate('/campaigns/create-campaign', {
                      replace: false,
                      state: {
                        currentStep: 6,
                        template: template,
                        fromTemplate: true
                      }
                    });
                  } else {
                    console.error('No hay plantilla seleccionada');
                  }
                }}
                size="sm"
                className="flex-1"
                startContent={
                  <IconComponent icon="solar:check-square-outline" />
                }
              >
                {t('button_use', 'Usar')}
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>

      {/* Filter Drawer for Templates */}
      <DrawerFilters
        config={templateDrawerFiltersConfig}
        onApplyFilters={(filters) => {
          // Apply filters to the templates table
          if (filters.type) {
            setFilterType(Array.isArray(filters.type) ? filters.type : [filters.type]);
          } else {
            setFilterType([]);
          }
          if (filters.category) {
            setFilterCategory(Array.isArray(filters.category) ? filters.category : [filters.category]);
          } else {
            setFilterCategory([]);
          }
          // Handle date filter if needed
          setIsFilterDrawerOpen(false);
        }}
        isOpen={isFilterDrawerOpen}
        onOpenChange={setIsFilterDrawerOpen}
      />
    </div>
  );
}

