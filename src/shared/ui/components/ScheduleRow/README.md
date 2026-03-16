# ScheduleRow Component

Componente wrapper de Aurora UI para gestionar horarios de un día con soporte para intervalos de tiempo.

## 📦 Instalación

Este componente es parte de la librería compartida del proyecto y actúa como wrapper del componente `ScheduleRow` de `@beweco/aurora-ui`.

```typescript
import { ScheduleRowComponent } from "@shared/ui/components/ScheduleRow";
import type { DaySchedule, TimeSlot } from "@shared/ui/components/ScheduleRow";
```

## ✨ Características

- ✅ **Máximo 2 intervalos por día**: Restricción del backend para horarios de configuración
- ✅ **Slot vacío automático**: Siempre muestra un slot vacío para facilitar agregar nuevos horarios
- ✅ **Bloqueo automático**: El botón + se deshabilita al alcanzar el límite de 2 slots
- ✅ **Validación en tiempo real**: Valida automáticamente que la hora de inicio sea menor a la hora de fin
- ✅ **Toggle día abierto/cerrado**: Activa o desactiva el día con un simple switch
- ✅ **Copiar a todos**: Replica el horario de un día a todos los demás días
- ✅ **Internacionalización**: Soporte completo para i18n con traducciones personalizables
- ✅ **Dark Mode**: Adaptación automática al modo oscuro
- ✅ **Accesibilidad**: ARIA labels completos para tecnologías asistivas
- ✅ **Diseño responsivo**: Adaptable a todos los tamaños de pantalla

## ⚠️ Restricción Importante del Backend

> **Máximo 2 Intervalos por Día**: El backend tiene una restricción que limita a **2 slots llenos por día** para horarios de configuración. El componente implementa esta restricción deshabilitando automáticamente el botón + cuando se alcanza el límite.
>
> **Casos de uso típicos**:
> - ✅ **Horario continuo**: 09:00 - 17:00 (1 slot)
> - ✅ **Horario partido**: 09:00 - 13:00 y 14:00 - 18:00 (2 slots)
> - ❌ **Tres o más intervalos**: No soportado por el backend

## 🚀 Uso Básico

```typescript
import { useState } from "react";
import { ScheduleRowComponent } from "@shared/ui/components/ScheduleRow";
import type { DaySchedule } from "@shared/ui/components/ScheduleRow";

function MyScheduleForm() {
  const [schedule, setSchedule] = useState<DaySchedule>({
    isOpen: true,
    timeSlots: [
      { from: "09:00", to: "17:00" },
      { from: "", to: "" }  // Slot vacío automático
    ]
  });

  return (
    <ScheduleRowComponent
      day="Lunes"
      daySchedule={schedule}
      onChange={setSchedule}
      onCopyToAll={(day) => console.log('Copiar desde', day)}
    />
  );
}
```

## 📋 Props

### `ScheduleRowComponentProps`

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `day` | `string` | ✅ | - | Nombre del día de la semana a mostrar |
| `daySchedule` | `DaySchedule` | ✅ | - | Configuración del horario para este día |
| `onChange` | `(schedule: DaySchedule) => void` | ✅ | - | Callback ejecutado cuando el horario cambia |
| `onCopyToAll` | `(day: string) => void` | ❌ | - | Callback ejecutado cuando se presiona "Copiar a todos" |
| `translations` | `ScheduleRowTranslations` | ❌ | Español | Traducciones personalizadas |

### `DaySchedule`

```typescript
interface DaySchedule {
  /** Indica si el día está abierto o cerrado */
  isOpen: boolean;
  /** 
   * Lista de intervalos de tiempo
   * - Máximo: 2 slots llenos (restricción del backend)
   * - Siempre incluye un slot vacío al final
   */
  timeSlots: TimeSlot[];
}
```

### `TimeSlot`

```typescript
interface TimeSlot {
  /** Hora de inicio en formato HH:MM (ej: "09:00") */
  from: string;
  /** Hora de fin en formato HH:MM (ej: "17:00") */
  to: string;
  /** Mensaje de error cuando la validación falla (opcional) */
  error?: string;
}
```

### `ScheduleRowTranslations`

```typescript
interface ScheduleRowTranslations {
  from?: string;
  to?: string;
  open?: string;
  closed?: string;
  copyToAll?: string;
  addTimeSlot?: string;
  errorFromAfterTo?: string;
  toggleOpenAriaLabel?: string;
  copyToAllAriaLabel?: string;
  addTimeSlotAriaLabel?: string;
  removeTimeSlotAriaLabel?: string;
}
```

## 💡 Ejemplos de Uso

### Horario Continuo (Un Intervalo)

```typescript
<ScheduleRowComponent
  day="Lunes"
  daySchedule={{
    isOpen: true,
    timeSlots: [
      { from: "09:00", to: "17:00" },
      { from: "", to: "" }
    ]
  }}
  onChange={handleChange}
/>
```

**Resultado**: Lunes de 09:00 a 17:00

---

### Horario Partido (Dos Intervalos)

Útil para negocios con pausa de almuerzo:

```typescript
<ScheduleRowComponent
  day="Martes"
  daySchedule={{
    isOpen: true,
    timeSlots: [
      { from: "09:00", to: "13:00" },
      { from: "14:00", to: "18:00" },
      { from: "", to: "" }
    ]
  }}
  onChange={handleChange}
/>
```

**Resultado**: Martes de 09:00 a 13:00 y de 14:00 a 18:00

---

### Límite Máximo Alcanzado (2 Slots Llenos)

Cuando se alcanza el límite de 2 slots, el botón + se deshabilita automáticamente:

```typescript
<ScheduleRowComponent
  day="Miércoles"
  daySchedule={{
    isOpen: true,
    timeSlots: [
      { from: "08:00", to: "13:00" },
      { from: "14:00", to: "18:00" },
      { from: "", to: "" }  // Slot vacío presente pero botón + deshabilitado
    ]
  }}
  onChange={handleChange}
/>
```

**Nota**: El botón + del slot vacío estará deshabilitado porque ya hay 2 slots llenos (límite del backend). Para agregar un horario diferente, primero debes eliminar uno de los existentes.

---

### Día Cerrado

```typescript
<ScheduleRowComponent
  day="Domingo"
  daySchedule={{
    isOpen: false,
    timeSlots: [{ from: "", to: "" }]
  }}
  onChange={handleChange}
/>
```

**Resultado**: Domingo aparece como "Cerrado" sin mostrar intervalos de tiempo

---

### Con Traducciones en Inglés

```typescript
<ScheduleRowComponent
  day="Monday"
  daySchedule={schedule}
  onChange={handleChange}
  translations={{
    from: "From",
    to: "To",
    open: "Open",
    closed: "Closed",
    copyToAll: "Copy to all",
    addTimeSlot: "Add time slot"
  }}
/>
```

---

### Horario Semanal Completo

```typescript
function WeeklySchedule() {
  const [weekSchedule, setWeekSchedule] = useState({
    monday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }, { from: "", to: "" }] },
    tuesday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }, { from: "", to: "" }] },
    wednesday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }, { from: "", to: "" }] },
    thursday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }, { from: "", to: "" }] },
    friday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }, { from: "", to: "" }] },
    saturday: { isOpen: true, timeSlots: [{ from: "10:00", to: "14:00" }, { from: "", to: "" }] },
    sunday: { isOpen: false, timeSlots: [{ from: "", to: "" }] },
  });

  const handleDayChange = (day: string, newSchedule: DaySchedule) => {
    setWeekSchedule(prev => ({ ...prev, [day]: newSchedule }));
  };

  const handleCopyToAll = (sourceDay: string) => {
    const sourceSchedule = weekSchedule[sourceDay];
    const newSchedule = {};
    Object.keys(weekSchedule).forEach(day => {
      newSchedule[day] = { ...sourceSchedule };
    });
    setWeekSchedule(newSchedule);
  };

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(weekSchedule).map(([day, schedule]) => (
        <ScheduleRowComponent
          key={day}
          day={day}
          daySchedule={schedule}
          onChange={(newSchedule) => handleDayChange(day, newSchedule)}
          onCopyToAll={handleCopyToAll}
        />
      ))}
    </div>
  );
}
```

---

## 🔄 Flujo de Trabajo: Agregar Nuevos Intervalos

El componente utiliza un **slot vacío automático** para facilitar la adición de nuevos intervalos, con un **límite máximo de 2 slots llenos** (restricción del backend):

1. **Estado inicial**: El componente muestra intervalos llenos + un slot vacío al final
2. **Llenar el slot vacío**: El usuario ingresa valores en los campos `from` y `to`
3. **Botón + se habilita**: Una vez que ambos campos están llenos Y hay menos de 2 slots llenos, el botón + se habilita
4. **Agregar segundo slot**: Al hacer clic en +, se agrega un nuevo slot vacío al final
5. **Límite alcanzado**: Una vez que hay 2 slots llenos, el botón + se deshabilita automáticamente
6. **Para modificar**: Si necesitas agregar un horario diferente, primero debes eliminar uno de los slots existentes usando el botón de papelera 🗑️

### Ejemplo Visual

**Paso 1: Estado inicial con 1 slot lleno**
```
┌─────────────────────────────────────────┐
│ Lunes                         [x] Abierto│
├─────────────────────────────────────────┤
│ Desde: 09:00  Hasta: 17:00    [🗑️]      │  ← Slot 1 lleno
│ Desde: ____   Hasta: ____     [+] ⚪    │  ← Slot vacío (+ deshabilitado)
└─────────────────────────────────────────┘
```

**Paso 2: Usuario llena el slot vacío**
```
┌─────────────────────────────────────────┐
│ Lunes                         [x] Abierto│
├─────────────────────────────────────────┤
│ Desde: 09:00  Hasta: 17:00    [🗑️]      │  ← Slot 1 lleno
│ Desde: 14:00  Hasta: 18:00    [+] 🟢    │  ← Slot 2 lleno (+ habilitado)
└─────────────────────────────────────────┘
```

**Paso 3: Usuario hace clic en + → LÍMITE ALCANZADO**
```
┌─────────────────────────────────────────┐
│ Lunes                         [x] Abierto│
├─────────────────────────────────────────┤
│ Desde: 09:00  Hasta: 17:00    [🗑️]      │  ← Slot 1 lleno
│ Desde: 14:00  Hasta: 18:00    [🗑️]      │  ← Slot 2 lleno
│ Desde: ____   Hasta: ____     [+] 🔴    │  ← Slot vacío (+ DESHABILITADO - límite alcanzado)
└─────────────────────────────────────────┘
```

**⚠️ Límite del Backend**: Solo se permiten 2 slots llenos por día. Para agregar un horario diferente, primero elimina uno de los slots existentes con el botón 🗑️.
```

## ✅ Validación

### Validación de Tiempo

El componente valida automáticamente que `from < to`:

```typescript
// ✅ Válido
{ from: "09:00", to: "17:00" }

// ❌ Inválido - Muestra error
{ from: "18:00", to: "09:00", error: "La hora de inicio no puede ser posterior a la hora de fin" }
```

Cuando hay un error de validación:
- El campo muestra un **borde rojo**
- Se muestra el **mensaje de error** debajo del campo
- El mensaje de error se puede personalizar mediante `translations.errorFromAfterTo`

## 🌍 Internacionalización (i18n)

El componente soporta tres niveles de traducciones (en orden de prioridad):

1. **Traducciones personalizadas** (prop `translations`)
2. **Sistema i18n** (usando `@tolgee/react` con claves predefinidas)
3. **Fallback en español** (valores por defecto)

### Claves de Traducción para i18n

Si usas un sistema de i18n como `@tolgee/react`, el componente buscará automáticamente estas claves:

```json
{
  "schedule_from": "Desde",
  "schedule_to": "Hasta",
  "schedule_open": "Abierto",
  "schedule_closed": "Cerrado",
  "button_copy_to_all": "Copiar a todos",
  "schedule_add_time_slot": "Agregar horario",
  "schedule_error_from_after_to": "La hora de inicio no puede ser posterior a la hora de fin",
  "schedule_aria_toggle_open": "Alternar estado de abierto/cerrado",
  "schedule_aria_copy_to_all": "Copiar este horario a todos los días",
  "schedule_aria_add_time_slot": "Agregar un nuevo intervalo de tiempo",
  "schedule_aria_remove_time_slot": "Eliminar este intervalo de tiempo"
}
```

### Ejemplo con i18n

```typescript
import { useTranslate } from "@tolgee/react";

function MyComponent() {
  const { t } = useTranslate();

  return (
    <ScheduleRowComponent
      day={t("day_monday")}
      daySchedule={schedule}
      onChange={handleChange}
      // No es necesario pasar translations, 
      // el componente las obtiene automáticamente del sistema i18n
    />
  );
}
```

## ♿ Accesibilidad

El componente incluye soporte completo de accesibilidad:

- **ARIA Labels**: Todos los controles interactivos tienen etiquetas ARIA descriptivas
- **Navegación por Teclado**: Todos los controles son accesibles mediante teclado
- **Lectores de Pantalla**: Mensajes descriptivos para tecnologías asistivas
- **Asociación de Errores**: Los mensajes de error están asociados correctamente con los campos mediante `aria-describedby`

## 🎨 Personalización

### Modo Oscuro

El componente se adapta automáticamente al modo oscuro sin configuración adicional. Todos los colores, bordes y estados visuales se ajustan automáticamente según el tema activo del sistema.

## 🧪 Testing

### Escenarios de Prueba Recomendados

#### 1. Agregar Segundo Intervalo (Dentro del Límite)
```typescript
test('should add second time slot when + button is clicked', () => {
  const handleChange = jest.fn();
  
  render(
    <ScheduleRowComponent
      day="Monday"
      daySchedule={{
        isOpen: true,
        timeSlots: [
          { from: "09:00", to: "17:00" },  // Slot 1 lleno
          { from: "18:00", to: "20:00" },  // Slot 2 (vacío lleno temporalmente)
          { from: "", to: "" }
        ]
      }}
      onChange={handleChange}
    />
  );
  
  // El botón + debería estar habilitado (solo 1 slot lleno)
  // Al hacer clic, debería agregar el segundo slot
  // ...assertions
});
```

#### 1b. Bloquear Tercer Intervalo (Límite Alcanzado)
```typescript
test('should disable + button when 2 slots are filled', () => {
  const handleChange = jest.fn();
  
  render(
    <ScheduleRowComponent
      day="Monday"
      daySchedule={{
        isOpen: true,
        timeSlots: [
          { from: "09:00", to: "13:00" },  // Slot 1 lleno
          { from: "14:00", to: "18:00" },  // Slot 2 lleno
          { from: "", to: "" }              // Slot vacío
        ]
      }}
      onChange={handleChange}
    />
  );
  
  // El botón + del slot vacío debería estar DESHABILITADO
  // No se debe permitir agregar un tercer slot
  // ...assertions
});
```

#### 2. Validación de Tiempo Inválido
```typescript
test('should show error when from time is after to time', () => {
  const handleChange = jest.fn();
  
  render(
    <ScheduleRowComponent
      day="Monday"
      daySchedule={{
        isOpen: true,
        timeSlots: [
          { from: "18:00", to: "09:00" },
          { from: "", to: "" }
        ]
      }}
      onChange={handleChange}
    />
  );
  
  // Debería mostrar mensaje de error
  // ...assertions
});
```

#### 3. Eliminar Intervalo
```typescript
test('should remove time slot when delete button is clicked', () => {
  const handleChange = jest.fn();
  
  render(
    <ScheduleRowComponent
      day="Monday"
      daySchedule={{
        isOpen: true,
        timeSlots: [
          { from: "09:00", to: "13:00" },
          { from: "14:00", to: "18:00" },
          { from: "", to: "" }
        ]
      }}
      onChange={handleChange}
    />
  );
  
  // Hacer clic en el botón de eliminar del primer slot
  // Verificar que handleChange se llama con el slot eliminado
  // ...assertions
});
```

#### 4. Toggle Estado del Día
```typescript
test('should toggle day open/closed status', () => {
  const handleChange = jest.fn();
  
  render(
    <ScheduleRowComponent
      day="Sunday"
      daySchedule={{
        isOpen: false,
        timeSlots: [{ from: "", to: "" }]
      }}
      onChange={handleChange}
    />
  );
  
  // Hacer clic en el switch
  // Verificar que handleChange se llama con isOpen: true
  // ...assertions
});
```

## 📚 Recursos Adicionales

- **Storybook**: Explora todas las variantes y casos de uso en Storybook
- **Documentación JSDoc**: Revisa la documentación completa en el código fuente
- **Aurora UI**: Consulta la documentación oficial de `@beweco/aurora-ui` para más detalles sobre el componente base

## 🐛 Troubleshooting

### El botón + no se habilita

**Problema**: El botón + permanece deshabilitado después de llenar el slot vacío.

**Soluciones posibles**:
1. Asegúrate de que **ambos campos** (`from` y `to`) tengan valores. El botón solo se habilita cuando el slot está completamente lleno.
2. Verifica que **no haya ya 2 slots llenos**. El backend solo permite máximo 2 intervalos por día. Si ya tienes 2 slots llenos, el botón + permanecerá deshabilitado.

**Ejemplo**:
```typescript
// ❌ Botón + deshabilitado - 2 slots llenos (límite alcanzado)
{
  isOpen: true,
  timeSlots: [
    { from: "09:00", to: "13:00" },  // Slot 1 lleno
    { from: "14:00", to: "18:00" },  // Slot 2 lleno
    { from: "", to: "" }              // Slot vacío - botón + deshabilitado
  ]
}

// ✅ Botón + habilitado - solo 1 slot lleno
{
  isOpen: true,
  timeSlots: [
    { from: "09:00", to: "17:00" },  // Slot 1 lleno
    { from: "14:00", to: "18:00" },  // Slot vacío lleno - botón + habilitado
  ]
}
```

### No puedo agregar más de 2 intervalos

**Problema**: El botón + se deshabilita después de agregar 2 slots y quiero agregar un tercero.

**Solución**: Esta es una **restricción intencional del backend** para horarios de configuración. El sistema solo permite máximo 2 intervalos de tiempo por día. 

**Para agregar un horario diferente**:
1. Elimina uno de los slots existentes usando el botón de papelera 🗑️
2. El botón + del slot vacío se habilitará automáticamente
3. Ahora puedes agregar el nuevo horario

```typescript
// Ejemplo: Quieres cambiar de "09:00-13:00 y 14:00-18:00" a "08:00-12:00 y 14:00-18:00"
// 1. Elimina el primer slot (09:00-13:00)
// 2. El botón + ahora está habilitado
// 3. Agrega el nuevo slot (08:00-12:00)
```

### Los cambios no se reflejan en el componente

**Problema**: El componente no actualiza su estado cuando cambio `daySchedule`.

**Solución**: El componente es **controlado**. Debes actualizar el estado en el callback `onChange`:

```typescript
const [schedule, setSchedule] = useState(initialSchedule);

<ScheduleRowComponent
  daySchedule={schedule}
  onChange={setSchedule}  // ✅ Actualiza el estado
/>
```

### Error de validación no desaparece

**Problema**: El mensaje de error persiste después de corregir los valores.

**Solución**: Asegúrate de que el objeto `schedule` en el callback `onChange` no incluya la propiedad `error` en los slots válidos:

```typescript
const handleChange = (newSchedule: DaySchedule) => {
  // Eliminar errores de slots válidos
  const cleanedSchedule = {
    ...newSchedule,
    timeSlots: newSchedule.timeSlots.map(slot => {
      if (slot.from && slot.to && slot.from < slot.to) {
        const { error, ...rest } = slot;
        return rest;
      }
      return slot;
    })
  };
  setSchedule(cleanedSchedule);
};
```

## 📝 Notas Importantes

- ⚠️ **Límite de 2 Slots**: El backend solo permite máximo 2 intervalos de tiempo por día para horarios de configuración
- ⚠️ **Bloqueo Automático**: Cuando hay 2 slots llenos, el botón + se deshabilita automáticamente
- ⚠️ **Formato de Hora**: Siempre usa formato de 24 horas (`HH:MM`)
- ⚠️ **Slot Vacío Obligatorio**: Siempre incluye un slot vacío al final de `timeSlots`
- ⚠️ **Componente Controlado**: El estado debe gestionarse externamente mediante `onChange`
- ⚠️ **Validación en Tiempo Real**: La validación se ejecuta automáticamente al cambiar los valores
- ⚠️ **Para Modificar Horarios Llenos**: Si necesitas cambiar un horario cuando ya tienes 2 slots llenos, primero elimina uno usando el botón 🗑️

## 📄 Licencia

Este componente es parte del proyecto BeweOS y está sujeto a las mismas condiciones de licencia del proyecto principal.

