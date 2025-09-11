```markdown
# Detailed Plan for Customer Review Application

This plan covers all frontend and backend changes, database schema, API routes, UI/UX considerations, and error handling for the Customer Review application as requested.

---

## 1. Database Setup

### Files:
- `database/init.sql`
- `src/lib/db.ts`

### Changes:
- Extend `init.sql` to add tables:
  - `criteria` (id, name, icon_name)
  - `complaint_related` (id, name)
  - `locations` (id, name) — for location dropdown
  - `customer_reviews` with fields:
    - id (PK)
    - reporting_criteria (enum: 'audience', 'stakeholder')
    - name (string, mandatory)
    - email (string, optional)
    - complaint_category_id (FK to criteria)
    - complaint_related_id (FK to complaint_related)
    - rating (int 1-10)
    - review_text (text)
    - verification_evidence_path (string, nullable)
    - location_id (FK to locations)
    - created_at (timestamp)
- Update `src/lib/db.ts` to add queries for:
  - Fetching master data (criteria, complaint_related, locations)
  - Inserting new customer reviews
  - Aggregating summary reports by month, day, location

---

## 2. Backend API Routes

### Files:
- `src/app/api/reviews/route.ts` (or create new API routes under `src/app/api/`)

### Changes:
- POST `/api/reviews`:
  - Accept form data including file upload (multipart/form-data)
  - Validate mandatory fields (reporting criteria, name, complaint category)
  - Save verification evidence file locally (e.g., `/public/uploads/`)
  - Insert review data into DB
  - Return success or detailed error messages
- GET `/api/reviews/summary`:
  - Query parameters: `period` (day/month), `locationId` (optional)
  - Return aggregated complaint counts grouped by period and location
- GET `/api/masters`:
  - Return master data for criteria, complaint_related, and locations for populating dropdowns

### Error Handling:
- Validate inputs strictly, return 400 with error details on invalid data
- Handle file upload errors gracefully
- Return 500 on unexpected server errors with generic message

---

## 3. Frontend Components and Pages

### Files:
- `src/app/review-form/page.tsx` (new page for the form)
- `src/components/ui/` (create new UI components as needed)
- `src/components/ui/select.tsx` (reuse for dropdowns)
- `src/components/ui/rating.tsx` (new component for NPS rating 1-10)
- `src/components/ui/file-upload.tsx` (new component for verification evidence)

### Changes:

#### Review Form Page
- Build a modern, clean form in English with the following fields:
  1. **Reporting Criteria**: Radio buttons or select dropdown with options "Audience" and "Stakeholder" (mandatory)
  2. **Name**: Text input (mandatory)
  3. **Email**: Text input (optional, validate email format)
  4. **Complaint Category**: Dropdown populated from master criteria, each option displayed with a clean, custom icon (no external icon libs)
  5. **Complaint Related**: Dropdown populated from master complaint_related
  6. **Rating**: Custom interactive rating component from 1 to 10, styled to reflect NPS scoring (e.g., color-coded scale)
  7. **Review / Description**: Textarea for detailed complaint
  8. **Verification Evidence**: File upload input supporting images and documents (max size limit, e.g., 5MB)
  9. **Location**: Dropdown populated from master locations

- Use React Hook Form for form state and validation
- Use Tailwind CSS for styling with spacing, typography, and color consistent with the existing theme
- Provide inline validation error messages
- Submit button disabled until mandatory fields are valid
- On submit, show loading state and toast notifications for success/error using Sonner
- Responsive design for mobile and desktop

#### UI/UX Considerations
- Use accessible form controls with proper labels and aria attributes
- Use spacing and grouping to visually separate form sections
- For complaint category icons, create simple SVG or CSS-based icons (e.g., shapes or letter-based icons) styled with Tailwind colors
- Rating component: clickable numeric buttons or slider with numeric labels 1-10, color-coded (red-yellow-green) to represent NPS detractors, passives, promoters
- File upload: drag-and-drop area with fallback button, show preview of uploaded file name and size
- Use consistent font sizes and weights for readability

---

## 4. File Storage and Handling

- Store uploaded verification evidence files in a local directory under `/public/uploads/`
- Generate unique filenames to avoid collisions
- Validate file types (images: jpg, png, gif; documents: pdf, docx)
- Limit file size to 5MB
- Serve files statically from `/uploads/` path

---

## 5. Summary Reporting UI (Optional Extension)

- Create a dashboard page `/review-summary` to display:
  - Complaint counts grouped by month, day, and location
  - Use Recharts for bar charts or line charts
  - Filters for date range and location
- Fetch data from `/api/reviews/summary`
- Responsive and accessible charts with legends and tooltips

---

## 6. Error Handling and Best Practices

- Backend:
  - Use try-catch blocks in API routes
  - Validate all inputs server-side
  - Return meaningful HTTP status codes and JSON error messages
- Frontend:
  - Show user-friendly error messages on form validation failure or API errors
  - Use toast notifications for feedback
  - Handle file upload errors gracefully
- Security:
  - Sanitize inputs to prevent injection attacks
  - Validate and restrict file uploads to safe types and sizes
  - Avoid exposing internal error details to users

---

## 7. Integration with Existing Codebase

- Use existing UI components from `src/components/ui` where possible (e.g., input, select, textarea)
- Follow existing styling conventions with Tailwind CSS and class-variance-authority
- Use React Hook Form integration with existing form components
- Use existing utility functions from `src/lib/utils.ts` for className handling
- Add new API routes under `src/app/api` following Next.js 13+ app router conventions
- Use existing toast notification system (Sonner) for user feedback

---

## 8. Testing

- Add unit and integration tests for:
  - Form validation logic
  - API route handlers (mock DB)
  - File upload handling
- Use Jest and React Testing Library as per project guidelines
- Manually test responsiveness and accessibility using browser dev tools

---

# Summary

- Extend database schema with master tables and customer_reviews table.
- Implement backend API routes for review submission, master data fetching, and summary reporting.
- Build a modern, accessible, and interactive review form with React Hook Form and Tailwind CSS.
- Create custom UI components for rating and file upload with validation and user feedback.
- Store uploaded files locally with validation and unique naming.
- Provide error handling and user-friendly messages on frontend and backend.
- Integrate seamlessly with existing UI components and styling conventions.
- Optionally add a summary dashboard with charts for complaint analytics.
- Add tests to ensure reliability and maintainability.

This plan ensures a production-ready, user-friendly Customer Review application with clean code, accessibility, and maintainability aligned with the existing Next.js + TypeScript + shadcn/ui boilerplate.
```
