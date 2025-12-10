#This is our 2nd year 2nd semester web project

#Team members:
    Dinil Hansara
    Isira Dilum
    Sehansa Manothmi
    Tiranga Liyanage
    Heshan Hansana
# Backend Plan & Design Document

## 1. Executive Summary
This document outlines the backend architecture for the application. The system will support user profiles, skill requests, community discussions, real-time chat, and social features (pokes, reviews). The backend will be built using a **Node.js/Express** Monolith (modular structure), backed by **MongoDB**, and utilizing **Socket.io** for real-time capabilities.

## 2. Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (via Mongoose ODM)
-   **Authentication**: Passport.js (Google/GitHub strategies) + JWT (JSON Web Tokens) for session management.
-   **Real-time**: Socket.io (Chat messages, Notifications/Pokes)
-   **Validation**: Joi or Zod
-   **File Storage**: Cloudinary or AWS S3 (for Profile/Cover images) - *Optional, but recommended for production.*

---

## 3. Project Structure
We will use a Layered Architecture (Controller-Service-Repository pattern) to keep business logic separate from API routes.

```text
server/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ config/         # DB connection, Passport config, Env vars
â”‚   â”œâ”€â”€ controllers/    # Request handlers (req, res logic)
â”‚   â”œâ”€â”€ models/         # Mongoose Schemas
â”‚   â”œâ”€â”€ routes/         # API Route definitions
â”‚   â”œâ”€â”€ services/       # Business logic
â”‚   â”œâ”€â”€ middlewares/    # Auth checks, Error handling, Validation
â”‚   â”œâ”€â”€ sockets/        # Socket.io event handlers
â”‚   â”œâ”€â”€ utils/          # Helper functions
â”‚   â””â”€â”€ server.js       # Entry point
â”œâ”€â”€ .env                # Environment variables (Sensitive)
â””â”€â”€ package.json
```

---

## 4. Database Schema (Mongoose Models)

### A. User (Profile) Model
Stores authentication info and profile details found in `ProfileOwnerView`.

```javascript
const UserSchema = new Schema({
  // Auth
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false }, // Hashed
  googleId: String,
  githubId: String,
  
  // Basic Profile
  name: { type: String, required: true },
  pronouns: String,
  headline: String, // e.g., "Product Manager | UX Enthusiast"
  university: String,
  location: String,
  about: String, // Description
  
  // Images
  profileImage: String,
  coverImage: String, // URL or gradient string like "from-blue-600 to-cyan-500"
  
  // Portfolio
  portfolio: [{
    title: String,
    url: String,
    iconType: String // "github", "linkedin", "globe"
  }],

  // Skills
  skills: [{
    title: String,
    detail: String, // "(React/Next.js)"
    rating: Number, // 1-5
  }],

  // Social Stats
  pokes: [{
    fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }],
  
  createdAt: { type: Date, default: Date.now }
});
```

### B. Feedback/Review Model
Stores reviews on user profiles (`ProfileViewerView`).

```javascript
const FeedbackSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
```

### C. Post Model (Community & Feed)
Used for both the Community Page discussions and Personal Feed posts.

```javascript
const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  image: String, // Optional attachment
  
  // Community specific fields
  title: String, // For community discussions
  category: { type: String, enum: ['Academics', 'Coding', 'Events', 'General', 'Feed'], default: 'Feed' },
  tags: [String],
  
  // Interaction
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now }
});
```

### D. Comment Model
Replies to posts.

```javascript
const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
```

### E. Skill Request Model
For the `SkillRequest` page.

```javascript
const SkillRequestSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  timeEstimate: String, // e.g. "2-3 hours"
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
  responses: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Users who offered help
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
  createdAt: { type: Date, default: Date.now }
});
```

### F. Chat/Message Model
For the `MessagePage`.

```javascript
const ConversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: String },
  lastMessageTime: { type: Date },
});

const MessageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});
```

---

## 5. API Routes (REST)

### Authentication (`/api/auth`)
-   `POST /register`: Create account with email/password.
-   `POST /login`: Login with email/password, returns JWT.
-   `GET /google`: Initiate Google OAuth.
-   `GET /google/callback`: Handle Google callback.
-   `GET /github`: Initiate GitHub OAuth.

### Profile (`/api/users`)
-   `GET /me`: Get current logged-in user's profile.
-   `PUT /me`: Update profile (Bio, Skills, Portfolio, Images).
-   `GET /:userId`: View another user's profile.
-   `POST /:userId/poke`: "Poke" a user (Triggers Notification + Socket event).
-   `POST /:userId/feedback`: Add a review/feedback.

### Posts/Community (`/api/posts`)
-   `GET /`: Get posts (with filters: category, tags, search).
-   `POST /`: Create a new post or discussion.
-   `GET /:id`: Get single post details.
-   `POST /:id/like`: Like/Unlike a post.
-   `POST /:id/comments`: Add a comment.

### Skill Requests (`/api/skill-requests`)
-   `GET /`: List all requests (filters: priority, tags).
-   `POST /`: Create a new request.
-   `PUT /:id/respond`: Offer help (increment response count).

### Chat (`/api/chat`)
-   `GET /conversations`: List user's conversations.
-   `GET /messages/:conversationId`: Get message history.
-   `POST /messages`: Send a message (also handled via Socket.io).

---

## 6. Real-time Features (Socket.io)

The backend will initialize a Socket.io server instance sharing the HTTP port.

**Events:**

1.  **Connection**: Authenticate user via JWT in handshake auth. Map `userId` to `socketId`.
2.  **Messaging**:
    -   **Client Emits**: `send_message` { recipientId, content }
    -   **Server**: Saves to DB -> Emits `receive_message` to recipient's socket.
3.  **Pokes/Notifications**:
    -   **Server (triggered via API)**: When `POST /:userId/poke` is called, server emits `notification` event to target user: `{ type: 'poke', from: userObj }`.
4.  **Online Status**:
    -   Broadcast `user_online` and `user_offline` events to friends/connections.

---

## 7. Implementation Roadmap

1.  **Setup**: Initialize Node project, install dependencies (`express`, `mongoose`, `socket.io`, `dotenv`, `cors`, `passport`).
2.  **Database**: Connect to MongoDB Atlas.
3.  **Auth System**: Implement Register/Login and JWT middleware.
4.  **Core API**: Build CRUD for User Profiles and Posts.
5.  **Community & Skills**: Implement search filters and logic for the Skill Board.
6.  **Real-time Chat**: Integrate Socket.io for live messaging.
7.  **Testing**: Verify API with Postman/Insomnia.
