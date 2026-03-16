# VariableTextarea Component

Textarea component with clickable variable chips for easy insertion.

## Features

- 🖱️ **Click to Insert**: Click any variable chip to insert it at cursor position
- 💡 **Always Visible**: Variable chips are always visible below the textarea
- ✏️ **Full Editing**: Normal textarea behavior - click, drag, select text freely
- 🌓 **Dark Mode Support**: Automatically adapts to dark mode
- 🎨 **Custom Styling**: Inherits all HeroUI/Aurora UI Textarea props
- 🎯 **Smart Spacing**: Automatically adds spaces around variables when needed

## Usage

```tsx
import { VariableTextarea } from '@shared/ui/components/VariableTextarea';

function MyComponent() {
  const [text, setText] = useState('Contact us at {{phone}} or visit {{website}}');

  return (
    <VariableTextarea
      label="Description"
      placeholder="Enter text with {{variables}}"
      value={text}
      onChange={(e) => setText(e.target.value)}
      minRows={6}
      showHint={true}
    />
  );
}
```

## Props

Extends all `TextAreaProps` from `@beweco/aurora-ui` plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | **Required**. The textarea value |
| `onChange` | `(e: ChangeEvent) => void` | - | **Required**. Change handler |
| `showHint` | `boolean` | `true` | Show/hide the hint with available variables |

## Available Variables

The component highlights these variables when focused:

- `{{company}}` - Business/Agency name
- `{{phone}}` - Phone number (user's sales phone priority)
- `{{email}}` - User's email address
- `{{website}}` - Website URL
- `{{address}}` - Business physical address
- `{{city}}` - City
- `{{country}}` - Country
- `{{description}}` - Business description
- `{{google_business}}` - Google Business/Maps URL

## Visual Behavior

### Textarea
- Normal textarea with full editing capabilities
- Click anywhere to position cursor
- Drag to select text
- All standard text editing features work

### Variable Panel (Always Visible)
- Located below the textarea
- Shows all 9 available variables as clickable chips
- Click any chip to insert variable at cursor position
- Purple gradient background
- Hover effects on chips

## Examples

### Basic Usage
```tsx
<VariableTextarea
  label="Post Description"
  value={caption}
  onChange={(e) => setCaption(e.target.value)}
  minRows={4}
/>
```

### Without Hint
```tsx
<VariableTextarea
  label="Short Message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  showHint={false}
  minRows={2}
/>
```

### With Custom Description
```tsx
<VariableTextarea
  label="Email Template"
  description="Personalize your email with dynamic variables"
  value={emailTemplate}
  onChange={(e) => setEmailTemplate(e.target.value)}
  minRows={8}
/>
```

## Implementation Details

- Uses a backdrop layer to display highlighted HTML
- Actual textarea is transparent and sits on top
- Variables are matched using regex pattern: `/(\{\{[\w]+\}\})/g`
- CSS handles the visual styling via `.variable-mark` class

## Styling

The component uses Tailwind CSS for all styling:
- Highlight overlay using absolute positioning
- Variables styled with purple background and border
- Helper panel with gradient background
- All styles are inline using Tailwind utility classes

## Dark Mode

Automatically adapts styles in dark mode:
- Adjusted highlight colors (lighter purple with `dark:` variants)
- Dark background for hint panel
- Better contrast for code chips
- Uses Tailwind's dark mode utilities

## Technical Implementation

- **Simple Design**: Normal textarea with variable panel below
- **Click to Insert**: Uses textarea ref to insert at cursor position
- **Smart Spacing**: Detects if spaces are needed before/after variable
- **Cursor Management**: Automatically positions cursor after inserted variable
- **No Overlays**: No blocking layers, fully interactive
- **No External CSS**: All styles are Tailwind utilities (no SCSS dependency)

## How Variable Insertion Works

1. User clicks on a variable chip (e.g., `{{phone}}`)
2. Component gets current cursor position in textarea
3. Checks if spaces are needed before/after the variable
4. Inserts variable with appropriate spacing
5. Moves cursor to end of inserted variable
6. Refocuses textarea for continued editing

## Example Variable Insertion

```
Before: "Contact us at |"  (| = cursor)
Click: {{phone}}
After:  "Contact us at {{phone}} |"  (space added automatically)

Before: "Visit|our website"
Click: {{website}}
After:  "Visit {{website}} |our website"  (spaces added on both sides)
```

