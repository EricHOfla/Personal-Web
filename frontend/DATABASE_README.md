# Database Structure & Models Documentation

## Overview
This document outlines the complete database structure needed for the Personal Portfolio Website. All data currently hardcoded in the application should be migrated to a database and accessed via API endpoints.

---

## Database Models and Schema

### 1. **User/Profile Model**
Stores the main user profile information displayed throughout the site.

```sql
Table: users
---------------------------------
id                  INT PRIMARY KEY AUTO_INCREMENT
full_name           VARCHAR(100) NOT NULL
first_name          VARCHAR(50)
last_name           VARCHAR(50)
title               VARCHAR(100)  -- e.g., "Software Engineer", "Full Stack Developer"
bio                 TEXT          -- Main bio/about me text
profile_image       VARCHAR(255)  -- Path to profile image
cv_file            VARCHAR(255)  -- Path to CV/Resume PDF file
qualification       VARCHAR(100)  -- e.g., "A0"
residence           VARCHAR(100)  -- e.g., "RWANDA"
address             VARCHAR(255)  -- e.g., "Kigali, RWANDA"
phone               VARCHAR(20)   -- e.g., "+250 785263931"
email               VARCHAR(100)  -- e.g., "oflatech@gmail.com"
freelance_status    VARCHAR(50)   -- e.g., "Available", "Unavailable"
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**API Endpoints Needed:**
- `GET /api/profile` - Get user profile data
- `PUT /api/profile` - Update profile data

**Used In Components:**
- `Left.js` - Profile image, name, title, CV download
- `AboutMe.js` - Bio, qualification, residence, freelance status, address
- `Contact.js` - Phone, email, address, freelance status

---

### 2. **Social Links Model**
Stores social media links for the profile.

```sql
Table: social_links
---------------------------------
id                  INT PRIMARY KEY AUTO_INCREMENT
user_id             INT FOREIGN KEY REFERENCES users(id)
platform            VARCHAR(50) NOT NULL  -- "github", "linkedin", "youtube", "facebook", "instagram", "twitter", "email"
url                 VARCHAR(255) NOT NULL
icon                VARCHAR(50)           -- Optional: icon name reference
display_order       INT                   -- Order to display icons
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**API Endpoints Needed:**
- `GET /api/social-links` - Get all active social links
- `POST /api/social-links` - Add new social link
- `PUT /api/social-links/:id` - Update social link
- `DELETE /api/social-links/:id` - Delete social link

**Used In Components:**
- `Left.js` - Social media icons (GitHub, LinkedIn, YouTube, Facebook, Instagram, Twitter, Email)

---

### 3. **Services Model**
Stores the services offered section.

```sql
Table: services
---------------------------------
id                  INT PRIMARY KEY AUTO_INCREMENT
user_id             INT FOREIGN KEY REFERENCES users(id)
title               VARCHAR(100) NOT NULL  -- e.g., "Web Development", "Web Design"
description         TEXT NOT NULL          -- Service description
icon                VARCHAR(50)            -- Icon identifier (e.g., "BiCodeAlt")
display_order       INT
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**API Endpoints Needed:**
- `GET /api/services` - Get all active services
- `POST /api/services` - Add new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

**Used In Components:**
- `MyServices.js` - Display services offered (Web Development, Web Design, Mobile Application, SEO)

---

### 4. **Fun Facts/Stats Model**
Stores achievement statistics displayed in the Fun Fact section.

```sql
Table: fun_facts
---------------------------------
id                  INT PRIMARY KEY AUTO_INCREMENT
user_id             INT FOREIGN KEY REFERENCES users(id)
description         VARCHAR(100) NOT NULL  -- e.g., "3 Awards Won", "10 Finished Projects"
value               INT                    -- Numeric value (optional)
icon                VARCHAR(50)            -- Icon identifier
display_order       INT
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**API Endpoints Needed:**
- `GET /api/fun-facts` - Get all fun facts/stats
- `POST /api/fun-facts` - Add new fun fact
- `PUT /api/fun-facts/:id` - Update fun fact
- `DELETE /api/fun-facts/:id` - Delete fun fact

**Used In Components:**
- `FunFact.js` - Display statistics (Awards, Projects, Coding Hours, Subscriptions)

---

### 5. **Experience Model**
Stores work experience entries for the resume section.

```sql
Table: experiences
---------------------------------
id                  INT PRIMARY KEY AUTO_INCREMENT
user_id             INT FOREIGN KEY REFERENCES users(id)
job_title           VARCHAR(150) NOT NULL  -- e.g., "Software Developer"
company             VARCHAR(150) NOT NULL  -- e.g., "Mutation Supplies Ltd"
location            VARCHAR(100)
time_period         VARCHAR(100) NOT NULL  -- e.g., "2021 - 2022", "2023 - Present"
description         TEXT                   -- Job description/responsibilities
display_order       INT
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**API Endpoints Needed:**
- `GET /api/experiences` - Get all experience entries
- `POST /api/experiences` - Add new experience
- `PUT /api/experiences/:id` - Update experience
- `DELETE /api/experiences/:id` - Delete experience

**Used In Components:**
- `Education.js` - Work experience section

---

### 6. **Education Model**
Stores educational background entries.

```sql
Table: education
---------------------------------
id                  INT PRIMARY KEY AUTO_INCREMENT
user_id             INT FOREIGN KEY REFERENCES users(id)
degree              VARCHAR(150) NOT NULL  -- e.g., "Software Engineering"
institution         VARCHAR(150) NOT NULL  -- e.g., "UNILAK, Kigali"
location            VARCHAR(100)
time_period         VARCHAR(100) NOT NULL  -- e.g., "2022 - 2025"
description         TEXT                   -- Additional details
display_order       INT
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**API Endpoints Needed:**
- `GET /api/education` - Get all education entries
- `POST /api/education` - Add new education entry
- `PUT /api/education/:id` - Update education entry
- `DELETE /api/education/:id` - Delete education entry

**Used In Components:**
- `Education.js` - Educational background section

---

### 7. **Skills Model**
Stores skills with proficiency levels organized by category.

```sql
Table: skills
---------------------------------
id                  INT PRIMARY KEY AUTO_INCREMENT
user_id             INT FOREIGN KEY REFERENCES users(id)
category            VARCHAR(50) NOT NULL   -- "Design", "Languages", "Coding", "Knowledge"
skill_name          VARCHAR(100) NOT NULL  -- e.g., "JavaScript", "English", "Web Development"
proficiency_level   INT                    -- Percentage (0-100) for progress bar
description         TEXT                   -- Optional description
display_order       INT
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**API Endpoints Needed:**
- `GET /api/skills?category={category}` - Get skills by category
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Add new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

**Used In Components:**
- `Skills.js` - Display skills by category:
  - **Design:** Web Development (95%), Web Design (70%), Mobile Application (85%), UI/UX Design (60%)
  - **Languages:** English (70%), Kinyarwanda (100%)
  - **Coding:** JavaScript (65%), Node.js (50%), React.js (55%), Django (60%), Laravel (90%)
  - **Knowledge:** Listed items with checkmarks

---

### 8. **Projects Model**
Stores portfolio projects with details.

```sql
Table: projects
---------------------------------
id                  INT PRIMARY KEY AUTO_INCREMENT
user_id             INT FOREIGN KEY REFERENCES users(id)
title               VARCHAR(150) NOT NULL  -- e.g., "Blog Website"
category            VARCHAR(100)           -- e.g., "Website", "Design", "Logo", "Shopping"
description         TEXT                   -- Project details
image_url           VARCHAR(255)           -- Project image/thumbnail
project_url         VARCHAR(255)           -- Live project link
github_url          VARCHAR(255)           -- GitHub repository link
technologies        TEXT                   -- Comma-separated or JSON array
display_order       INT
is_featured         BOOLEAN DEFAULT false
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**API Endpoints Needed:**
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Add new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

**Used In Components:**
- `Projects.js` - Display portfolio projects:
  - Blog Website, Business Card Design, Infinity Logo, Mobile Application
  - Responsive website, Graphic Design, Ideas & Blog, ZOSS Logo

---

### 9. **Blog Posts Model**
Stores blog post entries.

```sql
Table: blog_posts
---------------------------------
id                  INT PRIMARY KEY AUTO_INCREMENT
user_id             INT FOREIGN KEY REFERENCES users(id)
title               VARCHAR(200) NOT NULL  -- e.g., "UI & UX Conference at Kigali 2022"
category            VARCHAR(100)           -- e.g., "Travel", "Documentation"
excerpt             TEXT                   -- Short description
content             LONGTEXT               -- Full blog post content
featured_image      VARCHAR(255)           -- Blog post image
published_date      DATE NOT NULL
slug                VARCHAR(200) UNIQUE    -- URL-friendly version of title
views_count         INT DEFAULT 0
is_published        BOOLEAN DEFAULT true
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**API Endpoints Needed:**
- `GET /api/blog-posts` - Get all published blog posts
- `GET /api/blog-posts/:slug` - Get single blog post by slug
- `POST /api/blog-posts` - Create new blog post
- `PUT /api/blog-posts/:id` - Update blog post
- `DELETE /api/blog-posts/:id` - Delete blog post

**Used In Components:**
- `Blog.js` - Display blog posts with dates and categories
- `Sidenav.js` - Latest posts list

---

### 10. **Contact Messages Model**
Stores messages submitted through the contact form.

```sql
Table: contact_messages
---------------------------------
id                  INT PRIMARY KEY AUTO_INCREMENT
name                VARCHAR(100) NOT NULL
email               VARCHAR(100) NOT NULL
message             TEXT NOT NULL
is_read             BOOLEAN DEFAULT false
is_replied          BOOLEAN DEFAULT false
ip_address          VARCHAR(50)
user_agent          TEXT
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**API Endpoints Needed:**
- `POST /api/contact` - Submit contact form
- `GET /api/contact-messages` - Get all messages (admin only)
- `PUT /api/contact-messages/:id` - Mark as read/replied (admin only)
- `DELETE /api/contact-messages/:id` - Delete message (admin only)

**Used In Components:**
- `Contact.js` - Contact form submission (currently using getform.io)

---

### 11. **Sidenav Menu Items Model** (Optional)
Stores custom menu items for the side navigation.

```sql
Table: sidenav_items
---------------------------------
id                  INT PRIMARY KEY AUTO_INCREMENT
user_id             INT FOREIGN KEY REFERENCES users(id)
category            VARCHAR(50) NOT NULL   -- "Menu", "Projects", "Latest Posts", "Reach Me"
item_text           VARCHAR(200) NOT NULL
item_url            VARCHAR(255)           -- Optional link
display_order       INT
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**API Endpoints Needed:**
- `GET /api/sidenav-items?category={category}` - Get sidenav items by category
- `POST /api/sidenav-items` - Add sidenav item
- `PUT /api/sidenav-items/:id` - Update sidenav item
- `DELETE /api/sidenav-items/:id` - Delete sidenav item

**Used In Components:**
- `Sidenav.js` - Side navigation menu items

---

## Database Relationships

```
users (1) ──── (Many) social_links
users (1) ──── (Many) services
users (1) ──── (Many) fun_facts
users (1) ──── (Many) experiences
users (1) ──── (Many) education
users (1) ──── (Many) skills
users (1) ──── (Many) projects
users (1) ──── (Many) blog_posts
users (1) ──── (Many) sidenav_items
```

---

## Technology Stack Recommendations

### Backend Options:
1. **Node.js + Express.js** - Recommended for JavaScript consistency
2. **Laravel (PHP)** - As per your Laravel skill (90% proficiency)
3. **Django (Python)** - As per your Django skill (60% proficiency)

### Database Options:
1. **MySQL** - Most common, good for relational data
2. **PostgreSQL** - More features, better for complex queries
3. **MongoDB** - If you prefer NoSQL (requires schema adjustment)

### Authentication:
- JWT (JSON Web Tokens) for admin access
- Or session-based authentication

---

## Implementation Steps

### Phase 1: Database Setup
1. Create database and tables with the schemas above
2. Set up relationships and foreign keys
3. Create indexes for frequently queried fields (email, slug, user_id)
4. Seed initial data from current hardcoded values

### Phase 2: Backend API Development
1. Set up API server (Express/Laravel/Django)
2. Create API endpoints for each model (CRUD operations)
3. Implement authentication for admin routes
4. Add validation and error handling
5. Test all endpoints with Postman/Insomnia

### Phase 3: Frontend Integration
1. Create API service layer in React
2. Replace hardcoded data with API calls
3. Add loading states and error handling
4. Implement caching strategy (optional)
5. Test all components with real data

### Phase 4: Admin Panel (Optional)
1. Create admin dashboard
2. Implement CRUD interfaces for all models
3. Add image upload functionality
4. Create forms for managing content

---

## Example API Response Formats

### GET /api/profile
```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Eric H Oflã",
    "title": "Software Engineer",
    "bio": "A Computer Scientist With More Than Four Years In Field Of Computing...",
    "profile_image": "/images/profile/eric.jpg",
    "cv_file": "/files/Eric_resume.pdf",
    "email": "oflatech@gmail.com",
    "phone": "+250 785263931",
    "address": "Kigali, RWANDA",
    "freelance_status": "Available"
  }
}
```

### GET /api/projects
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Blog Website",
      "category": "Website",
      "description": "A modern blog platform built with React and Node.js",
      "image_url": "/images/projects/blog.jpg",
      "project_url": "https://example.com",
      "github_url": "https://github.com/user/project",
      "technologies": ["React", "Node.js", "MongoDB"],
      "is_featured": true
    },
    // ... more projects
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 8
  }
}
```

### POST /api/contact
```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I would like to hire you for a project."
}

// Response
{
  "success": true,
  "message": "Thank you for your message! We will get back to you soon."
}
```

---

## File Upload Requirements

### Images to Store:
1. Profile image (banner image in Left.js)
2. Project images (8 project thumbnails)
3. Blog post images (3 blog post images)

### Files to Store:
1. CV/Resume PDF file

### Storage Recommendations:
- Store files locally in `/public/uploads` directory
- Or use cloud storage (AWS S3, Cloudinary, etc.)
- Save only the file path/URL in the database

---

## Environment Variables Needed

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=portfolio_db
DB_USER=root
DB_PASSWORD=your_password

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_PATH=./public/uploads

# Email (for contact form notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

---

## Security Considerations

1. **Input Validation:** Validate all user inputs on the backend
2. **SQL Injection:** Use parameterized queries or ORM
3. **XSS Protection:** Sanitize HTML content in blog posts
4. **CORS:** Configure CORS properly for frontend domain
5. **Rate Limiting:** Implement rate limiting on contact form
6. **File Upload:** Validate file types and sizes
7. **Authentication:** Secure admin routes with JWT or sessions
8. **HTTPS:** Use HTTPS in production
9. **Environment Variables:** Never commit sensitive data to git

---

## Current Hardcoded Data to Migrate

### From Left.js:
- Name: "Eric H Oflã"
- Titles: ["Software Engineer", "Full Stack Developer"]
- CV file path
- Social media links (7 platforms)

### From AboutMe.js:
- Bio text
- Qualification: "A0"
- Residence: "RWANDA"
- Freelance: "Available"
- Address: "Kigali, RWANDA"

### From MyServices.js:
- 4 services with icons, titles, and descriptions

### From FunFact.js:
- 4 statistics with icons and descriptions

### From Education.js:
- 3 work experiences
- 3 education entries

### From Skills.js:
- 4 design skills with percentages
- 2 languages with percentages
- 5 coding skills with percentages
- 8 knowledge items

### From Projects.js:
- 8 projects with titles, categories, and images

### From Blog.js:
- 8 blog posts with dates, titles, categories, and images

### From Contact.js:
- Address: "Kigali, RWANDA"
- Phone: "+250 785263931"
- Email: "oflatech@gmail.com"
- Freelance: "Available"

### From Sidenav.js:
- Menu items
- Project categories
- Latest posts
- Contact information

---

## Next Steps

1. **Choose your backend technology** (Node.js/Laravel/Django)
2. **Set up the database** with the schemas provided
3. **Create API endpoints** following RESTful conventions
4. **Test APIs** with Postman before frontend integration
5. **Update frontend components** to fetch from API instead of hardcoded data
6. **Implement error handling** and loading states
7. **Deploy backend** and update frontend API URLs
8. **Test end-to-end** functionality

---

## Additional Features to Consider

1. **Analytics:** Track page views, popular projects, blog post views
2. **Comments System:** For blog posts
3. **Newsletter:** Email subscription for blog updates
4. **Tags System:** For projects and blog posts
5. **Search Functionality:** Search across projects and blog posts
6. **Testimonials:** Client reviews and testimonials
7. **Certifications:** Display professional certifications
8. **Dark/Light Mode:** Store user preference in database
9. **Multi-language Support:** i18n tables for content translation
10. **Admin Dashboard:** Complete CMS for managing all content

---

**Note:** This README should be updated as you implement the database and API. Keep track of any schema changes or new endpoints added during development.
