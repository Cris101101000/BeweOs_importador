# 📅 Módulo de Horarios y Festivos (Schedules & Holidays)

Este módulo gestiona los horarios de atención y días festivos/vacaciones de la empresa siguiendo la **Arquitectura Hexagonal**.

---

## 🔄 Flujo de Datos

### **GET** - Obtener Horarios
```
[Schedules.tsx]
      ↓
[useGetSchedules()] ← Hook con useState/useEffect
      ↓
[GetSchedulesUseCase]
      ↓
[CalendarAdapter]
      ↓
[httpService.get('/companies/schedules')]
      ↓
[API Response]
      ↓
[mapScheduleFromDto()] ← Convierte DTO → Dominio
      ↓
[ScheduleEditor] ← Renderiza datos
```

### **PUT** - Actualizar Horarios
```
[ScheduleEditor]
      ↓
[handleSave()]
      ↓
[useUpdateSchedules]
      ↓
[UpdateSchedulesUseCase]
      ↓
[CalendarAdapter]
      ↓
[mapScheduleToDto()] ← Convierte Dominio → DTO
      ↓
[httpService.put('/companies/schedules')]
      ↓
[API Response]
```

### **GET** - Obtener Holidays
```
[Schedules.tsx]
      ↓
[useGetHolidays()] ← Hook con useState/useEffect
      ↓
[GetHolidaysUseCase]
      ↓
[CalendarAdapter]
      ↓
[httpService.get('/companies/holidays')]
      ↓
[API Response]
      ↓
[mapHolidaysFromDto()] ← Convierte DTO → Dominio
      ↓
[HolidayManager] ← Renderiza datos
```

### **POST** - Crear Holiday
```
[HolidayManager]
      ↓
[handleAddHoliday(holiday)]
      ↓
[useCreateHoliday]
      ↓
[CreateHolidayUseCase]
      ↓
[CalendarAdapter]
      ↓
[mapHolidayToCreateDto()] ← Convierte Dominio → DTO
      ↓
[httpService.post('/companies/holidays')]
      ↓
[API Response]
      ↓
[showToast()] ← Feedback al usuario
      ↓
[refetch()] ← Refresca la lista
```

### **DELETE** - Eliminar Holiday
```
[HolidayManager]
      ↓
[handleDeleteHoliday(holidayId)]
      ↓
[useDeleteHoliday]
      ↓
[DeleteHolidayUseCase]
      ↓
[CalendarAdapter]
      ↓
[httpService.delete('/companies/holidays/:id')]
      ↓
[API Response]
      ↓
[showToast()] ← Feedback al usuario
      ↓
[refetch()] ← Refresca la lista
```

---

## 📁 Estructura de Archivos

```
schedules/
├── application/
│   ├── get-schedules.usecase.ts          # ✅ Caso de uso GET schedules
│   ├── get-holidays.usecase.ts           # ✅ Caso de uso GET holidays
│   ├── update-schedules.usecase.ts       # ✅ Caso de uso PUT schedules
│   ├── update-holidays.usecase.ts        # ✅ Caso de uso PUT holidays
│   ├── create-holiday.usecase.ts         # ✅ Caso de uso POST holiday
│   └── delete-holiday.usecase.ts         # ✅ Caso de uso DELETE holiday
│
├── domain/
│   ├── interfaces/
│   │   └── holiday.interface.ts          # ✅ Interface de holidays
│   └── ports/
│       └── calendar.port.ts              # ✅ Puerto completo (CRUD schedules y holidays)
│
├── infrastructure/
│   ├── adapters/
│   │   └── calendar.adapter.ts           # ✅ Implementación completa (GET, POST, PUT, DELETE)
│   ├── dto/
│   │   ├── get-schedules-response.dto.ts # ✅ DTO para respuesta GET schedules
│   │   ├── get-holidays-response.dto.ts  # ✅ DTO para respuesta GET holidays
│   │   ├── create-holiday.dto.ts         # ✅ DTO para request/response POST holiday
│   │   └── update-calendar.dto.ts        # ✅ DTO para request PUT
│   └── mappers/
│       └── calendar.mapper.ts            # ✅ Conversión bidireccional DTO ↔ Dominio
│
└── ui/
    ├── components/
    │   ├── schedule-editor/
    │   │   └── schedule-editor.component.tsx  # ✅ Formulario de horarios
    │   └── holiday-manager/
    │       └── holiday-manager.component.tsx  # ✅ Gestión completa de festivos (CRUD)
    ├── hooks/
    │   ├── use-get-schedules.hook.ts     # ✅ Hook para GET schedules
    │   ├── use-get-holidays.hook.ts      # ✅ Hook para GET holidays
    │   ├── use-update-schedules.hook.ts  # ✅ Hook para PUT schedules
    │   ├── use-update-holidays.hook.ts   # ✅ Hook para PUT holidays
    │   ├── use-create-holiday.hook.ts    # ✅ Hook para POST holiday
    │   ├── use-delete-holiday.hook.ts    # ✅ Hook para DELETE holiday
    │   ├── use-schedule-manager.hook.ts  # ✅ Gestión del estado local de schedules
    │   └── use-holiday-manager.hook.ts   # ✅ Gestión del estado local de holidays
    └── Shedules.tsx                      # ✅ Componente principal (integra schedules y holidays)
```

---

## 📊 Estructura de Datos API

### **GET** `/companies/schedules` - Respuesta

```typescript
{
  "success": true,
  "message": "companies_list_success",
  "data": [
    {
      "id": "uuid",
      "agencyId": "uuid",
      "companyId": "uuid",
      "day": 1,                    // 0=Domingo, 1=Lunes, ..., 6=Sábado
      "timezone": "America/Bogota",
      "times": [
        {
          "start": "08:00",        // Formato HH:mm
          "end": "12:00",          // Formato HH:mm
          "isEnabled": true        // Por defecto true
        }
      ]
    }
  ],
  "timestamp": "2025-12-15T21:09:38.772Z"
}
```

### **PUT** `/companies/schedules` - Request

```typescript
{
  "schedules": [
    {
      "day": 1,                    // 0=Domingo, 1=Lunes, ..., 6=Sábado
      "timezone": "America/Bogota", // Opcional
      "times": [
        {
          "start": "08:00",        // HH:mm
          "end": "12:00",          // HH:mm
          "isEnabled": true        // Opcional, default true
        }
      ],
      "isEnabled": true            // Opcional, default true
    }
  ]
}
```

### **GET** `/companies/holidays` - Respuesta

```typescript
{
  "success": true,
  "message": "companies_list_success",
  "data": [
    {
      "id": "uuid",
      "agencyId": "uuid",
      "companyId": "uuid",
      "dateRange": {
        "startDate": "2025-07-01T00:00:00.000Z", // ISO 8601
        "endDate": "2025-07-15T00:00:00.000Z"    // ISO 8601, null para días únicos
      },
      "description": "Vacaciones de verano"
    },
    {
      "id": "uuid",
      "agencyId": "uuid",
      "companyId": "uuid",
      "dateRange": {
        "startDate": "2025-12-25T00:00:00.000Z",
        "endDate": null                           // null = día único
      },
      "description": "Navidad"
    }
  ],
  "timestamp": "2025-12-17T21:25:04.086Z"
}
```

### **POST** `/companies/holidays` - Crear Holiday

**Request (Rango de fechas):**
```typescript
{
  "dateRange": {
    "startDate": "2025-07-01",
    "endDate": "2025-07-15"
  },
  "description": "Vacaciones de verano - Temporada alta"
}
```

**Request (Día único):**
```typescript
{
  "dateRange": {
    "startDate": "2025-12-25"
  },
  "description": "Navidad"
}
```

**Response:**
```typescript
{
  "success": true,
  "message": "holiday_created_success",
  "data": {
    "id": "d4bd5976-1937-4772-8071-0cbab1b4854d",
    "agencyId": "uuid",
    "companyId": "uuid",
    "dateRange": {
      "startDate": "2025-12-25",
      "endDate": null
    },
    "description": "Navidad"
  },
  "timestamp": "2025-12-17T22:00:00.086Z"
}
```

### **DELETE** `/companies/holidays/:id` - Eliminar Holiday

```typescript
// Request: DELETE /companies/holidays/d4bd5976-1937-4772-8071-0cbab1b4854d

// Response
{
  "success": true,
  "message": "holiday_deleted_success",
  "timestamp": "2025-12-17T22:00:00.086Z"
}
```

---

## 🔄 Mapeo de Días

```typescript
// Nombre → Número (para UPDATE)
{
  "sunday": 0,
  "monday": 1,
  "tuesday": 2,
  "wednesday": 3,
  "thursday": 4,
  "friday": 5,
  "saturday": 6
}

// Número → Nombre (para GET)
{
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday"
}
```

---

## 💾 Gestión de Timezone

El adapter mantiene un **caché del timezone** obtenido en el GET para usarlo en el PUT:

```typescript
class CalendarAdapter {
  private cachedTimezone: string | null = null;

  async getSchedules() {
    // ... fetch data
    this.cachedTimezone = response.data[0].timezone; // Guardar timezone
    // ...
  }

  async updateCalendar(data) {
    const timezone = this.cachedTimezone || "America/Bogota"; // Usar timezone guardado
    requestDto.schedules = mapScheduleToDto(data.schedules, timezone);
    // ...
  }
}
```

---

## 🎯 Uso en Componentes

### **Obtener Horarios**

```typescript
import { useGetSchedules } from "@settings/schedules/ui/hooks/use-get-schedules.hook";

const MyComponent = () => {
  const { schedules, timezone, isLoading, error, refetch } = useGetSchedules();

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Timezone: {timezone}</p>
      <ScheduleEditor schedule={schedules} timezone={timezone} onSaveSuccess={refetch} />
    </div>
  );
};
```

### **Obtener Holidays**

```typescript
import { useGetHolidays } from "@settings/schedules/ui/hooks/use-get-holidays.hook";

const MyComponent = () => {
  const { holidays, isLoading, error, refetch } = useGetHolidays();

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <HolidayManager initialHolidays={holidays} onSaveSuccess={refetch} />
    </div>
  );
};
```

### **Actualizar Horarios**

```typescript
import { useUpdateSchedules } from "@settings/schedules/ui/hooks/use-update-schedules.hook";

const MyComponent = () => {
  const { updateSchedules, isLoading } = useUpdateSchedules();

  const handleSave = async () => {
    const success = await updateSchedules(scheduleData, timezone);
    if (success) {
      console.log("Horarios actualizados exitosamente");
    }
  };

  return (
    <button onClick={handleSave} disabled={isLoading}>
      {isLoading ? "Guardando..." : "Guardar"}
    </button>
  );
};
```

### **Actualizar Holidays**

```typescript
import { useUpdateHolidays } from "@settings/schedules/ui/hooks/use-update-holidays.hook";

const MyComponent = () => {
  const { updateHolidays, isLoading } = useUpdateHolidays();

  const handleSave = async () => {
    const success = await updateHolidays(agencyId, holidaysData);
    if (success) {
      console.log("Holidays actualizados exitosamente");
    }
  };

  return (
    <button onClick={handleSave} disabled={isLoading}>
      {isLoading ? "Guardando..." : "Guardar"}
    </button>
  );
};
```

### **Eliminar Holiday**

```typescript
import { useDeleteHoliday } from "@settings/schedules/ui/hooks/use-delete-holiday.hook";
import { useAuraToast } from "@beweco/aurora-ui";

const MyComponent = () => {
  const { deleteHoliday, isLoading } = useDeleteHoliday();
  const { showToast } = useAuraToast();

  const handleDelete = async (holidayId: string) => {
    const success = await deleteHoliday(holidayId);
    if (success) {
      showToast({
        type: "success",
        title: "Holiday eliminado",
        message: "El festivo se ha eliminado correctamente."
      });
    }
  };

  return (
    <button onClick={() => handleDelete(holidayId)} disabled={isLoading}>
      {isLoading ? "Eliminando..." : "Eliminar"}
    </button>
  );
};
```

---

## ✅ Checklist de Implementación

### **Schedules (Horarios)**
- [x] **GET /companies/schedules** - Obtener horarios
- [x] **DTO de respuesta GET** - Interfaces que coinciden con la API
- [x] **Mapper GET** - Convierte array de ScheduleItemDto a ISchedule
- [x] **UseCase GET** - GetSchedulesUseCase
- [x] **Hook GET** - useGetSchedules con useState/useEffect
- [x] **Componente ScheduleEditor** - Formulario de horarios
- [x] **PUT /companies/schedules** - Actualizar horarios
- [x] **DTO de request PUT** - UpdateScheduleDto con estructura correcta
- [x] **Mapper PUT** - Convierte ISchedule a array de UpdateScheduleDto
- [x] **Caché de timezone** - Guardar y reutilizar timezone
- [x] **Hook PUT** - useUpdateSchedules con retorno de success

### **Holidays (Festivos y Vacaciones)**
- [x] **GET /companies/holidays** - Obtener holidays
- [x] **DTO de respuesta GET** - GetHolidaysResponseDto con dateRange
- [x] **Mapper GET** - mapHolidaysFromDto (convierte DTO → Dominio)
- [x] **UseCase GET** - GetHolidaysUseCase
- [x] **Hook GET** - useGetHolidays con useState/useEffect
- [x] **POST /companies/holidays** - Crear holiday individual
- [x] **DTO request/response POST** - CreateHolidayRequestDto y CreateHolidayResponseDto
- [x] **Mapper POST** - mapHolidayToCreateDto (convierte Dominio → DTO con formato YYYY-MM-DD)
- [x] **UseCase POST** - CreateHolidayUseCase
- [x] **Hook POST** - useCreateHoliday con retorno del holiday creado
- [x] **DELETE /companies/holidays/:id** - Eliminar holiday individual
- [x] **UseCase DELETE** - DeleteHolidayUseCase
- [x] **Hook DELETE** - useDeleteHoliday con feedback de éxito/error
- [x] **Componente HolidayManager** - Gestión completa de festivos (CRUD)
- [x] **PUT /companies/holidays** - Actualizar holidays bulk (existente)
- [x] **Hook PUT** - useUpdateHolidays con retorno de success
- [x] **Toast notifications** - Feedback visual para todas las operaciones (create/delete)
- [x] **Guardado inmediato** - Cada holiday se guarda automáticamente al añadirlo

### **Integración**
- [x] **Componente principal** - Schedules.tsx integra ambos módulos
- [x] **Loading states** - Manejo de carga para schedules y holidays
- [x] **Error handling** - Manejo de errores para ambos módulos
- [x] **Refetch después de guardar** - onSaveSuccess refresca datos
- [x] **Traducciones** - Textos en ES/EN para errores y mensajes
- [x] **Sin errores de lint** - Código validado y limpio

---

## 🔧 Configuración del Backend

El backend infiere automáticamente:
- **agencyId** - Del token de autenticación
- **companyId** - Del token de autenticación

Por lo tanto, NO es necesario pasarlos como parámetros en las llamadas HTTP.

---

## 📝 Notas Técnicas

1. **Timezone por defecto**: `America/Bogota`
2. **Formato de tiempo**: `HH:mm` (ej: "08:00", "17:30")
3. **Días de la semana**: 0 (Domingo) a 6 (Sábado)
4. **isEnabled por defecto**: `true` (tanto en schedules como en times)
5. **Caché**: El adapter mantiene el timezone en memoria para reutilizarlo
6. **Pattern**: Sigue el patrón del proyecto (no usa React Query)

---

## 🚀 Funcionalidades Completadas

### **Schedules (Horarios)**
1. ✅ GET de horarios se carga automáticamente
2. ✅ PUT de horarios con validación de slots máximos
3. ✅ Timezone se mantiene correctamente en caché
4. ✅ Refetch automático después de guardar

### **Holidays (Festivos y Vacaciones)**
1. ✅ GET de holidays se carga automáticamente
2. ✅ POST de holidays individuales con guardado inmediato
3. ✅ DELETE de holidays individuales con feedback
4. ✅ PUT bulk de holidays (existente, para compatibilidad)
5. ✅ Toast notifications para todas las operaciones (create/delete)
6. ✅ Refetch automático después de crear o eliminar
7. ✅ Formato de fechas correcto (YYYY-MM-DD para API)
8. ✅ Soporte para días únicos y rangos de fechas

### **Integración y UX**
1. ✅ Manejo de errores con toasts
2. ✅ Traducciones completas en ES/EN
3. ✅ Estados de loading para todas las operaciones
4. ✅ Integración completa schedules + holidays en un solo componente
5. ✅ Feedback visual inmediato en todas las acciones

## 📋 Estructura de Datos de Holidays

### **Respuesta GET**
La respuesta del endpoint `GET /companies/holidays` incluye:

- **id**: Identificador único del holiday
- **agencyId**: ID de la agencia
- **companyId**: ID de la compañía
- **dateRange**: Objeto con startDate y endDate
  - **startDate**: Fecha de inicio (ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ")
  - **endDate**: Fecha de fin (ISO 8601) o `null` para días únicos
- **description**: Descripción del festivo/vacación

### **Request POST**
El endpoint `POST /companies/holidays` espera:

- **dateRange**: Objeto con startDate y endDate opcional
  - **startDate**: Fecha de inicio (formato: "YYYY-MM-DD")
  - **endDate**: Fecha de fin (formato: "YYYY-MM-DD") - **opcional, solo para rangos**
- **description**: Descripción del festivo/vacación

### **Mapeo Automático**
El mapper determina automáticamente el tipo de holiday:
- Si `endDate` es `null` o no existe → `HolidayType.SingleDay`
- Si `endDate` tiene valor → `HolidayType.DateRange`

### **Formatos de Fecha**
- **GET Response**: ISO 8601 completo (`"2025-12-25T00:00:00.000Z"`)
- **POST Request**: Solo fecha (`"2025-12-25"`)
- **Dominio**: Objetos `Date` de JavaScript

