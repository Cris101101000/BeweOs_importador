/**
 * EmailTemplateBuilder Types
 * 
 * Tipos e interfaces para el componente EmailTemplateBuilder
 * Un wrapper modal del editor de email de @beweco/email-template-builder
 */

/**
 * Tipo para la configuración del editor de email
 */
export type TEditorConfiguration = Record<string, unknown>;

/**
 * Variable personalizada que puede ser insertada en los templates de email
 */
export interface CustomVariable {
  /** Clave única de la variable (ej: "user_name") */
  key: string;
  /** Nombre visible de la variable (ej: "Nombre del Usuario") */
  name: string;
  /** Descripción de qué representa esta variable */
  description: string;
  /** Valor de ejemplo para preview */
  exampleValue: string;
}

/**
 * Props del componente EmailTemplateBuilder
 */
export interface EmailTemplateBuilderProps {
  // ============================================
  // Modal Control (REQUERIDO)
  // ============================================
  
  /** Controla si el modal está visible */
  isOpen: boolean;
  
  /** Callback cuando se cierra el modal */
  onClose: () => void;
  
  // ============================================
  // Template Configuration (OPCIONAL)
  // ============================================
  
  /** Template inicial para cargar en el editor */
  initialTemplate?: TEditorConfiguration;
  
  /** Variables personalizadas disponibles en el editor */
  variables?: CustomVariable[];
  
  /** Idioma del editor (default: "es") */
  locale?: string;
  
  /** Activar modo oscuro (default: false) */
  darkMode?: boolean;
  
  // ============================================
  // Callbacks (REQUERIDO)
  // ============================================
  
  /** 
   * Callback cuando se guarda el template
   * @param document - Configuración del template generada por el editor
   */
  onSave: (document: TEditorConfiguration) => Promise<void>;
  
  /** 
   * Callback para subir imágenes
   * @param file - Archivo de imagen a subir
   * @returns URL de la imagen subida
   */
  onUploadImage: (file: File) => Promise<string>;
  
  /** 
   * Callback opcional cuando cambia el template
   * @param document - Nueva configuración del template
   */
  onChange?: (document: TEditorConfiguration) => void;
}
