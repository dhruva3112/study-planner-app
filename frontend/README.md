# Study Planner App

Study Planner App is a full-stack web application designed to help students organize their courses and study tasks. Users can create an account, log in securely, manage courses, create study tasks, update task status, and receive real-time updates using WebSocket events.

The project was built using React for the frontend, Node.js and Express for the backend, MongoDB Atlas for the database, JWT for authentication, bcrypt for password hashing, and Render for deployment.

---

## Live Deployment Links

Frontend: https://study-planner-frontend-wt1r.onrender.com

Backend: https://study-planner-backend-erla.onrender.com

GitHub Repository: https://github.com/dhruva3112/study-planner-app

---

## Technologies Used

### Frontend
- React
- React Router DOM
- Axios
- Socket.io Client
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Socket.io
- CORS
- dotenv

### Deployment
- Render Web Service for backend
- Render Static Site for frontend
- MongoDB Atlas for database hosting
- GitHub for source code hosting

---

## Project Models

The backend contains three main data models.

### 1. User Model

The User model is used for authentication and user account management.

User operations:
- Signup
- Login
- Fetch current user information

Full CRUD operations are not required for the User model.

### 2. Course Model

The Course model is used to manage the courses created by a user.

Course operations:
- Create course
- Read course/courses
- Update course
- Delete course

### 3. StudyTask Model

The StudyTask model is used to manage study tasks assigned to a course.

StudyTask operations:
- Create study task
- Read study task/tasks
- Update study task
- Delete study task

---

## Main Features

- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes
- Course management
- Study task management
- Task status tracking
- Real-time task updates using WebSockets
- Professional responsive frontend interface
- Backend and frontend deployed on Render

---

## Real-Time WebSocket Events

The application implements two WebSocket events:

### studyTask:created
Triggered when a new study task is created.

### studyTask:updated
Triggered when an existing study task is updated.

These events allow the frontend to receive real-time updates when study task data changes.

---

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/signup | Create a new user account |
| POST | /api/auth/login | Authenticate existing user |
| GET | /api/auth/me | Fetch current logged-in user |

### Course Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/courses | Create a new course |
| GET | /api/courses | Get all courses for logged-in user |
| GET | /api/courses/:id | Get a specific course |
| PUT | /api/courses/:id | Update a course |
| DELETE | /api/courses/:id | Delete a course |

### StudyTask Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/studytasks | Create a new study task |
| GET | /api/studytasks | Get all study tasks for logged-in user |
| GET | /api/studytasks/:id | Get a specific study task |
| PUT | /api/studytasks/:id | Update a study task |
| DELETE | /api/studytasks/:id | Delete a study task |

---

## Environment Variables

The application uses environment variables to keep configuration values secure.

### Backend Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here