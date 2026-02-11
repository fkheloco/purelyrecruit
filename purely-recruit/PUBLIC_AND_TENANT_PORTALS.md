# Public Job Board & Tenant-Branded Job Portals (Portals 3 & 4)

This document describes the implementation of the public job board and tenant-branded job portals for the Purely Recruit platform.

## Overview

Two new public-facing job portal systems have been built:

1. **Portal 3: Public Job Board** (`/jobs`) - Accessible to anyone without authentication
2. **Portal 4: Tenant-Branded Job Portals** (`/[tenant]/jobs`) - Custom-branded career sites for each tenant

Both portals feature:
- No authentication required for browsing
- Search and filtering capabilities
- Multi-step application forms
- Responsive design with brand color support
- Production-ready error handling and loading states

---

## Portal 3: Public Job Board

### Files Created

#### Layout
- **`src/app/jobs/layout.tsx`**
  - Navigation with Sign In/Up links
  - Logo and branding
  - Footer with company info
  - Mobile-responsive header

#### Pages
- **`src/app/jobs/page.tsx`** (Server Component)
  - Lists all published jobs across all tenants
  - Search by keyword (job title, keywords)
  - Filters: Location Type (onsite/remote/hybrid), Employment Type (full-time/part-time/contract/temp/intern)
  - Job cards show: title, company, location, employment type, salary range, posted date
  - Suspense boundary with loading skeleton
  - Query: Selects active jobs joined with tenant data

- **`src/app/jobs/[jobId]/page.tsx`** (Server Component)
  - Full job detail page with:
    - Job title, company logo/name
    - Location, employment type, salary, posted date
    - Description and requirements sections
    - "What we're looking for" list (goodIndicators)
    - Company profile section with website link
    - "Apply Now" button (redirects to /sign-up if not logged in)

- **`src/app/jobs/[jobId]/apply/page.tsx`** (Client Component)
  - Multi-step application form:
    - **Step 1**: Personal info (first name, last name, email, phone, city, state)
    - **Step 2**: Resume upload (drag & drop supported)
    - **Step 3**: Cover letter (optional textarea)
    - **Step 4**: Review & Submit
  - Creates candidate and application records
  - Success confirmation with return link

### Database Queries

**Get Published Jobs** (`src/app/jobs/page.tsx`):
```typescript
db.select({...fields...})
  .from(jobOpenings)
  .innerJoin(tenants, eq(jobOpenings.tenantId, tenants.id))
  .where(and(
    eq(jobOpenings.status, "active"),
    // + optional searchQuery, locationFilter, employmentFilter
  ))
```

**Get Job Detail** (`src/app/jobs/[jobId]/page.tsx`):
```typescript
db.select({...fields...})
  .from(jobOpenings)
  .innerJoin(tenants, eq(jobOpenings.tenantId, tenants.id))
  .where(and(
    eq(jobOpenings.id, jobId),
    eq(jobOpenings.status, "active")
  ))
```

---

## Portal 4: Tenant-Branded Job Portals

### Files Created

#### Layout
- **`src/app/[tenant]/layout.tsx`**
  - Dynamic tenant lookup by slug
  - Displays tenant logo, name, and branding
  - "Powered by Purely Recruit" footer text
  - Navigation with tenant-branded Apply button
  - Responsive header with company links
  - Uses tenant's primaryColor (#455E7F default) and accentColor (#D7A839 default)
  - Fallback colors for null values

#### Pages
- **`src/app/[tenant]/jobs/page.tsx`** (Server Component)
  - Lists only the specific tenant's published jobs
  - Same search and filter capabilities as public board
  - Tenant-branded styling throughout
  - Suspense boundary with loading skeleton

- **`src/app/[tenant]/jobs/[jobId]/page.tsx`** (Server Component)
  - Full job detail page branded to the tenant
  - Tenant logo in hero section
  - "What we're looking for" indicators with tenant color
  - Company profile uses tenant's primary color
  - "About [Company]" section with website link
  - Apply button uses tenant's primary color
  - Query restricts to jobs belonging to the tenant

- **`src/app/[tenant]/apply/[jobId]/page.tsx`** (Client Component)
  - Identical multi-step form to public board
  - Tenant-branded styling (colors, buttons)
  - Fetches tenant data for dynamic branding
  - Success page shows tenant name
  - All form elements use tenant's primary color for focus/hover states

### Database Queries

**Get Tenant** (`src/app/[tenant]/layout.tsx`):
```typescript
db.select()
  .from(tenants)
  .where(eq(tenants.slug, slug))
```

**Get Tenant Jobs** (`src/app/[tenant]/jobs/page.tsx`):
```typescript
db.select({...fields...})
  .from(jobOpenings)
  .where(and(
    eq(jobOpenings.tenantId, tenantId),
    eq(jobOpenings.status, "active"),
    // + optional searchQuery, locationFilter, employmentFilter
  ))
```

**Get Tenant Job Detail** (`src/app/[tenant]/jobs/[jobId]/page.tsx`):
```typescript
db.select({...fields...})
  .from(jobOpenings)
  .where(and(
    eq(jobOpenings.id, jobId),
    eq(jobOpenings.tenantId, tenantId),
    eq(jobOpenings.status, "active")
  ))
```

---

## API Modifications

### Updated: `src/app/api/tenants/route.ts`
- Added public endpoint support for tenant lookup by slug
- `/api/tenants?slug=company-name` returns tenant data without authentication
- Existing authenticated endpoints remain protected

### Updated: `src/app/api/candidates/route.ts`
- POST now allows public candidate creation when source is `career_site` or `tenant_career_site`
- Maintains existing authentication for other sources and GET operations

### Updated: `src/app/api/applications/route.ts`
- POST now allows public applications when source is `career_site`
- Automatically retrieves tenantId from job if not provided
- Maintains existing authentication for authenticated users
- Added `jobOpenings` import for tenant lookup

---

## Middleware Configuration

The existing `middleware.ts` already supports public routes:
```typescript
const isPublicRoute = createRouteMatcher([
  "/jobs(.*)",           // Public job board
  "/:tenant/jobs(.*)",   // Tenant job board
  "/:tenant/apply(.*)",  // Tenant applications
]);
```

---

## Brand Colors & Styling

### Public Job Board
- Uses Purely Works brand colors:
  - Primary: Chambray #455E7F
  - Accent: Gold #D7A839
  - Service Accent (Recruiting): Keppel #3CB3A2 (Apply button)

### Tenant Job Portals
- Dynamically uses tenant's:
  - `primaryColor` (default #455E7F)
  - `accentColor` (default #D7A839)
  - `logoUrl` for company branding
- All style attributes include fallbacks for null values

---

## Key Features

### Search & Filtering
- **Keyword Search**: Full-text search on job title
- **Location Filter**: onsite, remote, hybrid
- **Employment Type Filter**: full_time, part_time, contract, temp, intern
- Form-based filtering with auto-submit on change

### Job Cards Display
- Job title
- Company name and logo (tenant portal)
- Location (city, state)
- Employment type badge
- Location type badge (onsite/remote/hybrid)
- Salary range (when available)
- Posted date
- Hover effects for interactivity

### Application Flow
- Multi-step form to reduce cognitive load
- Resume upload with drag & drop support
- Optional cover letter
- Review step before submission
- Success confirmation page
- Automatic candidate and application creation
- Background job enqueueing for AI scoring

### Error Handling
- User-friendly error messages
- Network error handling in application form
- File upload validation
- Form validation with required field checks
- Loading states for async operations

### Responsive Design
- Mobile-first approach
- Flexbox-based layouts
- Touch-friendly form inputs
- Responsive grid for job cards
- Mobile-optimized navigation

---

## Data Models

### Job (jobOpenings)
- id, title, description
- locationCity, locationState, locationType
- employmentType
- salaryMin, salaryMax
- requirements, goodIndicators
- status ('active' for published)
- createdAt, updatedAt

### Tenant
- id, slug, name
- logoUrl, primaryColor, accentColor
- website, description
- isActive

### Candidate (created during application)
- email, firstName, lastName, phone
- locationCity, locationState
- source ('career_site' or 'tenant_career_site')

### Application
- candidateId, jobOpeningId, tenantId
- resumeId (from file upload)
- source ('career_site')
- status ('new')
- appliedAt

---

## File Structure

```
src/app/
├── jobs/                           # Public Job Board (Portal 3)
│   ├── layout.tsx                 # Navigation & layout
│   ├── page.tsx                   # Job listings
│   └── [jobId]/
│       ├── page.tsx               # Job detail
│       └── apply/
│           └── [jobId]/
│               └── page.tsx       # Application form
│
└── [tenant]/                       # Tenant Portals (Portal 4)
    ├── layout.tsx                 # Tenant branding & layout
    ├── jobs/
    │   ├── page.tsx              # Tenant job listings
    │   └── [jobId]/
    │       └── page.tsx          # Tenant job detail
    └── apply/
        └── [jobId]/
            └── page.tsx          # Tenant application form

src/app/api/
├── tenants/route.ts              # UPDATED: Added public slug lookup
├── candidates/route.ts           # UPDATED: Allow public creation
└── applications/route.ts         # UPDATED: Allow public applications
```

---

## URL Examples

### Public Job Board
- Browse all jobs: `/jobs`
- Search jobs: `/jobs?q=designer&location=remote`
- View job detail: `/jobs/abc-123-def`
- Apply to job: `/jobs/abc-123-def/apply`

### Tenant-Branded Portal
- Browse tenant jobs: `/acme-corp/jobs`
- Search tenant jobs: `/acme-corp/jobs?q=engineer`
- View tenant job detail: `/acme-corp/jobs/abc-123-def`
- Apply to tenant job: `/acme-corp/apply/abc-123-def`

---

## Testing Checklist

### Public Job Board
- [ ] View all published jobs
- [ ] Search by keyword
- [ ] Filter by location type
- [ ] Filter by employment type
- [ ] View job detail page
- [ ] Click Apply button (not logged in)
- [ ] Complete application form (all steps)
- [ ] Submit application
- [ ] See success confirmation

### Tenant-Branded Portal
- [ ] Navigate to valid tenant slug
- [ ] See tenant branding (logo, colors, name)
- [ ] View tenant's jobs only
- [ ] Apply to tenant job
- [ ] See tenant name on success page
- [ ] Test with missing/null tenant colors (should use fallbacks)

### Error Cases
- [ ] Invalid job ID (404)
- [ ] Invalid tenant slug (404)
- [ ] Incomplete application form (validation errors)
- [ ] File upload failure (error message)
- [ ] Network error during submission (error handling)

---

## Production Considerations

1. **SEO**: Job pages are server-rendered for better search engine indexing
2. **Performance**:
   - Suspense boundaries for progressive rendering
   - Memoized components where appropriate
   - Efficient database queries with proper joins
3. **Security**:
   - Form validation on both client and server
   - Proper error messages (no sensitive data exposed)
   - CORS and rate limiting should be configured at deployment level
4. **Accessibility**:
   - Semantic HTML with proper headings
   - Form labels and ARIA attributes
   - Keyboard navigation support
5. **Analytics**: Consider adding tracking for job views and applications

---

## Future Enhancements

- [ ] Email confirmation after application submission
- [ ] Candidate portal to track applications
- [ ] Admin preview mode for unpublished jobs
- [ ] Job posting analytics
- [ ] Sharing functionality (LinkedIn, Twitter)
- [ ] Save jobs for later
- [ ] Email alerts for new jobs matching criteria
- [ ] AI-powered job recommendations
- [ ] Rich text editor for job descriptions
- [ ] Multi-language support

