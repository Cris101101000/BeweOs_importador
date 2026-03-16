# StepContainer

Componente genérico para estructurar los steps de un wizard con una distribución consistente de header, body y footer.

## Características

- ✅ Estructura consistente para todos los steps
- ✅ Header opcional para títulos y descripciones
- ✅ Body flexible con flex-1 para contenido principal
- ✅ Footer opcional para acciones (botones)
- ✅ Clases personalizables para cada sección
- ✅ Dark mode compatible
- ✅ Responsive y centrado

## Instalación

El componente ya está disponible en `@shared/ui/components/StepContainer`.

## Uso Básico

```tsx
import { StepContainer } from "@shared/ui/components/StepContainer";
import { H3 } from "@beweco/aurora-ui";
import { Button } from "@shared/ui/components/Button/Button";

function MyStep() {
  return (
    <StepContainer
      header={
        <div className="text-center">
          <H3>Título del Step</H3>
        </div>
      }
      footer={
        <div className="flex justify-between gap-3">
          <Button onPress={handleBack}>Atrás</Button>
          <Button onPress={handleNext} color="primary">Siguiente</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p>Contenido del step...</p>
      </div>
    </StepContainer>
  );
}
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `header` | `ReactNode` | `undefined` | Contenido del header (títulos, descripciones) |
| `children` | `ReactNode` | **Requerido** | Contenido principal del step |
| `footer` | `ReactNode` | `undefined` | Contenido del footer (botones de acción) |
| `className` | `string` | `""` | Clases adicionales para el contenedor principal |
| `headerClassName` | `string` | `""` | Clases adicionales para el header |
| `bodyClassName` | `string` | `""` | Clases adicionales para el body |
| `footerClassName` | `string` | `""` | Clases adicionales para el footer |

## Ejemplos

### 1. Step con Header y Footer

```tsx
<StepContainer
  header={
    <div className="text-center">
      <H3>Selecciona el formato</H3>
      <p className="text-default-500 mt-2">Elige el tipo de contenido que deseas crear</p>
    </div>
  }
  footer={
    <>
      <Button onPress={handleBack} variant="light">
        Atrás
      </Button>
      <Button onPress={handleNext} color="primary">
        Siguiente
      </Button>
    </>
  }
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Contenido del step */}
  </div>
</StepContainer>
```

### 2. Step Solo con Body (sin Header ni Footer)

```tsx
<StepContainer>
  <div className="space-y-4">
    <h2>Contenido personalizado</h2>
    <p>Este step no tiene header ni footer</p>
  </div>
</StepContainer>
```

### 3. Step con Footer Personalizado (un solo botón)

```tsx
<StepContainer
  header={
    <div className="text-center">
      <H3>Confirmación</H3>
    </div>
  }
  footer={
    <Button onPress={handleFinish} color="primary" className="ml-auto">
      Finalizar
    </Button>
  }
  footerClassName="justify-end"
>
  <div className="text-center">
    <p>¿Estás seguro de continuar?</p>
  </div>
</StepContainer>
```

### 4. Step con Clases Personalizadas

```tsx
<StepContainer
  className="max-w-5xl" // Ancho máximo más grande
  headerClassName="mb-8" // Más margen inferior en el header
  bodyClassName="space-y-8" // Más espacio entre elementos del body
  footerClassName="pt-8" // Más padding superior en el footer
  header={
    <div className="text-center">
      <H3>Step Personalizado</H3>
    </div>
  }
  footer={
    <div className="flex justify-between gap-3 w-full">
      <Button onPress={handleBack}>Atrás</Button>
      <Button onPress={handleNext} color="primary">Siguiente</Button>
    </div>
  }
>
  <div>Contenido con estilos personalizados</div>
</StepContainer>
```

### 5. Step con Grid de Opciones

```tsx
<StepContainer
  header={
    <div className="text-center">
      <H3>Selecciona una opción</H3>
    </div>
  }
  footer={
    <>
      <Button onPress={handleBack} variant="light">
        Atrás
      </Button>
      <Button 
        onPress={handleNext} 
        color="primary"
        isDisabled={!selectedOption}
      >
        Continuar
      </Button>
    </>
  }
>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {options.map((option) => (
      <Card key={option.id} isPressable onPress={() => setSelectedOption(option.id)}>
        <CardBody>
          <h4>{option.name}</h4>
          <p>{option.description}</p>
        </CardBody>
      </Card>
    ))}
  </div>
</StepContainer>
```

### 6. Step con Formulario

```tsx
<StepContainer
  header={
    <div className="text-center">
      <H3>Completa la información</H3>
    </div>
  }
  footer={
    <>
      <Button onPress={handleBack} variant="light">
        Atrás
      </Button>
      <Button 
        onPress={handleSubmit} 
        color="primary"
        isDisabled={!isValid}
      >
        Guardar y continuar
      </Button>
    </>
  }
>
  <form className="space-y-4">
    <Input label="Nombre" value={name} onChange={setName} />
    <Input label="Email" value={email} onChange={setEmail} />
    <Textarea label="Descripción" value={description} onChange={setDescription} />
  </form>
</StepContainer>
```

## Estructura HTML Generada

```html
<div class="flex flex-col min-h-[500px] max-w-3xl mx-auto w-full">
  <!-- Header (opcional) -->
  <div class="mb-6">
    <!-- Contenido del header -->
  </div>

  <!-- Body (siempre presente) -->
  <div class="flex-1 space-y-6">
    <!-- Contenido principal (children) -->
  </div>

  <!-- Footer (opcional) -->
  <div class="flex justify-between items-center gap-3 pt-6 pb-4 border-t border-divider mt-6">
    <!-- Contenido del footer -->
  </div>
</div>
```

## Estilos por Defecto

### Contenedor Principal
- `flex flex-col`: Layout vertical
- `min-h-[500px]`: Altura mínima
- `max-w-3xl`: Ancho máximo (768px)
- `mx-auto w-full`: Centrado horizontal

### Header
- `mb-6`: Margen inferior de 1.5rem

### Body
- `flex-1`: Ocupa todo el espacio disponible
- `space-y-6`: Espacio vertical entre elementos hijos

### Footer
- `flex justify-between items-center`: Layout horizontal con espacio entre elementos
- `gap-3`: Espacio de 0.75rem entre botones
- `pt-6 pb-4`: Padding vertical
- `border-t border-divider`: Borde superior
- `mt-6`: Margen superior

## Buenas Prácticas

### 1. Usar Header para Títulos Centrados
```tsx
<StepContainer
  header={
    <div className="text-center">
      <H3>Título Principal</H3>
      <p className="text-default-500 mt-2">Descripción opcional</p>
    </div>
  }
>
  {/* ... */}
</StepContainer>
```

### 2. Footer con Botones de Navegación
```tsx
<StepContainer
  footer={
    <>
      <Button onPress={handleBack} variant="light">
        {t("button_back")}
      </Button>
      <Button onPress={handleNext} color="primary">
        {t("button_next")}
      </Button>
    </>
  }
>
  {/* ... */}
</StepContainer>
```

### 3. Deshabilitar Botón de Siguiente si no hay Selección
```tsx
const [isValid, setIsValid] = useState(false);

<StepContainer
  footer={
    <>
      <Button onPress={handleBack} variant="light">Atrás</Button>
      <Button 
        onPress={handleNext} 
        color="primary"
        isDisabled={!isValid}
      >
        Siguiente
      </Button>
    </>
  }
>
  {/* ... */}
</StepContainer>
```

### 4. Body con Space-y para Elementos Verticales
```tsx
<StepContainer>
  <div className="space-y-4">
    <div>Elemento 1</div>
    <div>Elemento 2</div>
    <div>Elemento 3</div>
  </div>
</StepContainer>
```

### 5. Grid en el Body para Opciones
```tsx
<StepContainer>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {items.map((item) => (
      <Card key={item.id}>{/* ... */}</Card>
    ))}
  </div>
</StepContainer>
```

## Integración con Wizard

Este componente está diseñado para trabajar perfectamente con el componente `Wizard`:

```tsx
import { Wizard, WizardStep, StepContainer } from "@shared/ui/components";

const steps: WizardStep[] = [
  { number: 1, title: "Formato", isCompleted: false },
  { number: 2, title: "Contenido", isCompleted: false },
  { number: 3, title: "Revisión", isCompleted: false },
];

function MyWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  const renderStepContent = (step: WizardStep) => {
    if (step.number === 1) {
      return (
        <StepContainer
          header={<div className="text-center"><H3>Selecciona el formato</H3></div>}
          footer={
            <Button onPress={() => setCurrentStep(2)} color="primary">
              Siguiente
            </Button>
          }
        >
          <div>Contenido del step 1</div>
        </StepContainer>
      );
    }

    if (step.number === 2) {
      return (
        <StepContainer
          header={<div className="text-center"><H3>Completa el contenido</H3></div>}
          footer={
            <>
              <Button onPress={() => setCurrentStep(1)} variant="light">Atrás</Button>
              <Button onPress={() => setCurrentStep(3)} color="primary">Siguiente</Button>
            </>
          }
        >
          <div>Contenido del step 2</div>
        </StepContainer>
      );
    }

    // ... más steps
  };

  return (
    <Wizard
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      renderStepContent={renderStepContent}
    />
  );
}
```

## Dark Mode

El componente soporta automáticamente el modo oscuro a través de las clases de Tailwind:

- `border-divider`: Se adapta automáticamente al tema
- Los componentes hijos (Button, H3, etc.) también se adaptan

## Accesibilidad

- ✅ Estructura semántica con divs
- ✅ Compatible con lectores de pantalla
- ✅ Los botones en el footer deben tener labels descriptivos
- ✅ El contenido del body debe ser accesible

## Troubleshooting

### El footer no se muestra
**Problema**: El footer no aparece aunque pasaste la prop.  
**Solución**: Asegúrate de pasar un ReactNode válido, no `null` o `undefined`.

```tsx
// ❌ Incorrecto
<StepContainer footer={null}>...</StepContainer>

// ✅ Correcto
<StepContainer footer={<Button>Siguiente</Button>}>...</StepContainer>
```

### El body no ocupa todo el espacio
**Problema**: El body no crece para ocupar el espacio disponible.  
**Solución**: Verifica que no hayas sobrescrito la clase `flex-1` en `bodyClassName`.

```tsx
// ❌ Incorrecto (sobrescribe flex-1)
<StepContainer bodyClassName="flex-none">...</StepContainer>

// ✅ Correcto
<StepContainer bodyClassName="space-y-8">...</StepContainer>
```

### Los botones del footer no tienen espacio entre ellos
**Problema**: Los botones están pegados.  
**Solución**: El componente ya aplica `gap-3`. Si necesitas más espacio, usa `footerClassName`.

```tsx
<StepContainer footerClassName="gap-6">
  <Button>Atrás</Button>
  <Button>Siguiente</Button>
</StepContainer>
```

## Changelog

### v1.0.0 (2025-01-05)
- ✨ Creación inicial del componente
- ✅ Soporte para header, body y footer
- ✅ Clases personalizables para cada sección
- ✅ Dark mode compatible
- ✅ Documentación completa









