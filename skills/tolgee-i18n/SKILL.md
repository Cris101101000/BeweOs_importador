# Tolgee i18n - Internationalization

## Overview

This project uses **@tolgee/react 6.2.6** for internationalization. All user-facing text MUST use translations.

---

## Directory Structure

```
src/
└── locales/
    ├── es/                    # Spanish (default)
    │   ├── common.json        # ⭐ REUSABLE elements (buttons, fields, cities, etc.)
    │   ├── users.json         # Module-specific only
    │   ├── settings.json      # Module-specific only
    │   ├── menu.json          # Module-specific only
    │   └── [feature].json     # Module-specific only
    ├── en/                    # English
    │   └── ...
    └── pt/                    # Portuguese
        └── ...
```

---

## Naming Conventions

### CRITICAL RULE: All keys MUST use `snake_case`

### For common.json (Reusable Elements)

**Format**: `{category}_{element}`

```json
{
  "button_save": "Guardar",
  "button_cancel": "Cancelar",
  "field_name": "Nombre",
  "field_email": "Correo electrónico",
  "placeholder_enter_name": "Ingresa tu nombre",
  "role_admin": "Administrador",
  "city_bogota": "Bogotá",
  "status_active": "Activo"
}
```

### For Module-specific Files

**Format**: `{module}_{subpage}_{key}`

```json
{
  "settings_profile_information_title": "Información Personal",
  "settings_profile_information_description": "Actualiza tu información",
  "users_table_team_title": "Usuarios del equipo",
  "users_invite_success_message": "La invitación se envió correctamente"
}
```

---

## Separation Rules: Common vs Module-specific

### Decision Framework

```
Ask yourself: "Can this exact text be used in another module?"
├── YES → common.json (use {category}_{element} format)
├── MAYBE → common.json (prefer reusability)
└── NO (clearly module-specific) → [module].json (use {module}_{subpage}_{key})
```

---

## common.json Categories

### 🔘 BUTTONS (Generic Actions)

```json
{
  "button_save": "Guardar",
  "button_cancel": "Cancelar",
  "button_edit": "Editar",
  "button_delete": "Eliminar",
  "button_create": "Crear",
  "button_update": "Actualizar",
  "button_reset": "Restablecer",
  "button_close": "Cerrar",
  "button_confirm": "Confirmar",
  "button_continue": "Continuar",
  "button_back": "Atrás",
  "button_next": "Siguiente",
  "button_finish": "Finalizar",
  "button_send": "Enviar",
  "button_upload": "Subir",
  "button_download": "Descargar",
  "button_export": "Exportar",
  "button_import": "Importar",
  "button_search": "Buscar",
  "button_filter": "Filtrar",
  "button_clear": "Limpiar",
  "button_refresh": "Actualizar"
}
```

### 🔘 FORM FIELDS (Generic Labels)

```json
{
  "field_name": "Nombre",
  "field_email": "Correo electrónico",
  "field_phone": "Teléfono",
  "field_city": "Ciudad",
  "field_country": "País",
  "field_address": "Dirección",
  "field_role": "Rol",
  "field_language": "Idioma",
  "field_password": "Contraseña",
  "field_confirm_password": "Confirmar contraseña",
  "field_date": "Fecha",
  "field_time": "Hora",
  "field_description": "Descripción",
  "field_comments": "Comentarios",
  "field_status": "Estado",
  "field_type": "Tipo",
  "field_category": "Categoría"
}
```

### 🔘 PLACEHOLDERS (Generic Hints)

```json
{
  "placeholder_enter_name": "Ingresa tu nombre",
  "placeholder_enter_email": "Ingresa tu correo electrónico",
  "placeholder_select_city": "Selecciona una ciudad",
  "placeholder_select_role": "Selecciona un rol",
  "placeholder_select_language": "Selecciona un idioma",
  "placeholder_enter_password": "Ingresa tu contraseña",
  "placeholder_search": "Buscar...",
  "placeholder_optional": "Opcional",
  "placeholder_select_option": "Selecciona una opción"
}
```

### 🔘 SYSTEM ROLES

```json
{
  "role_admin": "Administrador",
  "role_user": "Usuario",
  "role_editor": "Editor",
  "role_viewer": "Visualizador",
  "role_moderator": "Moderador",
  "role_manager": "Gerente"
}
```

### 🔘 GEOGRAPHIC DATA

```json
{
  "city_bogota": "Bogotá",
  "city_medellin": "Medellín",
  "city_cali": "Cali",
  "country_colombia": "Colombia",
  "country_venezuela": "Venezuela"
}
```

### 🔘 SYSTEM LANGUAGES

```json
{
  "language_spanish": "Español",
  "language_english": "Inglés",
  "language_portuguese": "Portugués"
}
```

### 🔘 STATES AND COMMON MESSAGES

```json
{
  "status_active": "Activo",
  "status_inactive": "Inactivo",
  "status_pending": "Pendiente",
  "status_completed": "Completado",
  "status_cancelled": "Cancelado",
  "message_loading": "Cargando...",
  "message_success": "Éxito",
  "message_error": "Error",
  "message_no_data": "No hay datos disponibles",
  "message_confirm_delete": "¿Estás seguro de que quieres eliminar este elemento?"
}
```

### 🔘 GENERIC VALIDATIONS

```json
{
  "validation_required": "Este campo es obligatorio",
  "validation_invalid_email": "El correo electrónico no es válido",
  "validation_min_length": "Mínimo {count} caracteres",
  "validation_max_length": "Máximo {count} caracteres",
  "validation_passwords_not_match": "Las contraseñas no coinciden"
}
```

---

## Usage in Components

### Basic Usage

```typescript
import { useTranslate } from "@tolgee/react";

const MyComponent = () => {
  const { t } = useTranslate();

  return (
    <div>
      {/* From common.json (reusable) */}
      <label>{t("field_name")}</label>
      <Input placeholder={t("placeholder_enter_name")} />
      <Button>{t("button_save")}</Button>
      
      {/* From [module].json (specific) */}
      <h1>{t("settings_profile_information_title")}</h1>
      <p>{t("settings_profile_information_description")}</p>
    </div>
  );
};
```

### Complete Example

```typescript
import { useTranslate } from "@tolgee/react";

const SettingsProfile = () => {
  const { t } = useTranslate();

  return (
    <div>
      {/* Module-specific titles - from settings.json */}
      <h1>{t("settings_profile_information_title")}</h1>
      <p>{t("settings_profile_information_description")}</p>

      <form>
        {/* Generic fields - from common.json */}
        <label>{t("field_name")}</label>
        <Input placeholder={t("placeholder_enter_name")} />

        <label>{t("field_email")}</label>
        <Input placeholder={t("placeholder_enter_email")} />

        <label>{t("field_city")}</label>
        <Select placeholder={t("placeholder_select_city")}>
          <SelectItem value="bogota">{t("city_bogota")}</SelectItem>
          <SelectItem value="medellin">{t("city_medellin")}</SelectItem>
        </Select>

        <label>{t("field_role")}</label>
        <Select placeholder={t("placeholder_select_role")}>
          <SelectItem value="admin">{t("role_admin")}</SelectItem>
          <SelectItem value="user">{t("role_user")}</SelectItem>
        </Select>

        {/* Generic buttons - from common.json */}
        <Button type="submit">{t("button_save")}</Button>
        <Button variant="light">{t("button_cancel")}</Button>
      </form>

      {/* Module-specific section - from settings.json */}
      <h2>{t("settings_profile_appearance_title")}</h2>
      <p>{t("settings_profile_appearance_description")}</p>
    </div>
  );
};
```

---

## Anti-Patterns to Avoid

```typescript
// ❌ Duplicating common elements in module files
{
  "settings_save_button": "Guardar",     // Use button_save from common
  "settings_name_field": "Nombre",       // Use field_name from common
  "users_admin_role": "Admin"            // Use role_admin from common
}

// ❌ Hardcoded text in components
<Button>Guardar</Button>                 // Use t("button_save")
<label>Nombre</label>                    // Use t("field_name")

// ❌ Wrong naming conventions
{
  "settingsProfileTitle": "...",         // camelCase
  "settings-profile-title": "...",       // kebab-case
  "settings.profile.title": "..."        // dot notation
}

// ❌ Using module-specific when common exists
<Button>{t("settings_edit_button")}</Button>  // Use t("button_edit")
<Input label={t("users_email_label")} />      // Use t("field_email")
```

---

## Commands

```bash
# Sync translations down from Tolgee
bun run sync:locales

# Sync translations up to Tolgee
bun run sync:locales:up
```

---

## Validation Checklist

Before committing:

**Correct Separation:**
- [ ] common.json contains only reusable elements
- [ ] Generic elements (buttons, fields, placeholders, roles, cities) are in common.json
- [ ] Specific elements are in `src/locales/es/[module].json`
- [ ] NO duplication between common.json and module files

**Correct Format:**
- [ ] common.json uses format: `{category}_{element}`
- [ ] [module].json uses format: `{module}_{subpage}_{key}`
- [ ] All keys in snake_case

**Completeness:**
- [ ] All texts from Figma design are included
- [ ] No hardcoded text in components
- [ ] useTranslate implemented correctly
- [ ] Mixed implementation (common + specific) in components

