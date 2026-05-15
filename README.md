# Lumora Social Media Platform

A modern social media application built with the MERN stack (MongoDB, Express, React, Node.js) and real-time capabilities using Socket.io.

## Project Structure

- `backend/`: Express.js server and API logic.
- `frontend/`: React + Vite application with Tailwind CSS and Redux.

## Setup Instructions

### 1. Prerequisites
- Node.js installed on your machine.
- MongoDB installed locally or a MongoDB Atlas connection string.
- Cloudinary account for media storage.

### 2. Environment Variables

Create a `.env` file in the root directory and add the following:

```env
MONGO_URI=mongodb://localhost:27017/lumora
SECRET_KEY=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
URL=http://localhost:5174
PORT=3001
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_BACKEND_URL=http://localhost:3001
```

### 3. Installation

Run the following command in the root directory:

```bash
npm install
npm install --prefix frontend
```

### 4. Running the Application

To start the backend (with nodemon):
```bash
npm run dev
```

To start the frontend:
```bash
cd frontend
npm run dev
```

The application will be accessible at:
- Frontend: [http://localhost:5174](http://localhost:5174)
- Backend API: [http://localhost:3001](http://localhost:3001)

## Key Features

- **Authentication:** Secure login and registration.
- **Real-time Notifications:** Instant feedback for likes and messages.
- **Post Management:** Create, delete, like, and comment on posts.
- **Profile Customization:** Edit bio, profile picture, and view bookmarks.
- **Chat:** Real-time messaging between users.

## Recent Optimizations

- **Port Resolution:** Backend moved to 3001 and Frontend to 5174 to avoid common port conflicts.
- **Code Quality:** 130+ linting issues fixed; optimized hook dependencies and removed unused code.
- **ESM Migration:** Build configurations updated for full ES Module support.
- **Robust Error Handling:** Consistent API responses and server-side logging added to all controllers.
