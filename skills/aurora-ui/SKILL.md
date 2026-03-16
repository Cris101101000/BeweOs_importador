# Aurora UI - Proxy/Wrapper de HeroUI

## Descripción General

`@beweco/aurora-ui` es un **proxy/wrapper de HeroUI** que incluye:
- **Componentes Personalizados**: Completamente rediseñados para BeweOS
- **Componentes Proxy**: Funcionan **idénticamente** a HeroUI, solo cambia el import

> **Skills Relacionados**: 
> - [`bewe-ui`](../bewe-ui/SKILL.md) - Patrones UI de BeweOS y jerarquía de componentes
> - [`react-hook-form`](../react-hook-form/SKILL.md) - Uso de Controller con componentes Aurora UI


## Regla MCP Aurora (OBLIGATORIA)

**Los componentes de Aurora UI solo se consultan a través del MCP.** No uses otra fuente para entender la API o la documentación de componentes.

1. **Validar siempre** si el MCP de Aurora (`aura-ui` / `user-aura-ui`) está disponible en el workspace antes de usar o documentar componentes.
2. **Si el MCP no está instalado o no está disponible**: debes **decir al usuario** de forma explícita:
   - *"El MCP de Aurora UI no está instalado o no está disponible en este workspace."*
   - *"Para consultar componentes de Aurora UI (props, documentación, ejemplos) debes instalar y habilitar el MCP según esta skill. Verifica la configuración en Cursor (por ejemplo en la configuración de MCP del proyecto)."*
3. **NUNCA** accedas a `node_modules` (ni a paquetes enlazados como symlinks) para intentar comprender la API, los tipos o el comportamiento de `@beweco/aurora-ui`. La única fuente permitida para documentación de componentes es el MCP.

### Configuración del MCP (referencia para el usuario)

{
    "aura-ui": {
      "command": "npx",
      "args": ["-y", "storybook-mcp@latest"],
      "env": {
        "STORYBOOK_URL": "https://aura-components.beweos.io/index.json",
        "CUSTOM_TOOLS": "[{\"name\":\"getAuraUIContext\",\"description\":\"Get context and documentation about Aura UI library. Explains that Aura UI is a proxy/wrapper library over HeroUI (formerly NextUI), providing custom themed components and additional utilities for the Bewe ecosystem.\",\"parameters\":{},\"page\":\"http://aura-components.beweos.io/?path=/docs/custom-components-button--docs\",\"handler\":\"(() => ({ library: 'aura-ui', description: 'Aura UI es una librería de componentes React que actúa como proxy/wrapper de HeroUI (anteriormente NextUI). Proporciona componentes personalizados con el tema de Bewe, además de componentes adicionales para el ecosistema Bewe.', relationship: { baseLibrary: 'HeroUI (https://heroui.com)', role: 'proxy/wrapper', documentation: 'https://heroui.com/docs' }, componentCategories: { 'Custom Components': 'Componentes únicos de Aura UI que extienden o crean nuevas funcionalidades', 'Components': 'Wrappers sobre componentes de HeroUI con estilos personalizados de Bewe', 'HeroUI Components': 'Componentes de HeroUI re-exportados directamente' }, usage: { install: 'npm install @bewe/aura-ui', import: \\\"import { Button, Input, Modal } from '@bewe/aura-ui'\\\", heroUIDocsApply: 'Los props y comportamientos de HeroUI aplican a los componentes wrapper de Aura UI' }, tips: ['Para componentes en HeroUI Components, consulta directamente la documentación de HeroUI', 'Los componentes en Components son wrappers con estilos de Bewe - los props de HeroUI aplican', 'Los Custom Components son únicos de Aura UI y su documentación está en el Storybook'] }))()\"},{\"name\":\"getStoriesByCategory\",\"description\":\"Get all stories grouped by category (Custom Components, Components, HeroUI Components). Returns a structured list of all available components organized by their type.\",\"parameters\":{},\"page\":\"http://aura-components.beweos.io/index.json\",\"handler\":\"fetch(window.location.href).then(r=>r.json()).then(d=>{const categories={};Object.values(d.entries).filter(e=>e.type==='story').forEach(s=>{const cat=s.title.split('/')[0];if(!categories[cat])categories[cat]=[];const existing=categories[cat].find(c=>c.component===s.title.split('/').pop());if(!existing){categories[cat].push({component:s.title.split('/').pop(),stories:[{id:s.id,name:s.name}],componentPath:s.componentPath});}else{existing.stories.push({id:s.id,name:s.name});}});return categories;})\"},{\"name\":\"getHeroUIMapping\",\"description\":\"Get information about which Aura UI components map to HeroUI components and which are custom. Provides links to HeroUI documentation for mapped components.\",\"parameters\":{},\"page\":\"http://aura-components.beweos.io/index.json\",\"handler\":\"fetch(window.location.href).then(r=>r.json()).then(d=>{const mapping={summary:{total:0,heroUI:0,custom:0,wrapper:0},heroUIComponents:[],customComponents:[],wrapperComponents:[]};const seen=new Set();Object.values(d.entries).filter(e=>e.type==='story').forEach(s=>{const cat=s.title.split('/')[0];const comp=s.title.split('/').pop();if(seen.has(comp+cat))return;seen.add(comp+cat);mapping.summary.total++;if(cat==='HeroUI Components'){mapping.summary.heroUI++;mapping.heroUIComponents.push({name:comp,storyId:s.id,heroUIDoc:'https://heroui.com/docs/components/'+comp.toLowerCase()});}else if(cat==='Custom Components'){mapping.summary.custom++;mapping.customComponents.push({name:comp,storyId:s.id,note:'Componente único de Aura UI'});}else if(cat==='Components'){mapping.summary.wrapper++;mapping.wrapperComponents.push({name:comp,storyId:s.id,note:'Wrapper de HeroUI con estilos Bewe'});}});return mapping;})\"},{\"name\":\"searchComponents\",\"description\":\"Search for components by name in Aura UI. Returns matching components with their category and available stories.\",\"parameters\":{\"searchTerm\":{\"type\":\"string\",\"description\":\"The component name or partial name to search for\"}},\"page\":\"http://aura-components.beweos.io/index.json\",\"handler\":\"fetch(window.location.href).then(r=>r.json()).then(d=>{const term=(arguments[0]?.searchTerm||'').toLowerCase();const results=[];const seen=new Set();Object.values(d.entries).filter(e=>e.type==='story').forEach(s=>{const comp=s.title.split('/').pop();const cat=s.title.split('/')[0];if(comp.toLowerCase().includes(term)){const key=cat+comp;if(!seen.has(key)){seen.add(key);const existing=results.find(r=>r.component===comp&&r.category===cat);if(!existing){results.push({component:comp,category:cat,stories:[{id:s.id,name:s.name}],componentPath:s.componentPath});}else{existing.stories.push({id:s.id,name:s.name});}}}});return{searchTerm:term,resultsCount:results.length,results};})\"},{\"name\":\"getComponentDocs\",\"description\":\"Get the documentation page URL and basic info for a specific component\",\"parameters\":{\"componentName\":{\"type\":\"string\",\"description\":\"The name of the component to get docs for (e.g., Button, Input, Modal)\"}},\"page\":\"http://aura-components.beweos.io/index.json\",\"handler\":\"fetch(window.location.href).then(r=>r.json()).then(d=>{const name=(arguments[0]?.componentName||'').toLowerCase();const docs=Object.values(d.entries).filter(e=>e.type==='docs'&&e.title.toLowerCase().includes(name));const stories=Object.values(d.entries).filter(e=>e.type==='story'&&e.title.toLowerCase().includes(name));if(docs.length===0)return{error:'Component not found',suggestion:'Use getComponentList to see all available components'};const doc=docs[0];const cat=doc.title.split('/')[0];return{component:doc.title.split('/').pop(),category:cat,docsUrl:'http://aura-components.beweos.io/?path=/docs/'+doc.id,isHeroUIWrapper:cat==='Components'||cat==='HeroUI Components',heroUIDocsUrl:cat!=='Custom Components'?'https://heroui.com/docs/components/'+doc.title.split('/').pop().toLowerCase().replace('aura',''):null,availableStories:stories.map(s=>({name:s.name,id:s.id}))};})\"},{\"name\":\"getTypographyComponents\",\"description\":\"Get all typography-related components (H1, H2, H3, H4, P) from Aura UI\",\"parameters\":{},\"page\":\"http://aura-components.beweos.io/index.json\",\"handler\":\"fetch(window.location.href).then(r=>r.json()).then(d=>{const typography=Object.values(d.entries).filter(e=>e.title.includes('Typography')).map(e=>({id:e.id,name:e.name,title:e.title,type:e.type}));return{category:'Custom Components/Typography',components:typography,usage:'Import typography components: import { H1, H2, H3, H4, P } from \\\"@bewe/aura-ui\\\"'};})\"},{\"name\":\"getFormComponents\",\"description\":\"Get all form-related components (Input, Select, Textarea, Phone, DatePicker, etc.) from Aura UI\",\"parameters\":{},\"page\":\"http://aura-components.beweos.io/index.json\",\"handler\":\"fetch(window.location.href).then(r=>r.json()).then(d=>{const formKeywords=['input','select','textarea','phone','date','time','autocomplete','switch','upload','color'];const formComponents=[];const seen=new Set();Object.values(d.entries).filter(e=>e.type==='story').forEach(s=>{const comp=s.title.split('/').pop().toLowerCase();if(formKeywords.some(k=>comp.includes(k))){const key=s.title;if(!seen.has(key)){seen.add(key);formComponents.push({component:s.title.split('/').pop(),category:s.title.split('/')[0],docsId:s.id.replace(s.name.toLowerCase().replace(/ /g,'-'),'docs'),storyId:s.id});}}});return{description:'Form-related components in Aura UI',components:formComponents};})\"},{\"name\":\"getLayoutComponents\",\"description\":\"Get all layout-related components (Card, Modal, Header, Wizard, etc.) from Aura UI\",\"parameters\":{},\"page\":\"http://aura-components.beweos.io/index.json\",\"handler\":\"fetch(window.location.href).then(r=>r.json()).then(d=>{const layoutKeywords=['card','modal','header','wizard','breadcrumb','menu','pagination','step','table','accordion','carousel','drawer'];const layoutComponents=[];const seen=new Set();Object.values(d.entries).filter(e=>e.type==='story'&&e.name==='Default').forEach(s=>{const comp=s.title.split('/').pop().toLowerCase();if(layoutKeywords.some(k=>comp.includes(k))){const key=s.title.split('/').pop();if(!seen.has(key)){seen.add(key);layoutComponents.push({component:s.title.split('/').pop(),category:s.title.split('/')[0],storyId:s.id});}}});return{description:'Layout-related components in Aura UI',components:layoutComponents};})\"}]"
      }
    }
}

### Herramientas MCP Disponibles

| Herramienta | Descripción |
|-------------|-------------|
| `getAuraUIContext` | Proporciona contexto completo sobre Aura UI: que es un proxy de HeroUI, categorías de componentes, instrucciones de uso |
| `getStoriesByCategory` | Lista todos los componentes agrupados por categoría (Custom Components, Components, HeroUI Components) |
| `getHeroUIMapping` | Mapeo de componentes: cuáles son de HeroUI, cuáles son custom, cuáles son wrappers |
| `searchComponents` | Busca componentes por nombre parcial o completo |
| `getComponentDocs` | Obtiene URL de documentación y enlaces a HeroUI docs para un componente específico |
| `getTypographyComponents` | Lista componentes de tipografía (H1, H2, H3, H4, P) |
| `getFormComponents` | Lista componentes de formulario (Input, Select, DatePicker, etc.) |
| `getLayoutComponents` | Lista componentes de layout (Card, Modal, Wizard, etc.) |

---

## Notificaciones Toast

**SIEMPRE** usar el sistema de toast de `@beweco/aurora-ui`:

```typescript
import { useAuraToast } from "@beweco/aurora-ui";
import { configureSuccessToast, configureErrorToastWithTranslation } from "@shared/utils/toast-config.utils";

const { showToast } = useAuraToast();

// Éxito
showToast(configureSuccessToast(t("success_title"), t("success_message")));

// Error
showToast(configureErrorToastWithTranslation(EnumErrorType.Critical, t, "error_key"));
```

### API Correcta

```typescript
// ✅ API correcta
showToast({
  color: "success" | "danger" | "warning" | "info",
  title: string,
  description?: string
});

// ❌ API incorrecta (no usar)
showToast({
  type: "...",      // ❌ Incorrecto - usar "color"
  message: "...",   // ❌ Incorrecto - usar "description"
});
```

### Colores de Toast Soportados

- `success` - Operaciones exitosas (fondo verde con ✓)
- `danger` - Errores críticos (fondo rojo)
- `warning` - Advertencias (fondo amarillo/naranja)
- `info` - Información general (fondo azul)

### Regla Crítica de Elementos HTML (OBLIGATORIA)

**ANTES** de usar cualquier etiqueta HTML nativa, **SIEMPRE** consultar si existe un componente equivalente en Aurora UI o HeroUI. Si existe, **DEBE** usarse el componente en lugar de la etiqueta HTML.

#### Proceso de Verificación

```
¿Necesitas usar una etiqueta HTML (h1, h2, p, span, ul, li, etc.)?
├── 1. CONSULTAR Aurora UI MCP (getTypographyComponents, searchComponents)
│   └── ¿Existe componente equivalente?
│       ├── SÍ → USAR componente de Aurora UI ✅
│       └── NO → Continuar
├── 2. CONSULTAR documentación de HeroUI
│   └── ¿Existe componente equivalente?
│       ├── SÍ → USAR componente de Aurora UI (proxy de HeroUI) ✅
│       └── NO → Usar etiqueta HTML nativa ✅
```

#### Componentes de Tipografía Disponibles

| Etiqueta HTML | Componente Aurora UI | Import |
|---------------|---------------------|--------|
| `<h1>` | `H1` | `import { H1 } from "@beweco/aurora-ui"` |
| `<h2>` | `H2` | `import { H2 } from "@beweco/aurora-ui"` |
| `<h3>` | `H3` | `import { H3 } from "@beweco/aurora-ui"` |
| `<h4>` | `H4` | `import { H4 } from "@beweco/aurora-ui"` |
| `<p>` | `P` | `import { P } from "@beweco/aurora-ui"` |

#### Otros Componentes a Verificar

| Etiqueta HTML | Verificar en Aurora/HeroUI |
|---------------|---------------------------|
| `<button>` | `Button` |
| `<input>` | `Input` |
| `<textarea>` | `Textarea` |
| `<select>` | `Select` |
| `<a>` | `Link` |
| `<img>` | `Image` |
| `<table>` | `Table` |
| `<ul>`, `<li>` | `Listbox`, `ListboxItem` |
| `<div>` con card | `Card`, `CardBody`, `CardHeader` |

#### Ejemplos

```typescript
// ✅ CORRECTO: Usar componentes de Aurora UI
import { H1, H2, P, Button, Link } from "@beweco/aurora-ui";

const MyComponent = () => (
  <div>
    <H1>Título Principal</H1>
    <H2>Subtítulo</H2>
    <P>Este es un párrafo con estilos consistentes.</P>
    <Button color="primary">Acción</Button>
    <Link href="/ruta">Enlace</Link>
  </div>
);
```

```typescript
// ❌ INCORRECTO: Usar etiquetas HTML cuando existe componente
const MyComponent = () => (
  <div>
    <h1>Título Principal</h1>           {/* ❌ Usar H1 */}
    <h2>Subtítulo</h2>                  {/* ❌ Usar H2 */}
    <p>Este es un párrafo.</p>          {/* ❌ Usar P */}
    <button>Acción</button>             {/* ❌ Usar Button */}
    <a href="/ruta">Enlace</a>          {/* ❌ Usar Link */}
  </div>
);
```

#### Cuándo SÍ usar etiquetas HTML nativas

- Cuando el componente NO existe en Aurora UI ni HeroUI
- Para estructuras semánticas específicas sin estilo (ej: `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<main>`)
- Dentro de componentes de Aurora UI que ya manejan el contenido (ej: dentro de `CardBody`)

```typescript
// ✅ CORRECTO: Etiquetas semánticas sin componente equivalente
<section className="my-section">
  <H1>Título</H1>
  <P>Contenido</P>
</section>

// ✅ CORRECTO: Contenido interno manejado por el componente padre
<Card>
  <CardBody>
    <span className="text-tiny">Detalle menor</span>  {/* OK si no hay componente */}
  </CardBody>
</Card>
```