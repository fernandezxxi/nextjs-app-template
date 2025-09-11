# Detailed Plan for Customer Review Application (Next.js + TypeScript + MySQL)

---

## Overview

This plan covers the implementation of a Customer Review application with a modern, accessible, and interactive frontend form and backend API routes for data handling and reporting. The app will be built on the existing Next.js 15+ TypeScript boilerplate using Tailwind CSS and shadcn/ui components for styling and UI consistency, with MySQL database for data persistence.

---

## 1. Database Setup (MySQL with Docker)

- Create `docker-compose.yml` in project root for local MySQL setup
- MySQL configuration:
  - Database: `customer_reviews`
  - Tables: `reviews`, `complaint_categories`, `complaint_related`
- Create database schema and seed data for master tables
- Use `mysql2` package for database connection
- Create database connection utility in `src/lib/db.ts`
- Environment variables for database credentials in `.env.local`

---

## 2. Data Storage and Backend Setup

- MySQL database with proper schema for reviews and master data
- Backend API routes under `src/app/api/`:
  - POST `/api/reviews` to submit a new review
  - GET `/api/reviews/summary` to get complaint summaries by month, day, and location
  - GET `/api/master/categories` to get complaint categories with icons
  - GET `/api/master/complaints` to get complaint related items with emoticons
- Implement file upload handling for "Verification Evidence" using Next.js API route
- Validate all inputs server-side for security and data integrity
- Use proper error handling and return meaningful HTTP status codes and messages

---

## 3. Frontend Form Implementation

### Location: `src/app/customer-review/page.tsx`

- Build a multi-field form with the following fields (all labels and placeholders in English):
  1. **Reporting Criteria** (mandatory): Radio buttons between "Audience" and "Stakeholder"
  2. **Name** (mandatory): Text input
  3. **Email** (optional): Email input with validation
  4. **Complaint Category** (mandatory): **Radio buttons** with custom icons (CSS-based shapes/symbols)
  5. **Complaint Related** (mandatory): **Radio buttons** with emoticons (😊, 😐, 😞, 😡, etc.)
  6. **Rating (1-10)** (mandatory): NPS score slider or radio group (0-10 scale)
  7. **Review / Complaint Description** (optional): Textarea with character limit
  8. **Verification Evidence** (optional): File upload for images, PDFs, documents

- Use `react-hook-form` for form state management and validation
- Use Tailwind CSS for styling with clean, modern, responsive layout
- Provide inline validation error messages
- Add submit button with loading state and success/error toast notifications using `sonner`
- After successful submission, clear form and show thank you message

---

## 4. Master Data Management

### Database Tables:
- `complaint_categories`: id, name, icon_class, created_at
- `complaint_related`: id, name, emoticon, created_at

### Frontend Components:
- Radio button groups with visual icons and emoticons
- Fetch master data from API endpoints on component mount
- Style radio buttons with Tailwind CSS for attractive appearance

---

## 5. Backend API Details

### Database Schema:
```sql
CREATE TABLE complaint_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  icon_class VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE complaint_related (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  emoticon VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reporting_criteria ENUM('audience', 'stakeholder') NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  complaint_category_id INT,
  complaint_related_id INT,
  rating INT NOT NULL CHECK (rating >= 0 AND rating <= 10),
  description TEXT,
  evidence_file VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_category_id) REFERENCES complaint_categories(id),
  FOREIGN KEY (complaint_related_id) REFERENCES complaint_related(id)
);
```

### API Endpoints:
- `POST /api/reviews`: Accept form data, validate, save to MySQL
- `GET /api/reviews/summary`: Aggregate data by month, day, location
- `GET /api/master/categories`: Return complaint categories with icons
- `GET /api/master/complaints`: Return complaint related items with emoticons

---

## 6. Docker MySQL Setup

### Files to create:
- `docker-compose.yml`: MySQL service configuration
- `database/init.sql`: Database schema and seed data
- `.env.local`: Database connection variables

### Docker Configuration:
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: customer_reviews_db
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: customer_reviews
      MYSQL_USER: app_user
      MYSQL_PASSWORD: app_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
volumes:
  mysql_data:
```

---

## 7. UI/UX Design for Radio Buttons

### Complaint Categories (with icons):
- Service Quality: 🔧 (gear icon using CSS)
- Product Issues: 📦 (box icon using CSS)
- Staff Behavior: 👤 (person icon using CSS)
- Facility: 🏢 (building icon using CSS)
- Others: ❓ (question icon using CSS)

### Complaint Related (with emoticons):
- Very Satisfied: 😊
- Satisfied: 🙂
- Neutral: 😐
- Dissatisfied: 😞
- Very Dissatisfied: 😡

### Styling:
- Custom radio button styling with Tailwind CSS
- Hover and focus states for accessibility
- Visual feedback for selected options
- Responsive grid layout for radio button groups

---

## 8. Summary Visualization

- Create summary page at `/customer-review/summary`
- Use `recharts` for data visualization:
  - Bar chart for complaints per month
  - Pie chart for complaint categories distribution
  - Line chart for daily complaint trends
  - NPS score average display

---

## 9. Files and Changes Summary

| File/Folder                              | Description                                    | Changes/Creation                        |
|----------------------------------------|----------------------------------------------|-----------------------------------------|
| `docker-compose.yml`                   | MySQL Docker configuration                    | Create Docker setup                     |
| `database/init.sql`                    | Database schema and seed data                 | Create SQL schema                       |
| `.env.local`                           | Environment variables                         | Create DB connection vars               |
| `src/lib/db.ts`                        | Database connection utility                   | Create MySQL connection                 |
| `src/app/customer-review/page.tsx`     | Customer Review form page                     | Create form with radio buttons          |
| `src/app/customer-review/summary/page.tsx` | Summary visualization page               | Create summary dashboard                |
| `src/app/api/reviews/route.ts`         | Reviews API endpoint                          | Create CRUD operations                  |
| `src/app/api/master/categories/route.ts` | Complaint categories API                    | Create master data API                  |
| `src/app/api/master/complaints/route.ts` | Complaint related API                       | Create master data API                  |
| `src/components/ui/radio-group.tsx`    | Custom radio button component                | Enhance existing or create new          |
| `public/uploads/`                      | Uploaded files storage                        | Create upload directory                 |
| `package.json`                         | Add MySQL dependencies                        | Add mysql2, bcrypt packages             |

---

## 10. Dependencies to Add

```bash
npm install mysql2 @types/mysql2 bcrypt @types/bcrypt
```

---

## 11. Next Steps

1. Set up Docker MySQL environment
2. Create database schema and seed data
3. Implement database connection utility
4. Build master data API endpoints
5. Create frontend form with radio buttons and icons/emoticons
6. Implement review submission API with file upload
7. Build summary API and visualization page
8. Test all functionality with curl commands
9. Ensure responsive design and accessibility

---

# Summary

- Create a modern Customer Review form in Next.js with radio button selections
- Use Docker-based local MySQL for data persistence
- Implement complaint categories with CSS icons and complaint related with emoticons
- Build comprehensive API endpoints for CRUD operations and reporting
- Provide interactive UI with proper validation and user feedback
- Include summary dashboard with data visualization using recharts
- Follow best practices for security, validation, and UX
- Self-contained solution with local database setup

This plan ensures a robust, scalable Customer Review application with proper database integration and modern UI components.
