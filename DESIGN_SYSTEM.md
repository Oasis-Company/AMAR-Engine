# AMAR Engine Design System

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing and Layout](#spacing-and-layout)
5. [Components Library](#components-library)
6. [Interface Specifications](#interface-specifications)
7. [Theme System](#theme-system)
8. [Responsive Design](#responsive-design)
9. [Accessibility](#accessibility)
10. [Implementation Guidelines](#implementation-guidelines)

## Design Principles

### Core Principles

- **Professionalism**: Clean, modern design that reflects the technical nature of 3D development
- **Consistency**: Unified visual language across all components and screens
- **Usability**: Intuitive interfaces that reduce cognitive load for complex tasks
- **Performance**: Optimized designs that don't compromise application speed
- **Accessibility**: Inclusive design that works for all users

### Visual Style

- **Dark Theme First**: Professional dark interface with high contrast
- **Modern Minimalism**: Clean lines, subtle shadows, and purposeful use of color
- **Technical Aesthetic**: Inspired by professional 3D software like Blender and Unreal Engine
- **Micro-interactions**: Subtle animations that provide feedback without distraction

## Color System

### Primary Colors

| Color Name | Hex Code | RGB | Purpose |
|------------|----------|-----|---------|
| Primary Blue | #007acc | rgb(0, 122, 204) | Main brand color, primary buttons, important highlights |
| Secondary Blue | #64b5f6 | rgb(100, 181, 246) | Secondary highlights, hover states |
| Tertiary Blue | #bbdefb | rgb(187, 222, 251) | Light accents, background elements |

### Background Colors

| Color Name | Hex Code | RGB | Purpose |
|------------|----------|-----|---------|
| Primary Background | #1a1a2e | rgb(26, 26, 46) | Main application background |
| Secondary Background | #16213e | rgb(22, 33, 62) | Panel backgrounds, secondary surfaces |
| Tertiary Background | #0f3460 | rgb(15, 52, 96) | Accent backgrounds, hover states |
| Elevated Background | #1e293b | rgb(30, 41, 59) | Elevated elements, cards |

### Text Colors

| Color Name | Hex Code | RGB | Purpose |
|------------|----------|-----|---------|
| Primary Text | #ffffff | rgb(255, 255, 255) | Main text, headings |
| Secondary Text | #e2e8f0 | rgb(226, 232, 240) | Secondary text, descriptions |
| Tertiary Text | #94a3b8 | rgb(148, 163, 184) | Tertiary text, disabled elements |
| Quaternary Text | #64748b | rgb(100, 116, 139) | Placeholder text, hints |

### Status Colors

| Color Name | Hex Code | RGB | Purpose |
|------------|----------|-----|---------|
| Success | #22c55e | rgb(34, 197, 94) | Success messages, positive feedback |
| Warning | #f59e0b | rgb(245, 158, 11) | Warning messages, alerts |
| Error | #ef4444 | rgb(239, 68, 68) | Error messages, critical issues |
| Info | #3b82f6 | rgb(59, 130, 246) | Informational messages, hints |

## Typography

### Font Family

- **Primary Font**: Segoe UI (Windows), SF Pro (macOS), Roboto (Linux) - system UI fonts for native feel
- **Fallback Font**: 'Segoe UI', 'SF Pro Display', Roboto, -apple-system, BlinkMacSystemFont, sans-serif

### Font Sizes

| Size Name | Font Size | Line Height | Weight | Purpose |
|-----------|-----------|-------------|--------|---------|
| Heading 1 | 2.5rem (40px) | 1.2 | 300 | Main application title |
| Heading 2 | 2rem (32px) | 1.25 | 300 | Section headings |
| Heading 3 | 1.5rem (24px) | 1.3 | 400 | Sub-section headings |
| Heading 4 | 1.25rem (20px) | 1.4 | 500 | Component titles |
| Body Large | 1rem (16px) | 1.5 | 400 | Main body text |
| Body Medium | 0.875rem (14px) | 1.57 | 400 | Secondary text |
| Body Small | 0.75rem (12px) | 1.67 | 400 | Tertiary text, labels |

### Font Weights

- **300**: Light - for large headings
- **400**: Regular - for body text
- **500**: Medium - for buttons, important labels
- **600**: Semi-bold - for strong emphasis
- **700**: Bold - for critical information

## Spacing and Layout

### Spacing System

| Spacing Unit | Pixel Value | Purpose |
|--------------|-------------|---------|
| xs | 4px | Extra small gaps, tight elements |
| sm | 8px | Small gaps, form elements |
| md | 16px | Medium gaps, card padding |
| lg | 24px | Large gaps, section spacing |
| xl | 32px | Extra large gaps, major sections |
| 2xl | 48px | Massive gaps, page-level spacing |

### Layout Grid

- **Base Unit**: 8px grid system for consistent alignment
- **Container Width**: Max width of 1440px for content areas
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px - 1440px
  - Large Desktop: > 1440px

### Panel System

- **Panel Padding**: 16px (md) for all panels
- **Panel Spacing**: 8px (sm) between panels
- **Panel Border Radius**: 4px for panels and containers
- **Panel Shadows**: Subtle shadows for elevated elements

## Components Library

### Button Component

#### Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `children` | React.ReactNode | Yes | - | Button content |
| `variant` | 'primary'  'secondary'  'tertiary'  'danger' | No | 'primary' | Button style variant |
| `size` | 'sm'  'md'  'lg' | No | 'md' | Button size |
| `disabled` | boolean | No | false | Disabled state |
| `loading` | boolean | No | false | Loading state |
| `onClick` | () => void | No | - | Click handler |
| `fullWidth` | boolean | No | false | Full width button |

#### Usage

```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Primary Button
</Button>
```

### Input Component

#### Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `value` | string | Yes | - | Input value |
| `onChange` | (e: React.ChangeEvent<HTMLInputElement>) => void | Yes | - | Change handler |
| `placeholder` | string | No | '' | Input placeholder |
| `label` | string | No | '' | Input label |
| `error` | string | No | '' | Error message |
| `disabled` | boolean | No | false | Disabled state |
| `size` | 'sm'  'md'  'lg' | No | 'md' | Input size |
| `type` | string | No | 'text' | Input type |

#### Usage

```tsx
<Input
  value={inputValue}
  onChange={handleChange}
  placeholder="Enter text here"
  label="Text Input"
  error={errorMessage}
/>
```

### Panel Component

#### Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `children` | React.ReactNode | Yes | - | Panel content |
| `title` | string | No | '' | Panel title |
| `collapsible` | boolean | No | false | Whether panel can be collapsed |
| `collapsed` | boolean | No | false | Initial collapsed state |
| `onCollapse` | (collapsed: boolean) => void | No | - | Collapse handler |
| `padding` | boolean | No | true | Whether to add padding |

#### Usage

```tsx
<Panel title="Properties" collapsible onCollapse={handleCollapse}>
  {/* Panel content */}
</Panel>
```

### Tabs Component

#### Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `tabs` | Array<{ id: string; label: string; content: React.ReactNode }> | Yes | - | Tab items |
| `activeTab` | string | No | - | Active tab ID |
| `onTabChange` | (tabId: string) => void | No | - | Tab change handler |

#### Usage

```tsx
<Tabs
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <Tab1Content /> },
    { id: 'tab2', label: 'Tab 2', content: <Tab2Content /> }
  ]}
  activeTab={activeTab}
  onTabChange={handleTabChange}
/>
```

### Card Component

#### Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `children` | React.ReactNode | Yes | - | Card content |
| `title` | string | No | '' | Card title |
| `subtitle` | string | No | '' | Card subtitle |
| `footer` | React.ReactNode | No | - | Card footer |
| `padding` | boolean | No | true | Whether to add padding |
| `hoverable` | boolean | No | false | Hover effect |

#### Usage

```tsx
<Card title="Asset Card" subtitle="3D Model" hoverable>
  {/* Card content */}
</Card>
```

### Icon Component

#### Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | string | Yes | - | Icon name |
| `size` | number | No | 24 | Icon size |
| `color` | string | No | 'currentColor' | Icon color |
| `onClick` | () => void | No | - | Click handler |

#### Usage

```tsx
<Icon name="folder" size={20} color="#007acc" />
```

## Interface Specifications

### Header Component

#### Structure

```
<Header>
  <Logo>AMAR Engine</Logo>
  <NavMenu>
    <NavItem>File</NavItem>
    <NavItem>Edit</NavItem>
    <NavItem>View</NavItem>
    <NavItem>Help</NavItem>
  </NavMenu>
  <RightActions>
    <GithubLink />
    <LanguageSelector />
  </RightActions>
</Header>
```

#### Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `title` | string | No | 'AMAR Engine' | Header title |
| `onMenuClick` | (menu: string) => void | No | - | Menu click handler |

### FileExplorer Component

#### Structure

```
<FileExplorer>
  <FileExplorerHeader>
    <Breadcrumb />
    <ActionButtons>
      <Button>Open Folder</Button>
      <Button>Refresh</Button>
    </ActionButtons>
  </FileExplorerHeader>
  <FileList>
    <FileItem>
      <FileIcon />
      <FileName />
      <FileSize />
      <FileModified />
    </FileItem>
  </FileList>
</FileExplorer>
```

#### Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `onFolderSelect` | (path: string) => void | No | - | Folder select handler |
| `onFileSelect` | (file: FileItem) => void | No | - | File select handler |

### MediaUploader Component

#### Structure

```
<MediaUploader>
  <UploadArea>
    <UploadIcon />
    <UploadText>Drag and drop files here</UploadText>
    <Button>Select Files</Button>
  </UploadArea>
  <UploadedFiles>
    <UploadedFileItem>
      <FileIcon />
      <FileName />
      <FileSize />
      <RemoveButton />
    </UploadedFileItem>
  </UploadedFiles>
</MediaUploader>
```

#### Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `onMediaUpload` | (files: File[]) => void | Yes | - | Media upload handler |
| `accept` | string | No | '*' | Accepted file types |
| `multiple` | boolean | No | true | Allow multiple files |

### SystemViewport Component

#### Structure

```
<SystemViewport>
  <ViewportHeader>
    <ViewportTitle>3D Preview</ViewportTitle>
    <ViewportControls>
      <Button>Orbit</Button>
      <Button>Pan</Button>
      <Button>Zoom</Button>
    </ViewportControls>
  </ViewportHeader>
  <Canvas>
    {/* 3D rendering area */}
  </Canvas>
  <ViewportFooter>
    <ObjectCount>Objects: 5</ObjectCount>
    <FPS>60 FPS</FPS>
  </ViewportFooter>
</SystemViewport>
```

#### Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `scene` | Scene | No | - | 3D scene object |
| `selectedObject` | Object3D | No | - | Selected object |
| `onObjectSelect` | (object: Object3D) => void | No | - | Object select handler |

### SceneGraph Component

#### Structure

```
<SceneGraph>
  <SceneGraphHeader>
    <Title>Scene Graph</Title>
    <SearchInput placeholder="Search objects" />
  </SceneGraphHeader>
  <ObjectTree>
    <TreeNode>
      <TreeNodeLabel>Object 1</TreeNodeLabel>
      <TreeNodeChildren>
        <TreeNode>Object 1.1</TreeNode>
        <TreeNode>Object 1.2</TreeNode>
      </TreeNodeChildren>
    </TreeNode>
  </ObjectTree>
</SceneGraph>
```

#### Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `scene` | Scene | Yes | - | 3D scene object |
| `selectedObject` | Object3D | No | - | Selected object |
| `onObjectSelect` | (object: Object3D) => void | Yes | - | Object select handler |

## Theme System

### Theme Structure

```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      elevated: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      quaternary: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  typography: {
    fontFamily: string;
    fontSize: {
      h1: string;
      h2: string;
      h3: string;
      h4: string;
      body: string;
      bodySmall: string;
      bodyLarge: string;
    };
    fontWeight: {
      light: number;
      regular: number;
      medium: number;
      semiBold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
```

### Theme Provider

```tsx
<ThemeProvider theme={darkTheme}>
  <App />
</ThemeProvider>
```

### Theme Switching

```tsx
const [theme, setTheme] = useState<'dark' | 'light'>('dark');

const toggleTheme = () => {
  setTheme(theme === 'dark' ? 'light' : 'dark');
};

return (
  <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
    <Button onClick={toggleTheme}>
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </Button>
  </ThemeProvider>
);
```

## Responsive Design

### Breakpoints

| Breakpoint | Width | Device | Layout |
|------------|-------|--------|--------|
| Mobile | < 768px | Phones | Single column, collapsed sidebar |
| Tablet | 768px - 1024px | Tablets | Two column layout, adjustable panels |
| Desktop | 1024px - 1440px | Laptops | Three column layout, full functionality |
| Large Desktop | > 1440px | Desktops | Expanded workspace, additional panels |

### Layout Adaptations

- **Mobile**: Stacked panels, collapsible navigation, simplified controls
- **Tablet**: Side-by-side panels, compact controls, touch-optimized interface
- **Desktop**: Full panel layout, keyboard-optimized controls, detailed information
- **Large Desktop**: Expanded panels, additional toolbars, advanced controls

### Implementation

```tsx
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Usage
const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
const isDesktop = useMediaQuery('(min-width: 1024px)');
```

## Accessibility

### WCAG Compliance

- **WCAG 2.1 Level AA** compliance as minimum standard
- **Keyboard Navigation**: All functionality accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: Minimum 4.5:1 contrast for text, 3:1 for UI components

### Implementation Guidelines

- Use semantic HTML elements
- Add appropriate ARIA attributes
- Ensure sufficient color contrast
- Provide alternative text for images
- Implement keyboard navigation
- Test with screen readers

### Common Patterns

- **Buttons**: Use `<button>` elements for interactive controls
- **Links**: Use `<a>` elements for navigation
- **Forms**: Associate labels with inputs using `htmlFor`
- **Lists**: Use `<ul>` and `<ol>` for lists
- **Headings**: Use proper heading hierarchy

## Implementation Guidelines

### Component Development

1. **File Structure**: One component per file/folder
2. **Naming Convention**: PascalCase for components, camelCase for props
3. **Styling**: Use styled-components for component-level styling
4. **Props**: Define clear TypeScript interfaces for all component props
5. **Documentation**: Document all components and props
6. **Testing**: Write unit tests for all components

### Styling Best Practices

1. **Use CSS Variables**: Leverage theme variables for consistent styling
2. **Avoid Hardcoding**: No magic numbers or colors
3. **Responsive Design**: Use relative units and media queries
4. **Performance**: Optimize CSS selectors, avoid unnecessary nesting
5. **Consistency**: Follow the design system guidelines

### Code Organization

```
src/
  ui/
    components/
      Button/
        index.tsx
        Button.tsx
        Button.styles.ts
        Button.test.tsx
      Input/
        index.tsx
        Input.tsx
        Input.styles.ts
        Input.test.tsx
    styles/
      globalStyles.ts
      theme.ts
      variables.ts
    utils/
      useMediaQuery.ts
      useTheme.ts
```

### Performance Optimization

1. **Component Memoization**: Use `React.memo` for expensive components
2. **Lazy Loading**: Use `React.lazy` for code splitting
3. **State Management**: Optimize state updates to avoid unnecessary re-renders
4. **Style Optimization**: Use CSS-in-JS efficiently, avoid dynamic styles when possible
5. **Image Optimization**: Use appropriate image formats and sizes

## Conclusion

This design system provides a comprehensive set of guidelines and components for building a consistent, professional interface for AMAR Engine. By following these specifications, the development team can create a cohesive user experience that reflects the technical nature of the product while ensuring usability and accessibility.

For questions or additions to this design system, please contact the design team.