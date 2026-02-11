# Purely Works Logo Files

## Available Logo Variations

### Primary Logos

**Stacked Logo (Vertical)**
- File: `primary/purely-works-logo-stacked.png`
- Icon above "PURELY WORKS" wordmark
- Best for: Square spaces, social media posts, document covers

**Horizontal Logo**
- File: `primary/purely-works-logo-horizontal.png`
- Icon beside "PURELY WORKS" wordmark
- Best for: Headers, email signatures, wide banners, letterheads

**Horizontal Logo (Alternative)**
- File: `primary/purely-works-logo-horizontal-alt.png`
- Slightly different spacing variation
- Best for: Alternative layouts when needed

### Icon Only

**Square Icon**
- File: `icon/purely-works-icon-square.png`
- Clean square version of PW mark
- Best for: App icons, favicons, tight spaces, avatars

**Rounded Icon**
- File: `icon/purely-works-icon-rounded.png`
- Icon with rounded corners
- Best for: Social media profiles, modern UI elements

### Favicons (All Sizes)

Generated from square icon:
- `favicon/favicon.ico` - Multi-size (16×16, 32×32, 48×48)
- `favicon/favicon-16x16.png` - Browser tab
- `favicon/favicon-32x32.png` - Browser tab HD
- `favicon/favicon-48x48.png` - Desktop shortcut
- `favicon/apple-touch-icon.png` - 180×180 for iOS
- `favicon/android-chrome-192x192.png` - Android home screen
- `favicon/android-chrome-512x512.png` - Android splash screen

---

## Logo Colors

**Primary Colors (All Versions):**
- Chambray (Blue): #455E7F, RGB(69, 94, 127)
- Metallic Gold (Yellow): #D7A839, RGB(215, 168, 57)
- Black stroke/outline: #000000

**Background:**
- All current logos: Transparent background
- Use on white or light backgrounds for best contrast

---

## Usage Guidelines

**Clear Space:**
- Maintain minimum clear space around logo equal to the height of the "P" in the icon
- Never place logo on busy backgrounds without sufficient contrast

**Minimum Sizes:**
- Horizontal logo: 150px wide (digital), 1.5" wide (print)
- Stacked logo: 120px wide (digital), 1" wide (print)
- Icon only: 32px × 32px (digital), 0.5" (print)

**Preferred Backgrounds:**
- White or very light backgrounds
- Black or dark backgrounds (create reversed/white version when needed)

**What NOT to Do:**
- Don't rotate or skew the logo
- Don't change the colors
- Don't add effects (shadows, glows, outlines)
- Don't separate the icon from wordmark in full logo versions
- Don't place on Chambray or Metallic Gold backgrounds (low contrast)
- Don't stretch or distort proportions

---

## File Organization

```
logos/
├── primary/
│   ├── purely-works-logo-stacked.png ✅
│   ├── purely-works-logo-horizontal.png ✅
│   └── purely-works-logo-horizontal-alt.png ✅
├── icon/
│   ├── purely-works-icon-square.png ✅
│   └── purely-works-icon-rounded.png ✅
└── favicon/
    ├── favicon.ico ✅
    ├── favicon-16x16.png ✅
    ├── favicon-32x32.png ✅
    ├── favicon-48x48.png ✅
    ├── apple-touch-icon.png ✅
    ├── android-chrome-192x192.png ✅
    └── android-chrome-512x512.png ✅
```

---

## Still Needed

**White/Reversed Versions:**
- [ ] White version for dark backgrounds
- [ ] Can be created when needed from Canva source files

**Vector Formats:**
- [ ] SVG versions (scalable, preferred for web)
- [ ] Export from Canva as SVG for best quality

---

## HTML Favicon Implementation

Add to `<head>` section of your website:

```html
<link rel="icon" type="image/x-icon" href="/brand/logos/favicon/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/brand/logos/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/brand/logos/favicon/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/brand/logos/favicon/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/brand/logos/favicon/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/brand/logos/favicon/android-chrome-512x512.png">
```

---

*Last updated: February 2026*
