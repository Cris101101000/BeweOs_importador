import { useState, useCallback, useEffect } from "react";
// @ts-ignore - El paquete tiene problemas con sus tipos, pero la exportación existe
import { EmailEditor } from "@beweco/email-template-builder";
import type { EmailTemplateBuilderProps, TEditorConfiguration } from "./EmailTemplateBuilder.types";

/**
 * EmailTemplateBuilder - Componente Modal
 * 
 * Wrapper modal del editor de email de @beweco/email-template-builder.
 * Proporciona una interfaz genérica y reutilizable para crear templates de email
 * desde cualquier parte de la aplicación.
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <EmailTemplateBuilder
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSave={async (doc) => await saveTemplate(doc)}
 *   onUploadImage={async (file) => await uploadImage(file)}
 *   variables={customVariables}
 * />
 * ```
 */
export function EmailTemplateBuilder({
  isOpen,
  onClose,
  initialTemplate,
  variables = [],
  locale = "es",
  darkMode = false,
  onSave,
  onUploadImage,
  onChange,
}: EmailTemplateBuilderProps) {
  // Estado interno del template siendo editado
  const [template, setTemplate] = useState<TEditorConfiguration | undefined>(initialTemplate);

  // Sincronizar template inicial cuando cambie
  useEffect(() => {
    if (initialTemplate) {
      setTemplate(initialTemplate);
    }
  }, [initialTemplate]);

  /**
   * Maneja el cambio en el template
   */
  const handleChange = useCallback((document: TEditorConfiguration) => {
    setTemplate(document);
    
    // Llamar al callback opcional onChange si existe
    if (onChange) {
      onChange(document);
    }
  }, [onChange]);

  /**
   * Maneja el guardado del template
   */
  const handleSave = useCallback(async (document: TEditorConfiguration) => {
    try {
      await onSave(document);
      // El componente padre decidirá si cerrar el modal o no
    } catch (error) {
      console.error("Error saving template:", error);
      // El error debe ser manejado por el componente padre
      throw error;
    }
  }, [onSave]);

  /**
   * Maneja el cierre del modal
   */
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) {
    return null;
  }

  return (
    <div className="email-template-builder-modal">
      {/* @ts-ignore - EmailEditor component props */}
      <EmailEditor
        open={isOpen}
        onClose={handleClose}
        onSave={handleSave}
        onChange={handleChange}
        onUploadImage={onUploadImage}
        template={template}
        variables={variables}
        locale={locale}
        darkMode={darkMode}
      />
    </div>
  );
}
