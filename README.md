# LifeCaptured

### Your moments. Your story.

LifeCaptured is a full-stack personal memory archive that turns everyday moments into a visual, searchable timeline.

Capture memories, edit your photos, organize your moments, explore your timeline, create cinematic stories, and revisit the experiences that matter.

---

## ✨ Features

- 📸 **Capture Memories** — Save photos with titles, descriptions, dates, and locations.
- 📷 **Camera Capture** — Take photos directly from supported devices.
- 🎨 **Photo Editor** — Apply filters, adjust brightness, contrast, saturation, warmth, and rotation before saving.
- 🗂️ **Memory Archive** — Browse and manage your personal memories.
- 🔎 **Memory Search** — Quickly find memories using search.
- 🕰️ **Visual Timeline** — Explore memories chronologically.
- 🖼️ **Frames** — Turn collections of memories into visual frames.
- 🎬 **Stories** — Generate cinematic memory stories using FFmpeg.
- 🤖 **AI Insights** — Generate captions, summaries, moods, and themes for memories.
- 🔐 **Secure Authentication** — JWT-based authentication with protected routes and password hashing.

---

## 🎥 Product Experience

```text
Capture
   ↓
Edit
   ↓
Organize
   ↓
Explore
   ↓
Create
   ↓
Relive
```

LifeCaptured is designed around one simple idea:

> Your memories should feel like a story, not a database.

---

## 🏗️ Architecture

```text
React + Vite
     │
     │ REST API
     ▼
Node.js + Express
     │
     ├── Authentication
     ├── Memory Management
     ├── AI Services
     └── Story Generation
     │
     ├───────────────┐
     ▼               ▼
PostgreSQL       Cloudinary
     │
     ▼
Memory Data
     
FFmpeg
  │
  ▼
Cinematic Stories
```

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- React Router

### Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- Multer

### Database & Storage

- PostgreSQL
- Cloudinary

### AI & Media

- OpenAI API
- FFmpeg

### Development

- Git
- GitHub
- REST APIs
- Environment-based configuration

---

## 📁 Project Structure

```text
LifeCaptured/
│
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── scripts/
│   ├── generated-stories/
│   └── server.js
│
├── README.md
└── .gitignore
```

---

## 🔐 Authentication & Security

LifeCaptured includes:

- JWT authentication
- Protected API routes
- Password hashing with bcryptjs
- Request validation
- Upload restrictions
- File-size limits
- Login and registration rate limiting
- Secure HTTP headers
- Environment-based secrets
- PostgreSQL connection pooling
- Ownership checks for user memories
- Controlled error handling

Sensitive environment variables are excluded from Git through `.gitignore`.

---

## ☁️ Media Storage

Images are uploaded to **Cloudinary** rather than stored directly inside the application server.

The database stores the required metadata and Cloudinary identifiers, allowing memories to remain lightweight and scalable.

Generated Stories are produced using **FFmpeg**.

---

## 🗄️ Database

PostgreSQL stores core application data including:

- Users
- Memories
- Memory images
- AI insights
- Memory metadata

The backend uses parameterized SQL queries and ownership checks to protect user data.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/anjaliyadav07/LifeCaptured.git
cd LifeCaptured
```

### 2. Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `server/`.

Example:

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173

DB_USER=your_database_user
DB_HOST=localhost
DB_NAME=lifecaptured
DB_PASSWORD=your_database_password
DB_PORT=5432

JWT_SECRET=your_secure_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

OPENAI_API_KEY=your_openai_api_key
```

### 4. Start the backend

```bash
cd server
npm run dev
```

### 5. Start the frontend

```bash
cd client
npm run dev
```

Open the Vite development URL shown in your terminal.

---

## 🌐 Deployment

The production application consists of:

```text
React Frontend
      ↓
Express API
      ↓
PostgreSQL
      +
Cloudinary
      +
FFmpeg
```

Production deployment requires configuring the corresponding environment variables for the frontend, backend, database, Cloudinary, and AI services.

---

## 📸 Screenshots

_Add production screenshots here after deployment._

Recommended screenshots:

- Landing Page
- Overview
- Create Memory
- Photo Editor
- Memory Archive
- Timeline
- Frames
- Stories

---

## 🔗 Links

**Live Application:** Coming soon

**Backend API:** Coming soon

**GitHub:**  
https://github.com/anjaliyadav07/LifeCaptured

---

## 💡 Why I Built It

Most applications treat memories as individual files.

LifeCaptured explores a different approach: treating personal memories as a connected visual story.

The project combines full-stack development, media processing, cloud storage, authentication, AI-assisted features, and a cinematic user experience into one application.

---

## 👩‍💻 Author

### Anjali Yadav

B.Tech — Computer Science & Engineering (AI)

Interested in building thoughtful full-stack applications, AI-powered products, and polished user experiences.

**GitHub:**  
https://github.com/anjaliyadav07

---

## 📌 Project Highlights

- Full-stack React + Node.js application
- PostgreSQL database
- Cloudinary media storage
- JWT authentication
- Photo editing pipeline
- Camera capture
- AI-assisted memory insights
- FFmpeg-powered cinematic Stories
- Responsive dark editorial UI
- Production-oriented backend security

---

## 📄 License

This project is currently maintained as a personal portfolio project by **Anjali Yadav**.
