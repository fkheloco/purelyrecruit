# Notion Formatting & Publishing Guide

> **Purpose:** Training reference for publishing well-formatted, on-brand content to Notion via MCP API. Always consult this before publishing to Notion.

---

## Notion-Flavored Markdown Quick Reference

### Block Types

| Element | Syntax | Notes |
|---------|--------|-------|
| Heading 1 | `# Text` | Use sparingly — usually once per page |
| Heading 2 | `## Text` | Main sections |
| Heading 3 | `### Text` | Subsections |
| Paragraph | Plain text | Separate with blank lines |
| Bullet List | `* Item` or `- Item` | Indent with 2 spaces for nesting |
| Numbered List | `1. Item` | Auto-increments |
| To-Do | `[] Task` or `[x] Done` | Checkbox items |
| Toggle | `▶ Header` + indented content | Collapsible sections — use for dense info |
| Quote | `> Text` | Citations, callouts, emphasis |
| Callout | `> 💡 Text` (emoji-prefixed quote) | Tips, warnings, notes |
| Code Block | ` ```language ... ``` ` | Syntax highlighting |
| Divider | `---` | Visual section breaks |
| Table | Pipe + dash syntax | Keep simple; use databases for complex data |
| Image | `![Alt](URL)` | URL must be publicly accessible |
| Link | `[Text](URL)` | Standard markdown links |

### Inline Formatting

| Format | Syntax |
|--------|--------|
| **Bold** | `**text**` |
| *Italic* | `*text*` or `_text_` |
| ~~Strikethrough~~ | `~~text~~` |
| `Inline code` | `` `code` `` |
| Link | `[display](url)` |

### Color System

**Text Colors:** default, gray, brown, orange, yellow, green, blue, purple, pink, red

**Background Colors:** Same names with `_background` suffix

**Usage in enhanced markdown:** `text {color=blue}` or `text {color=blue_background}`

**Heading colors:** `## Section Title {color="blue"}`

---

## Purely Works Brand Color Mapping for Notion

### When to Use Service-Specific Colors

| Service | Color Name | Hex | Notion Color Equivalent |
|---------|-----------|-----|------------------------|
| Proposals | Pacific Blue | #0695C2 | `blue` |
| Development | Soft Purple | #A980D5 | `purple` |
| Recruitment | Keppel | #3CB3A2 | `green` |
| Consulting / Implementation | Fire Bush | #DC9645 | `orange` |
| Flex | Fuzzy Wuzzy Brown | #C66860 | `red` or `brown` |
| Primary (Chambray) | — | #455E7F | `blue` (default) |
| Accent (Metallic Gold) | — | #D7A839 | `yellow` or `orange` |

### Application Rules

* **General company pages:** Use blue (Chambray) for headings and callouts
* **Service-specific pages:** Use the service accent color for that section's callouts and highlights
* **Important alerts / warnings:** Use red or orange backgrounds
* **Tips and best practices:** Use blue or green callout backgrounds
* **Notes and context:** Use gray callout backgrounds

---

## Formatting Best Practices

### Page Structure Template

```markdown
# Page Title

> 💡 One-line summary of what this page covers and who it's for

---

## Section 1

Content here. Keep paragraphs short (1-3 sentences).

### Subsection

* Bullet points for lists
* Keep bullets substantive (1-2 sentences each)

---

## Section 2

More content...

▶ Detailed Reference
  Hidden content that not everyone needs to see immediately.
  Use toggles to keep the page scannable.

---

> 📌 **Key Takeaway:** End sections with a clear takeaway when helpful.
```

### When to Use What

| Element | When to Use |
|---------|-------------|
| **H1** | Page title only (once per page) |
| **H2** | Major sections — the "chapters" of the page |
| **H3** | Subsections within an H2 |
| **Callout (💡)** | Tips, summaries, key info at top of page |
| **Callout (⚠️)** | Warnings, important caveats |
| **Callout (✅)** | Success criteria, completed items |
| **Callout (📌)** | Key takeaways, pinned info |
| **Callout (🔗)** | Links to related pages or resources |
| **Toggle** | Dense reference info, FAQs, step-by-step details |
| **Quote** | Cited text, company philosophy, mission statements |
| **Table** | Comparisons, reference data, schedules |
| **Divider** | Between major sections (not between every paragraph) |
| **To-Do** | Action items, checklists |
| **Code block** | Technical content, configuration, templates |
| **Bullet list** | 3+ related items, features, requirements |
| **Numbered list** | Sequential steps, ranked items, processes |

### Formatting Don'ts

* **Don't** wall-of-text — break into short paragraphs with headers
* **Don't** nest more than 2 levels deep in lists
* **Don't** use dividers between every section — save for major breaks
* **Don't** bold entire paragraphs — bold key phrases only
* **Don't** use H1 more than once per page
* **Don't** mix bullet styles (stick to `*` per Farid's preference)
* **Don't** leave pages without a summary callout at the top

### Visual Hierarchy Rules

1. **Top of page:** Icon + H1 title + summary callout
2. **Sections:** H2 with divider above
3. **Details:** H3 for subsections, toggles for deep-dives
4. **Emphasis:** Callouts for important info, bold for key phrases
5. **Navigation:** Link to related pages, use breadcrumbs when helpful
6. **Closing:** Key takeaway or next steps

---

## Publishing Checklist

Before publishing any page to Notion:

- [ ] Page has an appropriate emoji icon
- [ ] H1 title is clear and descriptive
- [ ] Summary callout at top explains purpose and audience
- [ ] Sections use H2 with dividers
- [ ] No walls of text — short paragraphs (1-3 sentences)
- [ ] Lists use asterisk bullets (Farid's preference)
- [ ] Service-specific content uses correct accent color
- [ ] Toggle blocks hide dense reference material
- [ ] Tables are used for comparisons and structured data
- [ ] Links to related pages are included
- [ ] Spelling and grammar checked
- [ ] Brand voice is warm, collaborative, direct

---

## MCP API Notes

### Creating Pages (notion-create-pages)

* `content` field accepts Notion-flavored Markdown
* `properties` field sets page metadata (title, etc.)
* `parent` can be `page_id` or `data_source_id`
* Don't include page title in content — set it in properties

### Updating Pages (notion-update-page)

* Use `replace_content` to replace entire page body
* Use `replace_content_range` with `selection_with_ellipsis` for targeted edits
* Use `insert_content_after` to add content after a specific point
* Always fetch the page first to get current content

### Key Limitations

* Columns not creatable via Markdown (UI only)
* Synced blocks not creatable via API
* Inline databases not creatable via Markdown
* Colors require the `{color="name"}` syntax in enhanced markdown
* Complex callout styling may need direct block API calls

---

*Last updated: February 2026*
