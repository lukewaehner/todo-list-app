# Todo List Application

A full-stack todo list application with user authentication, group collaboration, and email reminders. Built with Next.js frontend and Node.js/Express backend.

## Features

### Core Functionality
- User registration and authentication with JWT tokens
- Create, edit, and delete personal tasks
- Mark tasks as complete/incomplete
- Set due dates for tasks
- Bulk delete multiple tasks
- Responsive dashboard with modern UI

### Group Collaboration
- Create and manage groups
- Invite users to groups via email
- Assign tasks to group members
- Group administrators can manage members and task assignments
- Accept/reject group invitations

### Email Reminders
- Configurable email reminder frequency (hourly, every 3 hours, every 6 hours, daily, weekly)
- Automated email notifications for upcoming tasks
- Task categorization by time periods (next week, next month, longer term)

### User Settings
- Manage email notification preferences
- View and respond to group invitations
- Group management interface for administrators

## Technology Stack

### Frontend
- **Next.js 14.2.4** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Spring** - Animation library
- **GSAP** - Animation library
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled tasks
- **EmailJS** - Email service

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn package manager

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
node server.js
```

The backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Database Setup

The application uses MongoDB with the following collections:
- **users** - User accounts and preferences
- **tasks** - Individual tasks
- **groups** - Group information and memberships
- **invitations** - Group invitation management

Make sure MongoDB is running locally on the default port (27017) with a database named `todo-list`.

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user info

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create new group
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id/add-member` - Add member to group
- `PUT /api/groups/:id/remove-member` - Remove member from group
- `PUT /api/groups/:id/assign-task` - Assign task to group member

### Invitations
- `POST /api/invitation` - Send group invitation
- `GET /api/invitation` - Get user's invitations
- `PUT /api/invitation/:id/accept` - Accept invitation
- `PUT /api/invitation/:id/reject` - Reject invitation

## Project Structure

```
todo-list-app/
├── backend/
│   ├── config/           # Configuration files
│   ├── middleware/       # Authentication middleware
│   ├── models/          # Database models
│   ├── reminderservice/ # Email reminder system
│   ├── routes/          # API routes
│   └── server.js        # Main server file
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       └── app/
│           ├── dashboard/    # Main dashboard
│           ├── login/        # Login page
│           ├── register/     # Registration page
│           ├── settings/     # User settings
│           └── lib/          # Shared components and utilities
└── README.md
```

## Usage

1. **Registration**: Create a new account with name, email, and password
2. **Login**: Access your dashboard with your credentials
3. **Task Management**: Add, edit, and complete tasks with optional due dates
4. **Group Creation**: Create groups and invite other users
5. **Task Assignment**: Assign tasks to group members
6. **Settings**: Configure email reminder preferences and manage invitations

## Email Reminders

The application includes an automated email reminder system that runs on scheduled intervals:
- Hourly reminders
- Every 3 hours
- Every 6 hours
- Daily at 8:00 AM
- Weekly on Mondays at 8:00 AM

Users can configure their preferred reminder frequency in the settings page.

## Development

### Running in Development Mode

1. Start MongoDB service
2. Run backend server: `cd backend && node server.js`
3. Run frontend development server: `cd frontend && npm run dev`

### Building for Production

```bash
cd frontend
npm run build
npm start
```

## Environment Variables

The application uses the following environment variables (create `.env` files as needed):
- `PORT` - Backend server port (default: 5001)
- MongoDB connection string (default: mongodb://localhost:27017/todo-list)

## License

This project is licensed under the ISC License.
