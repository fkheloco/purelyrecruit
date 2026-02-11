# Purely Works Typography

## Font Stack

### Headings
**Primary:** Inter
- Font family: `'Inter', sans-serif`
- Weights: 400 (Regular), 600 (SemiBold), 700 (Bold)
- Source: Google Fonts
- Usage: All headings (H1-H6), titles, callouts, buttons

### Body Text
**Primary:** Open Sans
- Font family: `'Open Sans', sans-serif`
- Weights: 400 (Regular), 600 (SemiBold)
- Source: Google Fonts
- Usage: Body copy, paragraphs, lists, captions

---

## CSS Implementation

```css
/* Import from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap');

/* Base styles */
body {
  font-family: 'Open Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.6;
  color: #455E7F; /* Chambray */
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #455E7F; /* Chambray */
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

h1 { font-size: 2.5rem; font-weight: 700; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }
h5 { font-size: 1rem; }
h6 { font-size: 0.875rem; }

/* Strong/Bold */
strong, b {
  font-weight: 600;
}
```

---

## Usage Guidelines

**Heading Hierarchy:**
- Use Inter Bold (700) for H1 only
- Use Inter SemiBold (600) for H2-H6
- Maintain consistent size hierarchy

**Body Text:**
- Default to Open Sans Regular (400)
- Use SemiBold (600) sparingly for emphasis
- Never use italic unless absolutely necessary
- Line height: 1.6 for optimal readability

**Color Pairing:**
- Primary text: Chambray (#455E7F) on white backgrounds
- Accent text: Metallic Gold (#D7A839) for CTAs and highlights
- Ensure WCAG AA contrast ratios (minimum 4.5:1)

**Fallback Fonts:**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

---

*Last updated: February 2026*
