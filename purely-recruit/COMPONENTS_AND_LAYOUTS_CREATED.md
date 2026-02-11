# Purely Recruit — Components and Layouts Created

## Summary
All shared UI components and layout files have been successfully created for the Purely Recruit platform.

---

## Shared UI Components (src/components/shared/)

### 1. **page-header.tsx**
- Reusable page header component
- Props: `title`, `description?`, `children?`
- Displays page title, optional description, and optional action children
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/components/shared/page-header.tsx`

### 2. **stat-card.tsx**
- Dashboard statistic card component
- Props: `label`, `value`, `change?`, `icon?`
- Shows metric label, value, optional trend change, and optional icon
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/components/shared/stat-card.tsx`

### 3. **score-badge.tsx**
- Candidate score display badge
- Props: `score`, `size?` (sm|md|lg)
- Uses `getScoreCategory()` from constants for color-coding
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/components/shared/score-badge.tsx`

### 4. **status-badge.tsx**
- Status indicator badge for applications and jobs
- Props: `status`, `type?` (application|job)
- Uses `APPLICATION_STATUSES` and `JOB_STATUSES` from constants
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/components/shared/status-badge.tsx`

### 5. **loading-skeleton.tsx**
- Skeleton loaders for loading states
- Exports: `LoadingSkeleton()` and `CardSkeleton()`
- Configurable number of rows with animate-pulse effect
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/components/shared/loading-skeleton.tsx`

### 6. **notification-bell.tsx**
- Header notification bell component (client-side)
- Uses `useNotifications()` hook for unread count
- Shows red badge with count (9+ cap)
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/components/shared/notification-bell.tsx`

### 7. **file-upload.tsx**
- Drag-and-drop file upload component (client-side)
- Props: `onUpload()`, `accept?`, `label?`
- Accepts PDF, DOC, DOCX files (default)
- Shows upload state and file name
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/components/shared/file-upload.tsx`

### 8. **data-table.tsx**
- Generic reusable data table component (client-side)
- Generic types support for any data shape
- Features: custom columns, row click handler, empty state
- Props: `data[]`, `columns[]`, `onRowClick?`, `emptyMessage?`
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/components/shared/data-table.tsx`

---

## Layout and Page Files

### Root Level (src/app/)

#### 1. **layout.tsx** (Root Layout)
- ClerkProvider integration for authentication
- Inter font setup from Google Fonts
- Metadata configuration
- Sets up base HTML structure with Tailwind
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/app/layout.tsx`

#### 2. **page.tsx** (Home Page)
- Public landing page
- Auto-redirects authenticated users to `/recruiter/dashboard`
- Displays Purely Recruit brand (Chambray #455E7F + Gold #D7A839)
- CTA buttons: Sign In, Create Account, Browse Jobs
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/app/page.tsx`

### Auth Group (src/app/(auth)/)

#### 3. **layout.tsx** (Auth Layout)
- Centered flex layout for authentication pages
- Applies gray-50 background
- Wraps all sign-in/sign-up flows
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/app/(auth)/layout.tsx`

#### 4. **sign-in/[[...sign-in]]/page.tsx**
- Clerk SignIn component
- Catch-all route for `/sign-in` and `/sign-in/*`
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`

#### 5. **sign-up/[[...sign-up]]/page.tsx**
- Clerk SignUp component
- Catch-all route for `/sign-up` and `/sign-up/*`
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`

### Platform Group (src/app/(platform)/)

#### 6. **layout.tsx** (Platform Layout)
- Protected layout requiring authentication
- Redirects unauthenticated users to `/sign-in`
- Wraps all recruiter/candidate platform routes
- Uses server-side Clerk auth check
- Location: `/sessions/nifty-ecstatic-gauss/purely-recruit/src/app/(platform)/layout.tsx`

---

## File Structure

```
src/
├── components/
│   └── shared/
│       ├── page-header.tsx
│       ├── stat-card.tsx
│       ├── score-badge.tsx
│       ├── status-badge.tsx
│       ├── loading-skeleton.tsx
│       ├── notification-bell.tsx
│       ├── file-upload.tsx
│       └── data-table.tsx
└── app/
    ├── layout.tsx (root)
    ├── page.tsx (home)
    ├── (auth)/
    │   ├── layout.tsx
    │   ├── sign-in/[[...sign-in]]/
    │   │   └── page.tsx
    │   └── sign-up/[[...sign-up]]/
    │       └── page.tsx
    └── (platform)/
        └── layout.tsx
```

---

## Dependencies

All components use:
- **React** (built-in with Next.js)
- **Tailwind CSS** (for styling)
- **lucide-react** (for icons — already in package.json)
- **@clerk/nextjs** (for authentication — already in package.json)

Components reference existing utilities:
- `@/lib/constants` (getScoreCategory, APPLICATION_STATUSES, JOB_STATUSES)
- `@/hooks/use-notifications` (useNotifications hook)

---

## Usage Examples

### PageHeader
```tsx
<PageHeader 
  title="Candidates" 
  description="Manage your candidate pipeline"
>
  <button>Add Candidate</button>
</PageHeader>
```

### StatCard
```tsx
<StatCard
  label="Applications This Month"
  value={342}
  change="+12% vs last month"
  icon={<TrendingUp />}
/>
```

### ScoreBadge
```tsx
<ScoreBadge score={85} size="md" />  // Shows "85" in colored badge
```

### DataTable
```tsx
<DataTable<Candidate>
  data={candidates}
  columns={[
    { key: 'name', header: 'Name' },
    { 
      key: 'score', 
      header: 'Score',
      render: (item) => <ScoreBadge score={item.score} />
    }
  ]}
  onRowClick={(candidate) => navigate(`/candidate/${candidate.id}`)}
/>
```

### FileUpload
```tsx
<FileUpload
  label="Upload Resume"
  onUpload={async (file) => {
    await uploadToS3(file);
  }}
/>
```

---

## Brand Colors Used

- **Chambray**: #455E7F (primary blue)
- **Gold**: #D7A839 (accent)
- **Gray palette**: Standard Tailwind grays for supporting elements

---

## Authentication Flow

1. Unauthenticated users see home page with sign-in/sign-up CTAs
2. Auth pages wrapped in centered layout
3. Authenticated users redirected to platform routes
4. Platform routes protected by auth check in layout
5. Clerk handles session management

---

## Notes

- All layout and page files use server components by default
- Client-side components marked with `"use client"` directive
- Components are fully typed with TypeScript
- Responsive design using Tailwind utilities
- Accessibility considerations: semantic HTML, keyboard navigation support

---

**Created**: 2026-02-11
**Project**: Purely Recruit
**Status**: Complete
