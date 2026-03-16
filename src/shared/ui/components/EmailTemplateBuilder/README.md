# EmailTemplateBuilder

Componente modal genérico para crear y editar templates de email. Wrapper del editor visual de `@beweco/email-template-builder`.

## Características

- **Modal Full-Screen**: Se abre como modal sobre la página actual
- **Editor Visual**: Interfaz drag-and-drop intuitiva
- **Variables Personalizadas**: Sistema de variables dinámicas
- **Responsive**: Compatible con todos los clientes de email
- **Reutilizable**: Puede usarse desde cualquier módulo de la aplicación

## Uso Básico

```tsx
import { useState } from "react";
import { EmailTemplateBuilder, type TEditorConfiguration } from "@shared/ui/components";
import { useAuraToast } from "@beweco/aurora-ui";
import { configureSuccessToast } from "@shared/utils/toast-config.utils";

export function MyComponent() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { showToast } = useAuraToast();
  
  const handleSave = async (document: TEditorConfiguration) => {
    try {
      // Guardar template en backend
      await apiClient.post('/templates', document);
      
      showToast(configureSuccessToast("Guardado", "Template guardado exitosamente"));
      setIsEditorOpen(false);
    } catch (error) {
      console.error("Error saving template:", error);
      // Manejar error
    }
  };
  
  const handleUpload = async (file: File): Promise<string> => {
    try {
      // Subir imagen y retornar URL
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  
  return (
    <>
      <Button onPress={() => setIsEditorOpen(true)}>
        Abrir Editor de Email
      </Button>
      
      <EmailTemplateBuilder
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        onUploadImage={handleUpload}
      />
    </>
  );
}
```

## Props

### Requeridas

| Prop | Tipo | Descripción |
|------|------|-------------|
| `isOpen` | `boolean` | Controla si el modal está visible |
| `onClose` | `() => void` | Callback cuando se cierra el modal |
| `onSave` | `(document: TEditorConfiguration) => Promise<void>` | Callback cuando se guarda el template |
| `onUploadImage` | `(file: File) => Promise<string>` | Callback para subir imágenes. Debe retornar la URL de la imagen |

### Opcionales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `initialTemplate` | `TEditorConfiguration` | `undefined` | Template inicial para cargar en el editor |
| `variables` | `CustomVariable[]` | `[]` | Variables personalizadas disponibles en el editor |
| `locale` | `string` | `"es"` | Idioma del editor (`"es"`, `"en"`, etc.) |
| `darkMode` | `boolean` | `false` | Activar modo oscuro |
| `onChange` | `(document: TEditorConfiguration) => void` | `undefined` | Callback opcional cuando cambia el template |

## Variables Personalizadas

Puedes definir variables que los usuarios pueden insertar en los templates:

```tsx
import { useTranslate } from "@tolgee/react";
import type { CustomVariable } from "@shared/ui/components";

const { t } = useTranslate();

const customVariables: CustomVariable[] = [
  {
    key: "user_name",
    name: t("variable_user_name", "Nombre del Usuario"),
    description: t("variable_user_name_desc", "El nombre del destinatario"),
    exampleValue: "Juan Pérez",
  },
  {
    key: "business_name",
    name: t("variable_business_name", "Nombre del Negocio"),
    description: t("variable_business_name_desc", "El nombre de tu negocio"),
    exampleValue: "Mi Negocio",
  },
  {
    key: "discount_code",
    name: t("variable_discount_code", "Código de Descuento"),
    description: t("variable_discount_code_desc", "Código de descuento"),
    exampleValue: "DESCUENTO20",
  },
];

<EmailTemplateBuilder
  isOpen={isOpen}
  onClose={handleClose}
  onSave={handleSave}
  onUploadImage={handleUpload}
  variables={customVariables}
/>
```

## Ejemplo Completo con Manejo de Errores

```tsx
import { useState } from "react";
import { useTranslate } from "@tolgee/react";
import { useAuraToast } from "@beweco/aurora-ui";
import { 
  EmailTemplateBuilder, 
  type TEditorConfiguration,
  type CustomVariable 
} from "@shared/ui/components";
import { 
  configureSuccessToast, 
  configureErrorToastWithTranslation 
} from "@shared/utils/toast-config.utils";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";

export function EmailTemplateManager() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { showToast } = useAuraToast();
  const { t } = useTranslate();
  
  // Variables personalizadas
  const variables: CustomVariable[] = [
    {
      key: "user_name",
      name: t("variable_user_name", "Nombre del Usuario"),
      description: t("variable_user_name_desc", "Nombre del destinatario"),
      exampleValue: "Juan Pérez",
    },
    {
      key: "order_number",
      name: t("variable_order_number", "Número de Orden"),
      description: t("variable_order_number_desc", "Número de orden del cliente"),
      exampleValue: "#12345",
    },
  ];
  
  // Handler para guardar
  const handleSave = async (document: TEditorConfiguration) => {
    try {
      console.log("Saving template:", document);
      
      // TODO: Implementar guardado en backend
      // await templateService.create(document);
      
      showToast(
        configureSuccessToast(
          t("template_save_success", "Plantilla guardada"),
          t("template_save_success_desc", "Tu plantilla ha sido guardada correctamente")
        )
      );
      
      setIsEditorOpen(false);
    } catch (error) {
      console.error("Error saving template:", error);
      showToast(
        configureErrorToastWithTranslation(
          EnumErrorType.Critical,
          t,
          "template_save_error",
          "template_save_error_desc"
        )
      );
    }
  };
  
  // Handler para subir imágenes
  const handleUploadImage = async (file: File): Promise<string> => {
    try {
      console.log("Uploading image:", file.name);
      
      // TODO: Implementar subida real al servidor
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch('/api/upload', { method: 'POST', body: formData });
      // const data = await response.json();
      // return data.url;
      
      // Por ahora, retornar URL temporal
      return URL.createObjectURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast(
        configureErrorToastWithTranslation(
          EnumErrorType.Critical,
          t,
          "image_upload_error",
          "image_upload_error_desc"
        )
      );
      throw error;
    }
  };
  
  return (
    <>
      <Button 
        color="primary" 
        onPress={() => setIsEditorOpen(true)}
        startContent={<IconComponent icon="solar:document-add-bold" />}
      >
        Crear Template de Email
      </Button>
      
      <EmailTemplateBuilder
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        onUploadImage={handleUploadImage}
        variables={variables}
        locale="es"
      />
    </>
  );
}
```

## Integración en Diferentes Módulos

### Campaigns

```tsx
// src/campaigns/ui/pages/create-campaign-wizard.page.tsx
<EmailTemplateBuilder
  isOpen={isTemplateBuilderOpen}
  onClose={() => setIsTemplateBuilderOpen(false)}
  onSave={handleSaveCampaignTemplate}
  onUploadImage={handleUploadImage}
  variables={campaignVariables}
/>
```

### Social Networks

```tsx
// src/social-networks/ui/content-creation/pages/create-content.page.tsx
<EmailTemplateBuilder
  isOpen={isEmailEditorOpen}
  onClose={() => setIsEmailEditorOpen(false)}
  onSave={handleSaveEmailContent}
  onUploadImage={handleUploadImage}
  variables={socialNetworksVariables}
/>
```

## Notas

- El componente utiliza `@beweco/email-template-builder` internamente
- El modal se renderiza full-screen para una mejor experiencia de edición
- El componente padre es responsable de manejar el estado del modal (`isOpen`)
- Todos los callbacks (save, upload, close) deben ser manejados por el componente padre
- La lógica de negocio (guardar en backend, subir imágenes) debe implementarse en cada módulo

## Tipos

```typescript
export type TEditorConfiguration = Record<string, unknown>;

export interface CustomVariable {
  key: string;
  name: string;
  description: string;
  exampleValue: string;
}

export interface EmailTemplateBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplate?: TEditorConfiguration;
  variables?: CustomVariable[];
  locale?: string;
  darkMode?: boolean;
  onSave: (document: TEditorConfiguration) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
  onChange?: (document: TEditorConfiguration) => void;
}
```
