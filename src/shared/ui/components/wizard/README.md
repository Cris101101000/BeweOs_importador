# Wizard Component

Componente genérico y reutilizable para crear flujos paso a paso (wizards/steppers) con validaciones, navegación configurable y accesibilidad integrada.

> 📚 **Documentación Externa**: Este README está diseñado para ser importado y consultado desde proyectos externos que consuman la librería @beweco/aurora-ui. Contiene toda la información necesaria para entender y utilizar el componente sin necesidad de revisar el código fuente.

## 📋 Características

- ✅ **Steps configurables** con validaciones personalizadas
- ✅ **Navegación flexible** hacia adelante/atrás configurable
- ✅ **Sidebar opcional** con navegación visual de pasos
- ✅ **Callbacks** para control fino del flujo
- ✅ **Accesibilidad** integrada (ARIA labels, keyboard navigation)
- ✅ **Dark mode** soportado
- ✅ **Responsive** (sidebar oculto en mobile/tablet)
- ✅ **TypeScript** con tipado completo
- ✅ **Loading states** integrados
- ✅ **Bloqueo de pasos** configurable

## 🚀 Uso Básico

```tsx
import { Wizard } from "@beweco/aurora-ui";
import type { WizardStep } from "@beweco/aurora-ui";

function MyWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const steps: WizardStep[] = [
    { number: 1, title: "Formato" },
    { number: 2, title: "Opciones" },
    { number: 3, title: "Publicación" }
  ];

  return (
    <Wizard
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      renderStep={(step) => {
        switch (step.number) {
          case 1:
            return <FormatStep />;
          case 2:
            return <OptionsStep />;
          case 3:
            return <PublicationStep />;
          default:
            return null;
        }
      }}
      onComplete={() => {
        console.log("Wizard completed!");
      }}
    />
  );
}
```

## 🎯 Props del Wizard

### Props Obligatorias

| Prop | Tipo | Descripción |
|------|------|-------------|
| `steps` | `WizardStep[]` | Lista de pasos del wizard |
| `currentStep` | `number` | Paso actual (1-indexed) |
| `onStepChange` | `(step: number) => void` | Callback cuando cambia el paso |
| `renderStep` | `(step: WizardStep, index: number) => ReactNode` | Renderiza el contenido de cada paso |

### Props Opcionales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `navigationConfig` | `WizardNavigationConfig` | `{}` | Configuración de navegación |
| `validations` | `WizardStepValidation[]` | `[]` | Validaciones por paso |
| `onComplete` | `() => void \| Promise<void>` | - | Callback al completar el wizard |
| `onCancel` | `() => void` | - | Callback al cancelar el wizard |
| `onBeforeStepChange` | `(event) => boolean \| Promise<boolean>` | - | Callback antes de cambiar paso (puede cancelar) |
| `onAfterStepChange` | `(event) => void` | - | Callback después de cambiar paso |
| `showSidebar` | `boolean` | `true` | Muestra el sidebar de navegación |
| `sidebarPosition` | `"left" \| "right"` | `"left"` | Posición del sidebar |
| `minHeight` | `string \| number` | `"600px"` | Altura mínima del wizard |
| `className` | `string` | `""` | Clase CSS adicional |
| `isLoading` | `boolean` | `false` | Estado de loading |
| `loadingText` | `string` | `"Procesando..."` | Texto durante loading |
| `isDisabled` | `boolean` | `false` | Deshabilita el wizard |

## 📖 Ejemplos Avanzados

### Con Validaciones

```tsx
<Wizard
  steps={steps}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  renderStep={renderStep}
  validations={[
    {
      stepNumber: 1,
      canProceed: () => selectedFormat !== "",
      errorMessage: "Debes seleccionar un formato"
    },
    {
      stepNumber: 2,
      canProceed: async () => {
        // Validación asíncrona
        const isValid = await validateOptions();
        return isValid;
      }
    }
  ]}
  onComplete={handleComplete}
/>
```

### Con Navegación Personalizada

```tsx
<Wizard
  steps={steps}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  renderStep={renderStep}
  navigationConfig={{
    allowBack: true,
    allowSkipToCompleted: true,
    showNavigationButtons: true,
    nextButtonText: "Continuar",
    backButtonText: "Anterior",
    finishButtonText: "Completar"
  }}
  onComplete={handleComplete}
/>
```

### Con Control de Flujo

```tsx
<Wizard
  steps={steps}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  renderStep={renderStep}
  onBeforeStepChange={async (event) => {
    console.log(`Changing from step ${event.fromStep} to ${event.toStep}`);
    
    // Validar antes de avanzar
    if (event.toStep > event.fromStep) {
      const isValid = await validateCurrentStep(event.fromStep);
      if (!isValid) {
        showToast({ type: "error", message: "Datos inválidos" });
        return false; // Cancela el cambio
      }
    }
    
    return true; // Permite el cambio
  }}
  onAfterStepChange={(event) => {
    console.log(`Changed to step ${event.toStep}`);
    // Analytics, etc.
  }}
  onComplete={handleComplete}
/>
```

### Con Pasos Deshabilitados/Ocultos

```tsx
const steps: WizardStep[] = [
  { number: 1, title: "Formato" },
  { number: 2, title: "Opciones" },
  { 
    number: 3, 
    title: "Configuración Avanzada",
    isDisabled: !isAdvancedUser, // Bloqueado para usuarios normales
  },
  { 
    number: 4, 
    title: "Debug",
    isHidden: !isDevelopment, // Oculto en producción
  },
  { number: 5, title: "Publicación" }
];

<Wizard steps={steps} ... />
```

### Sin Botones de Navegación (Control Manual)

```tsx
function CustomWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div>
      <Wizard
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        renderStep={(step) => (
          <div>
            <StepContent step={step} />
            
            {/* Botones personalizados */}
            <div className="flex justify-between mt-4">
              {step.number > 1 && (
                <Button onPress={() => setCurrentStep(step.number - 1)}>
                  Atrás
                </Button>
              )}
              
              {step.number < steps.length ? (
                <Button onPress={() => setCurrentStep(step.number + 1)}>
                  Siguiente
                </Button>
              ) : (
                <Button onPress={handleComplete}>
                  Finalizar
                </Button>
              )}
            </div>
          </div>
        )}
        navigationConfig={{
          showNavigationButtons: false // Oculta botones por defecto
        }}
      />
    </div>
  );
}
```

### Con Loading State

```tsx
function MyWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      await submitData();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Wizard
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      renderStep={renderStep}
      isLoading={isProcessing}
      loadingText="Guardando datos..."
      onComplete={handleComplete}
    />
  );
}
```

### Sidebar a la Derecha

```tsx
<Wizard
  steps={steps}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  renderStep={renderStep}
  showSidebar={true}
  sidebarPosition="right" // Sidebar a la derecha
  onComplete={handleComplete}
/>
```

### Sin Sidebar (Solo Contenido)

```tsx
<Wizard
  steps={steps}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  renderStep={renderStep}
  showSidebar={false} // Sin sidebar
  onComplete={handleComplete}
/>
```

## 🎨 Tipos

### WizardStep

```typescript
interface WizardStep {
  number: number;           // Número del paso (1-indexed)
  title: string;            // Título mostrado
  icon?: string;            // Icono opcional (solar-icons)
  isDisabled?: boolean;     // Deshabilita el paso
  isHidden?: boolean;       // Oculta el paso
  metadata?: Record<string, unknown>; // Metadata custom
}
```

### WizardStepValidation

```typescript
interface WizardStepValidation {
  stepNumber: number;
  canProceed: () => boolean | Promise<boolean>;
  errorMessage?: string;
}
```

### WizardNavigationConfig

```typescript
interface WizardNavigationConfig {
  allowBack?: boolean;              // Permite ir atrás
  allowSkipToCompleted?: boolean;   // Permite ir a pasos completados
  showNavigationButtons?: boolean;  // Muestra botones de navegación
  nextButtonText?: string;          // Texto botón "Siguiente"
  backButtonText?: string;          // Texto botón "Atrás"
  finishButtonText?: string;        // Texto botón "Finalizar"
  allowClose?: boolean;             // Permite cerrar el wizard
}
```

### WizardStepChangeEvent

```typescript
interface WizardStepChangeEvent {
  fromStep: number;     // Paso anterior
  toStep: number;       // Nuevo paso
  timestamp: Date;      // Timestamp del cambio
}
```

## ♿ Accesibilidad

El componente incluye características de accesibilidad integradas:

- **ARIA labels** para navegación de pasos
- **aria-current="step"** para el paso actual
- **Navegación por teclado** en el sidebar
- **Estados disabled/aria-disabled** apropiados
- **Focus management** automático

## 🎯 Casos de Uso

### Formulario Multi-paso

```tsx
<Wizard
  steps={[
    { number: 1, title: "Datos Personales" },
    { number: 2, title: "Dirección" },
    { number: 3, title: "Confirmación" }
  ]}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  renderStep={(step) => <FormStep step={step} />}
  validations={formValidations}
  onComplete={submitForm}
/>
```

### Proceso de Compra

```tsx
<Wizard
  steps={[
    { number: 1, title: "Carrito" },
    { number: 2, title: "Envío" },
    { number: 3, title: "Pago" },
    { number: 4, title: "Confirmación" }
  ]}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  renderStep={(step) => <CheckoutStep step={step} />}
  navigationConfig={{
    allowBack: true,
    finishButtonText: "Finalizar Compra"
  }}
  onComplete={processPayment}
/>
```

### Configuración de Producto

```tsx
<Wizard
  steps={[
    { number: 1, title: "Tipo de Producto" },
    { number: 2, title: "Características" },
    { number: 3, title: "Precios" },
    { number: 4, title: "Publicar" }
  ]}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  renderStep={(step) => <ProductConfigStep step={step} />}
  validations={productValidations}
  onComplete={publishProduct}
/>
```

## 🔧 Integración con React Hook Form

```tsx
import { useForm } from "react-hook-form";

function WizardWithForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { control, handleSubmit, trigger } = useForm();

  return (
    <Wizard
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      renderStep={(step) => (
        <FormStep step={step} control={control} />
      )}
      validations={[
        {
          stepNumber: 1,
          canProceed: async () => {
            return await trigger(["name", "email"]); // Valida campos
          }
        }
      ]}
      onComplete={handleSubmit(onSubmit)}
    />
  );
}
```

## 📝 Notas

- El `currentStep` es **1-indexed** (comienza en 1, no en 0)
- Las validaciones se ejecutan **antes** de avanzar al siguiente paso
- El sidebar se oculta automáticamente en mobile/tablet (< 1024px)
- Los pasos completados se determinan automáticamente (`step < currentStep`)
- Usa `onBeforeStepChange` para cancelar cambios de paso
- Usa `onAfterStepChange` para analytics o side effects

## 🌐 Internacionalización

El componente Wizard soporta internacionalización completa mediante la prop `translations`, siguiendo el patrón BeweOS sin imponer ningún sistema de i18n específico:

### Uso con la prop `translations`

```tsx
import type { WizardTranslations } from "@beweco/aurora-ui";

const translations: WizardTranslations = {
  nextButton: "Next",
  backButton: "Back",
  finishButton: "Finish",
  loadingText: "Processing...",
  completedLabel: "Completed",
  currentLabel: "Current",
  wizardAriaLabel: "Step-by-step wizard",
  stepNavigationAriaLabel: "Wizard step navigation",
};

<Wizard
  steps={steps}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  renderStep={renderStep}
  translations={translations}
/>
```

### Integración con sistema i18n existente

```tsx
const { t } = useYourI18nSystem();

const wizardTranslations: WizardTranslations = {
  nextButton: t("wizard.next"),
  backButton: t("wizard.back"),
  finishButton: t("wizard.finish"),
  loadingText: t("wizard.loading"),
  completedLabel: t("wizard.completed"),
  currentLabel: t("wizard.current"),
  wizardAriaLabel: t("wizard.ariaLabel"),
  stepNavigationAriaLabel: t("wizard.stepNavigationAriaLabel"),
};

<Wizard
  translations={wizardTranslations}
  ...
/>
```

### Traducciones por defecto (Español)

El componente incluye traducciones por defecto en español. Todas las propiedades de `WizardTranslations` son opcionales, permitiendo sobrescribir solo los textos necesarios:

```tsx
<Wizard
  translations={{
    nextButton: "Continuar",
    finishButton: "Guardar",
    // Resto de textos usarán los valores por defecto en español
  }}
  ...
/>
```

### Backward Compatibility

Por compatibilidad hacia atrás, también puedes usar `navigationConfig`:

```tsx
<Wizard
  navigationConfig={{
    nextButtonText: "Next",
    backButtonText: "Back",
    finishButtonText: "Finish",
  }}
  loadingText="Processing..."
  ...
/>
```

Sin embargo, se recomienda usar la prop `translations` para tener control completo sobre todos los textos del componente.

## 🎨 Personalización de Estilos

El componente usa clases de Tailwind CSS y respeta el dark mode automáticamente. Para personalización adicional, usa la prop `className`:

```tsx
<Wizard
  className="my-custom-wizard"
  minHeight="800px"
  ...
/>
```

## 📖 Storybook

El componente Wizard incluye historias completas en Storybook para explorar todas sus funcionalidades:

### Historias Disponibles

| Historia | Descripción |
|----------|-------------|
| **Default** | Wizard básico con 4 pasos y funcionalidad completa |
| **WithValidations** | Wizard con validaciones obligatorias por paso |
| **SidebarRight** | Wizard con sidebar posicionado a la derecha |
| **WithoutSidebar** | Wizard sin sidebar, maximizando espacio de contenido |
| **CustomNavigation** | Wizard con textos de navegación personalizados |
| **WithTranslationsEnglish** | Wizard completamente traducido al inglés |
| **InteractiveLanguageSwitcher** | Demo interactiva con cambio de idioma (ES/EN/PT) |
| **LoadingState** | Wizard con estado de carga |
| **DisabledState** | Wizard con estado deshabilitado |
| **NoNavigationButtons** | Wizard con navegación personalizada en cada paso |
| **WithMinHeight** | Wizard con altura mínima personalizada |

### Ejecutar Storybook

```bash
npm run storybook
```

Navega a `Custom Components > Wizard` para ver todas las historias y documentación interactiva.

### Ejemplos de Código

Todas las historias incluyen código de ejemplo completo que puedes copiar y adaptar a tus necesidades. Cada historia demuestra un caso de uso específico con comentarios explicativos.

## 📚 Referencias

- Basado en el patrón de wizard de `create-content.page.tsx`
- Usa componentes de `@heroui/react`
- Sigue los principios de Vertical Slice Architecture
- Compatible con todas las reglas del proyecto BeweOS
- Incluye internacionalización completa siguiendo el patrón BeweOS
- Documentación completa en Storybook

