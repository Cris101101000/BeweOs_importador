# Jira Workflow Skill

> **Trigger**: Esta skill se activa ÚNICAMENTE cuando el usuario hace referencia a un issue de Jira (formato `BEW-XXX`, `PROJ-XXX`, o cualquier patrón `[A-Z]+-[0-9]+`).

---

## Cuándo Usar Esta Skill

| Trigger | Acción |
|---------|--------|
| Usuario menciona `BEW-67`, `BEW-123`, etc. | Activar esta skill |
| Usuario dice "lee el issue", "revisa el ticket" | Activar esta skill |
| Usuario pide implementar algo sin issue | NO usar esta skill |
| Tarea general de código | NO usar esta skill |

---

## Flujo de Trabajo Obligatorio

### Paso 1: LEER - Obtener Issue Completo

```
1. Usar MCP de Atlassian para obtener el issue
2. Extraer: título, descripción, tipo, prioridad, criterios de aceptación
3. Presentar resumen estructurado al usuario
```

### Paso 2: ANALIZAR - Identificar Código Afectado

```
1. Identificar módulo(s) y feature(s) afectados
2. Localizar archivos relevantes en el codebase
3. Entender el estado actual del código
4. Documentar dependencias y componentes relacionados
```

### Paso 3: PROPONER - Plan de Implementación

**OBLIGATORIO**: Antes de escribir código, presentar al usuario:

```markdown
## Plan de Implementación para [ISSUE-KEY]

### Archivos a modificar:
- `path/to/file1.ts` - [descripción del cambio]
- `path/to/file2.tsx` - [descripción del cambio]

### Archivos nuevos (si aplica):
- `path/to/new-file.ts` - [propósito]

### Cambios propuestos:
1. [Cambio 1 - descripción clara]
2. [Cambio 2 - descripción clara]

### Validaciones:
- [ ] [Validación requerida 1]
- [ ] [Validación requerida 2]

### Preguntas/Ambigüedades:
- [Pregunta si hay algo no claro en el issue]
```

### Paso 4: CONFIRMAR - Esperar Aprobación

```
⚠️ NUNCA proceder sin confirmación explícita del usuario
```

Esperar respuesta del usuario:
- ✅ "Sí", "Procede", "Ok", "Adelante" → Continuar a Paso 5
- ❓ Usuario tiene dudas → Resolver antes de continuar
- ❌ Usuario rechaza → Ajustar plan y volver a Paso 3

### Paso 5: IMPLEMENTAR - Ejecutar Cambios

```
1. Implementar cambios según el plan aprobado
2. Seguir las skills técnicas correspondientes (bewe-architecture, aurora-ui, etc.)
3. Aplicar patrones del proyecto (Result pattern, Controller en forms, etc.)
4. Verificar lint/format solo en archivos modificados
```

### Paso 6: VERIFICAR - Checklist Final

```markdown
## Verificación Post-Implementación

- [ ] Cambios alineados con el issue original
- [ ] Código sigue patrones del proyecto
- [ ] Traducciones agregadas si hay texto nuevo
- [ ] Sin errores de lint en archivos modificados
- [ ] Todos los criterios de aceptación cubiertos
```

---

## Reglas Críticas

### ✅ SIEMPRE

1. **Leer el issue completo** antes de proponer cualquier cambio
2. **Mostrar el plan** antes de implementar
3. **Esperar confirmación** del usuario
4. **Preguntar** si hay ambigüedad en los requisitos
5. **Verificar código existente** antes de crear nuevo

### ❌ NUNCA

1. **Implementar sin plan aprobado**
2. **Asumir requisitos** no especificados en el issue
3. **Ignorar campos del issue** (prioridad, tipo, etc.)
4. **Saltarse la confirmación** aunque parezca obvio
5. **Modificar archivos no relacionados** con el issue

---

## Interpretación de Campos del Issue

| Campo | Cómo Interpretarlo |
|-------|-------------------|
| **Tipo: Error/Bug** | Corrección puntual, mínimo impacto, no agregar features |
| **Tipo: Historia/Story** | Nueva funcionalidad, puede requerir más archivos |
| **Tipo: Tarea/Task** | Trabajo técnico, refactoring, mejoras |
| **Prioridad: High/Critical** | Enfocarse solo en el issue, sin mejoras adicionales |
| **Prioridad: Low/Medium** | Puede incluir pequeñas mejoras relacionadas |

---

## Ejemplo de Flujo Completo

```
Usuario: "Lee el issue BEW-67"

Agente:
1. [LEER] Obtiene issue via MCP Atlassian
2. [LEER] Presenta resumen: "BEW-67 - Campo duración con selector..."
3. [ANALIZAR] "Veo que esto afecta src/catalog/ui/pages/services.page.tsx..."
4. [PROPONER] "Mi plan es: 1) Agregar enum para tipo... 2) Modificar input..."
5. [CONFIRMAR] "¿Procedo con este plan?"
6. [Usuario confirma]
7. [IMPLEMENTAR] Realiza los cambios
8. [VERIFICAR] "Cambios completados. Checklist: ✅ ✅ ✅"
```

---

## Herramientas MCP Disponibles

Para obtener información de Jira:

```typescript
// Obtener recursos accesibles (cloudId)
mcp_atlassian-mcp-server_getAccessibleAtlassianResources()

// Obtener issue específico
mcp_atlassian-mcp-server_getJiraIssue({
  cloudId: "...",
  issueIdOrKey: "BEW-67"
})

// Buscar issues con JQL
mcp_atlassian-mcp-server_searchJiraIssuesUsingJql({
  cloudId: "...",
  jql: "project = BEW AND status = 'In Progress'"
})
```

---

## Integración con Otras Skills

Después de la fase CONFIRMAR, invocar las skills técnicas según el tipo de cambio:

| Tipo de Cambio | Skills a Invocar |
|----------------|------------------|
| Nuevo componente UI | `aurora-ui`, `react-19`, `accessibility` |
| Modificar formulario | `react-hook-form`, `zod-4` |
| Lógica de negocio | `bewe-architecture` |
| Traducciones | `tolgee-i18n` |
| Estilos | `tailwind-scss` |

