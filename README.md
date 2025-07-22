
# 🌐 GBlog

**GBlog** is a feature-rich full-stack blogging platform where users can create, manage, and engage with blog content. It supports rich text editing, user authentication, image uploads, and includes a powerful admin dashboard for content and user management.

---

## ✨ Features

### 🚀 General

* 🔐 Secure authentication (Email/Password & Google OAuth)
* 🎨 Modern, responsive UI
* 📝 CKEditor for rich text editing
* 📸 Image uploads for blog posts and avatars
* 🔔 Toast notifications for user feedback

### 👤 User Functionality

* 🔐 Sign Up / Login (Email & Google)
* 📝 Browse all public blogs and categories
* 🔍 Search blogs by keywords
* 📝 View blog details: author, date, category, likes, and comments
* ❤️ Like / Unlike blogs
* 💬 Comment on blogs
* ✏️ Edit personal profile (name, bio, avatar)
* 📂 Manage personal blogs

### 🛠️ Admin Dashboard

* 📊 Overview with sidebar navigation
* 👥 Manage users (view, delete)
* 🏷️ Manage categories (add, edit, delete)
* 📝 Manage blogs (add, edit, delete)
* 💬 Manage comments (view, delete)
* 🔒 Admin-only access to management routes

---

## 🛠️ Tech Stack

### 🔧 Frontend

* **React** – Component-based UI library
* **Redux Toolkit** – Simplified state management
* **Vite** – Lightning-fast bundler and dev server
* **Tailwind CSS** – Utility-first CSS for styling
* **React Router** – Client-side routing
* **CKEditor** –Provides a rich text editor for creating and editing blog content.
* **React Toastify** – User-friendly toast notifications

### 🔌 Backend

* **Node.js** – JavaScript runtime
* **Express.js** – Web framework for Node
* **MongoDB** – NoSQL database
* **Mongoose** – MongoDB ODM
* **Cloudinary** – Cloud-based image management
* **JWT** – Authentication using JSON Web Tokens
* **bcrypt** – Password hashing

### 🔐 Authentication & Uploads

* **Firebase** – Google OAuth integration
* **Cloudinary** – Image upload and delivery

---

## 🧑‍💻 Getting Started

### 📦 Backend Setup

```bash
cd backend
npm install
```

1. Create a `.env` file with:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=your_frontend_url
```

2. Start the server:

```bash
npm run dev
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
```

1. Create a `.env` file with:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

2. Start the dev server:

```bash
npm run dev
```

---

