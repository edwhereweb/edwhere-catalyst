---
name: Edwhere Logic
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#424754'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#6b38d4'
  on-secondary: '#ffffff'
  secondary-container: '#8455ef'
  on-secondary-container: '#fffbff'
  tertiary: '#3f6700'
  on-tertiary: '#ffffff'
  tertiary-container: '#518200'
  on-tertiary-container: '#f9ffea'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#acf847'
  tertiary-fixed-dim: '#91db2a'
  on-tertiary-fixed: '#102000'
  on-tertiary-fixed-variant: '#304f00'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 40px
  gutter: 16px
  stack-overlap: -12px
---

## Brand & Style

The design system is engineered for ambitious cybersecurity and IT students, blending the precision of technical tools with the high-energy motivation of modern productivity platforms. The aesthetic is **Corporate Modern** with a **Glassmorphism** edge, utilizing depth and vibrant accents to break the monotony of traditional academic interfaces.

The UI should feel disciplined but not rigid. It leverages high-contrast surface variants—pairing deep slate cards against airy, off-white backgrounds—to create a clear visual hierarchy for task management. The emotional response is one of "managed intensity": a calm, organized environment that celebrates progress through vivid color cues and fluid geometry.

## Colors

The palette is anchored by a high-performance **Electric Blue** and **Violet** duo, symbolizing the intersection of logic and creativity. 

- **Backgrounds**: Use `#F8FAFC` for the main canvas. This soft blue-grey tint reduces eye strain during long study sessions.
- **Surface Strategy**: Employ a "High-Contrast Surface" model. Most containers are pure white, but critical summary widgets or "Current Focus" cards should use the **Surface Variant (Dark)** `#1E293B` with white or electric blue text to command attention.
- **Accents**: Use Lime for growth metrics, Coral for urgent deadlines, and Yellow for "carry-forward" indicators or warnings.

## Typography

The system utilizes a dual-font strategy: **Plus Jakarta Sans** for headlines to provide a welcoming, modern geometric feel, and **Inter** for body text to ensure maximum legibility for technical content.

- **Headlines**: Use heavy weights (700+) for section titles to create a strong vertical rhythm.
- **Labels**: Small labels and status chips should use `label-md` with uppercase styling and increased tracking for a professional, "system-ready" look.
- **Numbers**: Use Inter for tabular data and progress percentages to maintain a technical, clean appearance.

## Layout & Spacing

The layout follows a **Fluid Grid** philosophy with generous internal margins to maintain a premium feel. 

- **Mobile**: 4-column grid with 20px side margins. 
- **Desktop**: 12-column grid with a max-width of 1440px.
- **Stacked Cards**: For "Pending Tasks," use a vertical stack where cards overlap by `-12px`, creating a physical "deck" metaphor that the user can expand.
- **Safe Areas**: Elements should never be closer than 16px to each other unless they are part of a logical group (e.g., a header and its sub-label).

## Elevation & Depth

This design system uses **Ambient Shadows** and **Tonal Layers** to define the interface.

- **Level 0 (Background)**: `#F8FAFC`.
- **Level 1 (Cards)**: White surfaces with a very soft, multi-layered shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)`.
- **Level 2 (Dark Cards)**: Deep Slate surfaces. Shadows here should be darker but tighter to prevent a "floating" effect on dark backgrounds.
- **Interactive States**: Upon hover or press, cards should lift slightly (increasing shadow blur) and scale by 1.01x to provide tactile feedback.

## Shapes

The design system embraces a "Soft Industrial" aesthetic. 

- **Primary Cards**: Use a generous corner radius of `24px` to `32px` (`rounded-xl` to `rounded-2xl`). This softens the technical nature of the app and aligns with high-end lifestyle products.
- **Interactive Elements**: Buttons and Input fields use a standard `12px` radius.
- **Status Chips**: Use full-pill rounding (`999px`) to distinguish them from structural elements.
- **Progress Rings**: Circular stroke ends should be rounded to maintain the friendly visual language.

## Components

### Progress Rings
- **Goal-tracking**: Use circular SVG strokes with a thickness of 8-10px. 
- **Indicator**: A secondary, smaller "orbit" dot or color-coded segment (Yellow) denotes "Carry-forward" progress from previous periods.

### Cards
- **Standard**: White background, 24px padding, subtle shadow.
- **Focus Card**: Surface Dark (`#1E293B`) background. Use Electric Blue for primary buttons inside these cards and semi-transparent white (20% opacity) for secondary borders.

### Buttons
- **Primary**: Solid Electric Blue with white text. Rounded corners at 12px.
- **Secondary**: Ghost style with a thin Electric Blue border or subtle Violet tint background.

### Chips & Status
- **Neutral**: Light grey background with Slate text.
- **Active/Success**: Soft Mint background with Emerald text.
- **Helpful Chips**: Used in forms for quick-selection; these should have a 1px border that becomes solid Electric Blue when selected.

### Bottom Navigation
- Fixed at the bottom of mobile viewports. Use a backdrop-blur (Glassmorphism) effect with 80% opacity white. Use active state icons with a small Violet dot indicator beneath.

### Forms
- Inputs should have a 1px border (`#E2E8F0`). On focus, the border transitions to Electric Blue with a soft 3px blue outer glow.