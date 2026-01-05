# SkillConnect

SkillConnect is a platform where students can connect, share skills, request help, and build a community. The application features user profiles with skill showcasing, real-time messaging, skill search with intelligent recommendations, and a leaderboard system.

## Team Members
- Dinil Hansara
- Isira Dilum
- Sehansa Karunathilaka 
- Tiranga Liyanage
- Heshan Hansana

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Troubleshooting](#troubleshooting)

## Features

### User Profiles
- Initials-based profile avatars with gradient backgrounds
- Customizable profile information (name, headline, university, location, about section)
- Skills showcase with ratings and details
- GPA display
- User verification badges

### Skill Search
- Search users by skills, categories, and availability
- Intelligent skill-based user recommendations
- Search suggestions based on your skills
- Horizontal filter bar with:
  - Category selector (Programming, Design, Marketing, etc.)
  - Skill level filter (Beginner to Expert)
  - Availability filter (Online/Offline)

### Real-Time Messaging
- One-on-one chat with Socket.io
- Message status indicators
- Online/offline user status
- Conversation history


### Skill Requests
- Apply to help others
- Track request status (Open, In Progress, Closed)
- Priority levels and time estimates

### Leaderboard
- Weekly activity tracking
- Top contributors ranking
- Streak tracking for consistent engagement

### Additional Features
- GPA calculator
- Real-time notifications
- User onboarding flow
- Activity tracking

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with httpOnly cookies (24-hour expiration)
- **Real-time**: Socket.io for chat and notifications


### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context API
- **Icons**: React Icons
- **Real-time**: Socket.io Client

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Steps

1. Clone the repository
```bash
git clone <repository-url>
cd SkillConnect
```

2. Install dependencies for both frontend and backend
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

## Running the Application

### Development Mode

1. Run the backend server
```bash
cd backend
npm run dev
(note that this command should be used)
```
The backend will run on http://localhost:5000

2. In a new terminal, run the frontend
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:5173 - http://localhost:5176

4. Open your browser and navigate to http://localhost:5173 

### Production Mode

1. Build the frontend
```bash
cd frontend
npm run build
```

2. The backend can serve the built frontend files (if configured)

## Environment Variables

### Backend (.env file in /backend)
```
PORT=5000
MONGO_URL=mongodb://localhost:27017/skillconnect
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Frontend
Frontend environment variables can be configured in Vite using `.env` files with `VITE_` prefix if needed.

Default API URL is configured in the code. Update API endpoints in frontend if your backend runs on a different port.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Verify authentication status

### Users
- `GET /api/users` - Get all users (with filters)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/search` - Search users by skills/category

### Profiles
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/update` - Update own profile

### Messages
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/:conversationId` - Get messages in conversation
- `POST /api/messages` - Send a new message

### Conversations
- `GET /api/conversations` - Get all conversations for user
- `POST /api/conversations` - Create new conversation

### Discussions
- `GET /api/discussions` - Get all discussions
- `POST /api/discussions` - Create a new discussion
- `GET /api/discussions/:id` - Get discussion by ID

### Skill Requests
- `GET /api/skill-requests` - Get all skill requests
- `POST /api/skill-requests` - Create a skill request
- `PUT /api/skill-requests/:id` - Update skill request
- `POST /api/skill-requests/:id/apply` - Apply to help with request

### Search
- `GET /api/search` - Search across platform (with category, skillLevel, availability filters)

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard rankings

## Database Models

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed),
  name: String (required),
  headline: String,
  university: String,
  location: String,
  about: String,
  gpa: Number,
  verified: Boolean,
  
  skills: [{
    title: String,
    detail: String,
    rating: Number (1-5)
  }],
  activityStreak: Number,
  lastActive: Date,
  createdAt: Date
}
```

### Message Model
```javascript
{
  conversationId: ObjectId (ref: Conversation),
  senderId: ObjectId (ref: User),
  content: String,
  read: Boolean,
  createdAt: Date
}
```

### Conversation Model
```javascript
{
  participants: [ObjectId] (ref: User),
  lastMessage: String,
  lastMessageTime: Date,
  createdAt: Date
}
```



### Discussion Model
```javascript
{
  author: ObjectId (ref: User),
  title: String,
  content: String,
  category: String (enum: Academics, Coding, Events, General),
  tags: [String],
  likes: [ObjectId] (ref: User),
  views: Number,
  createdAt: Date
}
```

### SkillRequest Model
```javascript
{
  author: ObjectId (ref: User),
  title: String,
  description: String,
  tags: [String],
  timeEstimate: String,
  priority: String (enum: Low, Medium, High, Critical),
  status: String (enum: Open, In Progress, Closed),
  applicants: [ObjectId] (ref: User),
  createdAt: Date
}
```

## Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Ensure MongoDB is running on your system
- Check the MONGO_URI in your .env file
- For MongoDB Atlas, verify your IP whitelist and credentials

**Port Already in Use**
- Change the PORT in backend/.env
- Kill the process using port 5000: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`

**JWT Authentication Errors**
- Clear browser cookies
- Verify JWT_SECRET is set in .env
- Check that cookies are being sent with requests

### Frontend Issues

**API Connection Failed**
- Verify backend is running on the correct port
- Check API endpoint URLs in frontend code
- Look for CORS errors in browser console

**Socket.io Not Connecting**
- Ensure backend Socket.io is initialized
- Check that frontend is connecting to correct backend URL
- Verify firewall settings

**Build Errors**
- Delete node_modules and package-lock.json, then run `npm install` again
- Clear Vite cache: `rm -rf node_modules/.vite`

### Common Issues

**Users Not Appearing in Search**
- Check filter settings (Category, Skill Level, Availability)
- Verify users have the required skills in their profiles
- Clear filters using "Clear Filters" button

**Messages Not Sending**
- Check browser console for Socket.io errors
- Verify you're logged in
- Ensure conversation exists between users

**Profile Avatar Not Showing**
- Profile pictures use initials by default
- Verify user has a name in their profile
- Check that name is properly formatted

**Suggestions Not Working**
- Add skills to your profile first
- Suggestions are based on skill matching
- Refresh the page if suggestions don't load

## Project Structure

```
SkillConnect/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middlewares/     # Auth and upload middlewares
│   ├── seedUsers.js     # Database seeding
│   ├── seedChats.js     # Chat data seeding
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── Pages/       # Main page components
│   │   ├── components/  # Reusable components
│   │   ├── assets/      # Static assets
│   │   ├── App.jsx      # Root component
│   │   └── main.jsx     # Entry point
│   └── public/          # Public assets
└── README.md
```

## Contributing

This is an academic project for 2nd year 2nd semester web development course.

## License

This project is created for educational purposes.
