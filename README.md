# LifeCaptured

### Your moments. Your story.

LifeCaptured is a full-stack visual memory archive built to help people capture, organize, revisit, and experience the moments that matter to them.

Instead of treating memories as files scattered across galleries, folders, and cloud storage, LifeCaptured brings them together into one visual experience where every memory can become part of a larger personal story.

---

## ✨ Why LifeCaptured?

Digital memories are everywhere, but they are rarely experienced as a story.

LifeCaptured is designed around a simple idea:

> **Your memories deserve more than a folder.**

The experience follows five stages:

Capture → Organize → Understand → Create → Relive

From capturing a photograph to turning a collection of memories into a cinematic Story, LifeCaptured connects the entire journey.

---

# 🚀 Features

## 📸 Capture Memories

Create memories with meaningful context instead of simply uploading a file.

Each memory can contain:

- Photograph
- Title
- Description
- Date
- Location

Users can either upload an image from their device or capture a photograph directly using their camera.

### Memory Creation Flow

Create Memory → Choose Image → Upload OR Capture → Edit Photograph → Add Memory Details → Create Memory

---

## 📷 Camera Capture

Users can capture a photograph directly from the Create Memory experience.

The camera is integrated into the existing memory workflow rather than being a separate page.

Camera → Capture Photograph → Photo Editor → Memory Details → Create Memory

The captured photograph is treated exactly like an uploaded image after capture.

---

## 🎨 Photo Editor

Photographs can be edited before the memory is created.

The editor includes:

- Original
- Warm
- Cinematic
- Vintage
- Black & White
- Brightness
- Contrast
- Saturation
- Warmth
- Rotation
- Reset

The editor produces an edited image file which is then passed into the existing memory upload pipeline.

Image → Photo Editor → Edited File → Create Memory → Cloudinary

The editor is intentionally part of the Create Memory flow rather than appearing on the Overview or Memory Detail pages.

---

## 🗂️ Memory Archive

LifeCaptured provides a dedicated archive for browsing existing memories.

Users can:

- Browse memories
- Search memories
- Open individual memories
- View memory details
- Update memory information
- Replace memory images
- Delete memories

The archive is separated from the Create Memory experience so that browsing and creation remain distinct workflows.

---

## 🔎 Memory Search

Users can search their existing memories through the memory archive.

Search requests are handled by the backend and restricted to the authenticated user's memories.

This keeps the archive useful as the number of memories grows.

---

## 🕰️ Timeline

Timeline provides a chronological view of the user's memories.

Instead of browsing memories only as cards, users can move through their experiences based on when they happened.

Earlier → Memory → Memory → Memory → Today

---

## 🖼️ Frames

Frames provides a visual way to experience memories grouped around a month.

It transforms individual memory entries into a more editorial and visual experience.

The goal is to make browsing memories feel closer to looking through a personal visual journal than browsing a traditional database.

---

## 🎬 Stories

Stories transforms memories into cinematic video experiences.

A Story can include:

- Memory photographs
- Memory titles
- Dates
- Locations
- Cinematic transitions
- Ken Burns-style movement
- Opening sequence
- Closing sequence
- 16:9 video output

Story generation is powered by FFmpeg.

Selected Memories → Story Service → Image Processing → FFmpeg → Generated Story

This allows multiple individual memories to become one visual narrative.

---

## 🤖 AI-Assisted Memory Insights

LifeCaptured includes an AI integration layer for generating structured insights from memories.

The AI system can generate:

- Captions
- Summaries
- Mood
- Themes

The AI integration is separated into its own controller and service layer.

Memory → AI Controller → AI Service → OpenAI → Structured Insight → Database

The core memory system remains independent of the AI service so that AI availability does not define the entire application.

---

# 🏗️ System Architecture

LifeCaptured uses a separated frontend and backend architecture.

React App
    ↓
REST API
    ↓
Express Server
    ↓
├── Authentication → JWT
├── Memories → PostgreSQL
├── Stories → FFmpeg
├── Media → Cloudinary
└── AI Service → OpenAI

---

# 🧩 Tech Stack

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Framer Motion
- React Router

## Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcryptjs
- Multer

## Database

- PostgreSQL

## Media Storage

- Cloudinary

## Video Processing

- FFmpeg

## AI

- OpenAI API

## Security

- Helmet
- CORS
- Express Rate Limit
- JWT
- bcrypt
- Parameterized PostgreSQL queries
- Input validation
- File type validation
- File size limits
- Ownership checks

---

# 📁 Project Structure

LifeCaptured/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   │   └── hero.png
│   │   │
│   │   ├── components/
│   │   │   ├── AIInsightCard.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── CameraCapture.jsx
│   │   │   ├── Container.jsx
│   │   │   ├── Experience.jsx
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── MemoryCard.jsx
│   │   │   ├── MemorySearch.jsx
│   │   │   ├── MemorySkeleton.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PhotoEditor.jsx
│   │   │   └── SectionHeading.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── layouts/
│   │   │   └── AppLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── OverviewPage.jsx
│   │   │   ├── CreateMemoryPage.jsx
│   │   │   ├── MemoriesPage.jsx
│   │   │   ├── MemoryDetailPage.jsx
│   │   │   ├── TimelinePage.jsx
│   │   │   ├── MonthInFramesPage.jsx
│   │   │   └── StoriesPage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── memoryController.js
│   │   ├── memorySearchController.js
│   │   └── storyController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── memoryRoutes.js
│   │
│   ├── services/
│   │   ├── aiService.js
│   │   ├── memoryEmbeddingService.js
│   │   ├── memorySearchService.js
│   │   └── storyService.js
│   │
│   ├── scripts/
│   │   └── generateMemoryEmbeddings.js
│   │
│   ├── generated-stories/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md

---

# 🔐 Authentication & Security

Security was treated as part of the application architecture rather than as an afterthought.

## Authentication

LifeCaptured uses:

- JWT-based authentication
- bcrypt password hashing
- Protected API routes
- Protected frontend routes
- User ownership checks

Authentication flow:

Register → Validate Input → Hash Password → PostgreSQL → Login → JWT → Authenticated Requests

---

## Password Security

Passwords are never stored as plain text.

Passwords are hashed using bcrypt before being stored in PostgreSQL.

---

## JWT Protection

Protected API routes require a valid Bearer token.

Authorization: Bearer <token>

Invalid or expired tokens are rejected by authentication middleware.

JWT verification is restricted to the expected signing algorithm.

---

## Rate Limiting

Authentication endpoints use rate limiting to reduce brute-force attempts and abusive requests.

---

## HTTP Security

The backend uses Helmet to apply security-related HTTP headers.

---

## CORS

The API uses an explicit configured frontend origin instead of allowing arbitrary origins.

---

## Input Validation

The backend validates important request data including:

- Memory IDs
- User IDs
- Titles
- Descriptions
- Locations
- Dates
- Search parameters
- Uploaded files

---

## File Upload Validation

Uploaded images are restricted to supported formats:

- JPEG
- PNG
- WEBP

Maximum image size:

10 MB

Only one image is accepted per upload request.

---

## Database Safety

Database queries use parameterized PostgreSQL queries.

Memory operations also verify that the authenticated user owns the requested memory.

---

## Transaction Safety

Critical media replacement and deletion operations use database transactions where necessary to maintain consistency between PostgreSQL records and external media storage.

---

# ☁️ Media Storage

LifeCaptured uses Cloudinary for image storage.

Large image binaries are not stored directly inside PostgreSQL.

Instead, the application stores the media reference and metadata required to associate the image with its memory.

Browser → Express API → Cloudinary → Image URL + Public ID → PostgreSQL

When media is replaced or a memory is deleted, the backend also handles the associated Cloudinary resources.

---

# 🗄️ Database Design

PostgreSQL stores the application's structured data.

The core relationship is:

Users
  ↓
Memories
  ├── Memory Images
  └── AI Insights

A memory belongs to a user.

Memory images belong to a memory.

AI insights belong to a memory.

Ownership is enforced at the API layer so users cannot access another user's memories simply by changing an ID in a request.

---

# 🔄 Memory Creation Flow

A complete memory creation request follows this pipeline:

Create Memory
      ↓
Upload Image OR Capture Camera
      ↓
Photo Editor
      ↓
Memory Details
      ↓
Create Memory
      ↓
PostgreSQL
      ↓
Upload Image
      ↓
Cloudinary
      ↓
Image Metadata
      ↓
PostgreSQL

The frontend does not need to know the internal implementation details of PostgreSQL or Cloudinary.

---

# 🎬 Story Generation Flow

Stories are generated using the existing memory data and FFmpeg.

User
 ↓
Select Story
 ↓
Fetch Memories
 ↓
Story Service
 ↓
Prepare Images
 ↓
Generate Cinematic Sequence
 ↓
FFmpeg
 ↓
Generated MP4
 ↓
Story Response

The story generation pipeline is separate from the core memory CRUD system.

---

# 🧱 Backend Architecture

The backend follows a layered structure:

Routes
  ↓
Controllers
  ↓
Services
  ↓
Database / External Services

### Routes

Responsible for:

- API endpoints
- Middleware
- Request routing

### Controllers

Responsible for:

- Request handling
- Validation coordination
- Calling services/database operations
- HTTP responses

### Services

Responsible for:

- AI integrations
- Search logic
- Story generation
- Reusable application logic
- External service integrations

### Configuration

Responsible for:

- PostgreSQL
- Cloudinary
- Environment-based configuration

This separation keeps responsibilities clear and makes the application easier to maintain.

---

# 🔌 API Overview

## Authentication

POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

## Memories

POST   /api/memories
GET    /api/memories
GET    /api/memories/:id
PUT    /api/memories/:id
DELETE /api/memories/:id

## Memory Images

POST /api/memories/:id/images
PUT  /api/memories/:id/images

## Search

GET /api/memories/search
GET /api/memories/month/:year/:month

## AI

POST /api/memories/:id/ai

## Stories

POST /api/memories/story

## Health

GET /api/health

---

# ⚙️ Local Development

## Prerequisites

Install the following before running LifeCaptured locally:

- Node.js
- npm
- PostgreSQL
- FFmpeg
- Git
- Cloudinary account

---

## Clone the Repository

git clone https://github.com/YOUR_USERNAME/LifeCaptured.git

cd LifeCaptured

---

# Frontend Setup

Open a terminal:

cd client
npm install

Create:

client/.env

Add:

VITE_API_URL=http://localhost:5000/api

Start the development server:

npm run dev

---

# Backend Setup

Open another terminal:

cd server
npm install

Create:

server/.env

Add:

NODE_ENV=development

PORT=5000

CLIENT_URL=http://localhost:5173

JWT_SECRET=your_jwt_secret

DB_USER=your_database_user
DB_HOST=localhost
DB_NAME=lifecaptured
DB_PASSWORD=your_database_password
DB_PORT=5433

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Start the backend:

node server.js

---

# 🩺 Health Check

The backend provides:

GET /api/health

A successful health check confirms that the API can communicate with PostgreSQL.

---

# 🎥 FFmpeg Setup

Stories use FFmpeg for video generation.

FFmpeg must be installed and accessible to the backend.

For local development, configure the FFmpeg executable path according to your local operating system.

---

# 🔑 Environment Variables

Environment variables contain sensitive credentials and must never be committed to Git.

## Backend

NODE_ENV
PORT
CLIENT_URL

JWT_SECRET

DB_USER
DB_HOST
DB_NAME
DB_PASSWORD
DB_PORT

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

## Frontend

VITE_API_URL

Never commit:

.env
.env.local
.env.production

---

# 🚀 Production Deployment

LifeCaptured is structured so that the frontend and backend can be deployed separately.

Internet
   │
   ├── React Frontend
   │
   └── Express API
          │
          ├── PostgreSQL
          ├── Cloudinary
          └── FFmpeg

Production deployment involves:

1. Provisioning a production PostgreSQL database
2. Deploying the Express backend
3. Configuring backend environment variables
4. Configuring Cloudinary credentials
5. Configuring production CORS
6. Deploying the React frontend
7. Setting the production VITE_API_URL
8. Testing authentication
9. Testing image uploads
10. Testing camera capture
11. Testing photo editing
12. Testing memory creation
13. Testing memory deletion and replacement
14. Testing Timeline
15. Testing Frames
16. Testing Stories
17. Testing the application on mobile browsers

---

# 📈 Engineering Decisions

## Why PostgreSQL?

Memory data is relational by nature.

A memory belongs to a user and can have associated images and AI insights.

PostgreSQL provides:

- Relational integrity
- Transactions
- Structured querying
- Reliable persistence
- Strong ownership relationships

---

## Why Cloudinary?

Images are large binary assets and are better handled by dedicated media storage.

Cloudinary provides media storage and delivery while PostgreSQL stores the metadata and relationships required by the application.

---

## Why React?

React provides a component-based architecture suitable for the highly interactive memory experience.

Reusable components keep the interface consistent and reduce unnecessary duplication.

---

## Why Express?

Express provides a lightweight foundation for REST APIs while allowing authentication, validation, middleware, controllers, and services to remain separated.

---

## Why FFmpeg?

Stories require actual video generation.

FFmpeg provides the media-processing capabilities required to combine photographs, transitions, timing, and visual effects into generated video.

---

## Why a Service Layer?

External integrations and complex logic are kept outside route definitions.

Route → Controller → Service → External API / Database

This makes the system easier to test, modify, and maintain.

---

# 🧠 Design Philosophy

LifeCaptured intentionally avoids the visual language of a traditional administration dashboard.

The product is designed around:

- Visual storytelling
- Editorial layouts
- Dark cinematic aesthetics
- Strong typography
- Large imagery
- Smooth transitions
- Clear hierarchy
- Minimal interface noise

The goal is to make LifeCaptured feel more like a **digital museum of personal memories** than a database of uploaded files.

---

# 🔒 Privacy Philosophy

Personal memories can contain sensitive information.

LifeCaptured follows a user-owned data model:

Authenticated User
       ↓
Owns Memories
       ↓
Owns Associated Media

Backend ownership checks ensure that memory operations are performed only for memories belonging to the authenticated user.

For production deployments, the application should use:

- HTTPS
- Secure environment variables
- Restricted database access
- Production CORS configuration
- Secure hosting configuration
- Appropriate Cloudinary access controls

---

# 🧪 Testing Checklist

## Authentication

- [ ] Register
- [ ] Login
- [ ] Logout
- [ ] Invalid password
- [ ] Invalid token
- [ ] Expired token

## Memory Creation

- [ ] Upload image
- [ ] Capture camera photograph
- [ ] Open photo editor
- [ ] Apply filters
- [ ] Adjust image
- [ ] Rotate image
- [ ] Reset image
- [ ] Save edited image
- [ ] Create memory

## Memory Management

- [ ] Browse memories
- [ ] Search memories
- [ ] Open memory detail
- [ ] Update memory
- [ ] Replace image
- [ ] Delete memory

## Organization

- [ ] Timeline
- [ ] Frames
- [ ] Stories

## Security

- [ ] Protected API routes
- [ ] Protected frontend routes
- [ ] Ownership checks
- [ ] Rate limiting
- [ ] File validation
- [ ] Input validation
- [ ] CORS
- [ ] Helmet
- [ ] Environment variables
- [ ] Parameterized SQL queries

## Production

- [ ] Frontend deployed
- [ ] Backend deployed
- [ ] PostgreSQL connected
- [ ] Cloudinary connected
- [ ] Authentication tested
- [ ] Image upload tested
- [ ] Camera tested
- [ ] Photo editor tested
- [ ] Stories tested
- [ ] Mobile browser tested
- [ ] Production environment variables verified

---

# 🛣️ Future Improvements

LifeCaptured is intentionally focused rather than overloaded with features.

Potential future improvements include:

- More advanced semantic memory search
- Richer AI-assisted memory understanding
- Additional Story templates
- Native mobile experience
- Background media processing
- Improved video-memory support
- Advanced personal memory analytics
- More flexible sharing controls

These are intentionally kept outside the current core experience so the product remains focused and maintainable.

---

# 📸 Screenshots

Add screenshots of the final deployed product here.

Recommended screenshots:

1. Landing Page
2. Overview
3. Create Memory
4. Camera Capture
5. Photo Editor
6. Memories
7. Memory Detail
8. Timeline
9. Frames
10. Stories
11. Mobile Experience

Example:

![LifeCaptured Landing Page](./screenshots/landing.png)

---

# 🌐 Live Demo

**Live Application:** Coming soon

**Backend API:** Coming soon

**GitHub Repository:**

https://github.com/YOUR_USERNAME/LifeCaptured

---

# 👩‍💻 Author

## Anjali Yadav

B.Tech — Computer Science & Engineering (AI)

Interested in:

- Full-Stack Development
- Artificial Intelligence
- Data Science
- Software Engineering
- Building polished digital products

---

# ⭐ Project Highlights

LifeCaptured demonstrates practical experience with:

React
+
Vite
+
Tailwind CSS
+
Node.js
+
Express
+
PostgreSQL
+
Cloudinary
+
JWT
+
bcrypt
+
AI Integration
+
FFmpeg
+
REST APIs
+
Security

More importantly, the project demonstrates how these technologies can be combined into a complete product with:

- A real frontend experience
- A structured backend
- Authentication
- Persistent database storage
- Cloud media storage
- Image editing
- Camera capture
- Search
- Timeline organization
- AI integration
- Automated video generation
- Security hardening
- Production-oriented architecture

---

# 📜 License

This project is currently intended as a personal portfolio project.

---

# LifeCaptured

### Your moments. Your story.

Built with care by **Anjali Yadav**