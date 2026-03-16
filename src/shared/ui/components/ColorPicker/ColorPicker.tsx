import { ColorPicker } from "@beweco/aurora-ui";
import type {
	ColorPickerProps,
	ColorPickerTranslations,
	PredefinedColor,
} from "@beweco/aurora-ui";

/**
 * Re-exportar tipos desde @beweco/aurora-ui para facilitar el uso
 */
export type { ColorPickerProps, ColorPickerTranslations, PredefinedColor };

/**
 * ColorPicker Component - Wrapper para uso en BeweOSsmbs
 *
 * Este es un wrapper del componente ColorPicker de @beweco/aurora-ui que facilita
 * su integración en el proyecto beweossmbs.
 *
 * ## 🎯 Características
 *
 * - ✅ Selector de color nativo (input type="color")
 * - ✅ Input de texto para códigos hex con validación
 * - ✅ Validación de formato hex (#RGB y #RRGGBB)
 * - ✅ Normalización automática de colores
 * - ✅ Accesibilidad integrada (ARIA labels, keyboard navigation)
 * - ✅ Dark mode soportado
 * - ✅ TypeScript con tipado completo
 * - ✅ Modo minimal por defecto (sin paleta ni historial)
 *
 * ## 📋 Props Disponibles
 *
 * | Prop | Tipo | Default | Descripción |
 * |------|------|---------|-------------|
 * | `value` * | `string` | - | Color actual seleccionado (formato hex) |
 * | `onChange` * | `(color: string) => void` | - | Callback cuando el color cambia |
 * | `label` | `string` | - | Etiqueta del campo |
 * | `required` | `boolean` | `false` | Si el campo es obligatorio |
 * | `disabled` | `boolean` | `false` | Si el campo está deshabilitado |
 * | `error` | `boolean` | `false` | Estado de error |
 * | `errorText` | `string` | - | Mensaje de error |
 * | `predefinedColors` | `PredefinedColor[]` | `[]` | Paleta de colores predefinidos |
 * | `enableRecentColors` | `boolean` | `true` (wrapper: `false`) | Habilitar colores recientes |
 * | `maxRecentColors` | `number` | `6` | Máximo de colores recientes |
 * | `recentColorsStorageKey` | `string` | `"aurora-ui-recent-colors"` | LocalStorage key para colores recientes |
 * | `showPredefinedColors` | `boolean` | `true` (wrapper: `false`) | Mostrar paleta predefinida |
 * | `translations` | `ColorPickerTranslations` | `{}` | Traducciones para i18n |
 * | `className` | `string` | `""` | Custom className |
 * | `id` | `string` | - | Input HTML id |
 *
 * > **Nota**: Las props marcadas con * son requeridas.
 * > **Nota**: Este wrapper configura `showPredefinedColors` y `enableRecentColors` en `false` por defecto.
 *
 * ## 🎨 Modo Minimal (por defecto en este wrapper)
 *
 * Por defecto, el componente está configurado en **modo minimal** que incluye:
 * - ✅ Solo selector de color nativo + input hex
 * - ❌ Sin paleta de colores predefinidos
 * - ❌ Sin historial de colores recientes
 *
 * Para activar características adicionales, usa las props:
 * - `showPredefinedColors={true}` - Mostrar paleta de colores
 * - `enableRecentColors={true}` - Habilitar historial de colores
 *
 * ## 📦 Casos de Uso
 *
 * ### 1. Configuración de Marca en Social Networks
 * Selector de color principal y secundario para personalización de marca.
 *
 * ### 2. Personalización de Perfil de Usuario
 * Permite a los usuarios elegir colores de acento para su perfil.
 *
 * ### 3. Categorías de Productos
 * Asignar colores a categorías para mejor visualización.
 *
 * ### 4. Etiquetas y Tags
 * Colores personalizados para sistemas de etiquetado.
 *
 * @example
 * // Uso básico (modo minimal)
 * <ColorPickerComponent
 *   value={brandColor}
 *   onChange={setBrandColor}
 *   label="Color de marca"
 *   required
 * />
 *
 * @example
 * // Campo deshabilitado (read-only)
 * <ColorPickerComponent
 *   value={brandColor}
 *   onChange={setBrandColor}
 *   label="Color de marca"
 *   disabled={true}
 * />
 *
 * @example
 * // Con estado de error
 * <ColorPickerComponent
 *   value={invalidColor}
 *   onChange={setInvalidColor}
 *   label="Color inválido"
 *   error={true}
 *   errorText="El color seleccionado no es válido"
 * />
 *
 * @example
 * // Con paleta personalizada
 * <ColorPickerComponent
 *   value={themeColor}
 *   onChange={setThemeColor}
 *   label="Color del tema"
 *   showPredefinedColors={true}
 *   predefinedColors={[
 *     { name: "Azul", value: "#3B82F6" },
 *     { name: "Verde", value: "#10B981" },
 *     { name: "Rojo", value: "#EF4444" },
 *   ]}
 * />
 *
 * @example
 * // Con historial de colores recientes
 * <ColorPickerComponent
 *   value={primaryColor}
 *   onChange={setPrimaryColor}
 *   label="Color primario"
 *   enableRecentColors={true}
 *   maxRecentColors={8}
 *   recentColorsStorageKey="brand-colors"
 * />
 *
 * @example
 * // Con traducciones personalizadas
 * <ColorPickerComponent
 *   value={color}
 *   onChange={setColor}
 *   label="Color"
 *   translations={{
 *     colorPickerLabel: "Selector de color",
 *     hexInputLabel: "Código hexadecimal",
 *     recentColorsLabel: "Colores recientes",
 *     predefinedColorsLabel: "Colores sugeridos",
 *   }}
 * />
 *
 * ## 💡 Notas Importantes
 *
 * ### Formatos Soportados
 * - **6 dígitos**: #RRGGBB (ej: #3B82F6)
 * - **3 dígitos**: #RGB (ej: #38F) - normalizado automáticamente
 *
 * ### Validación
 * El componente valida automáticamente el formato hex y muestra
 * mensajes de error cuando el formato es inválido.
 *
 * ### Prop `disabled`
 * Cuando `disabled={true}`:
 * - El selector de color nativo está deshabilitado
 * - El input de texto está deshabilitado
 * - Los estilos visuales indican el estado deshabilitado
 * - No se dispara el callback `onChange`
 *
 * ## 📚 Referencias
 *
 * - **Componente Base**: `@beweco/aurora-ui/ColorPicker`
 * - **Documentación AuraUI**: Ver README en auraui/src/components/color-picker/
 * - **Stories**: Ver auraui/stories/ColorPicker.stories.tsx para más ejemplos
 */
export function ColorPickerComponent(props: ColorPickerProps) {
	// Configuración por defecto en modo minimal
	const defaultProps: Partial<ColorPickerProps> = {
		showPredefinedColors: false,
		enableRecentColors: false,
	};

	return <ColorPicker {...defaultProps} {...props} />;
}
