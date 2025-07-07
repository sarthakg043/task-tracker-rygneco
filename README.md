# Personal Task Tracker

## 📖 Description
A feature-rich, modern todo application built with React and Redux Toolkit. This application provides a comprehensive task management solution with user authentication, priority management, tag organization, and a beautiful dark/light theme system. Perfect for organizing personal tasks with advanced filtering and categorization capabilities.

## 🚀 Features

### 🔐 Authentication System
- User registration and login functionality
- Session persistence across browser refreshes
- Protected routes for secure access
- Logout functionality with clean session management

### 📋 Task Management
- Create, read, update, and delete tasks
- Task completion tracking with visual indicators
- Rich task descriptions with character limits
- Date picker for setting target dates
- Mobile-responsive design

### 🏷️ Priority System
- Three priority levels: High (🚩), Medium (🟡), Low (🔵)
- Visual priority indicators with colored flags
- Smart sorting by priority (high to low)
- Optional priority setting

### 🏷️ Tag Organization
- Custom tag creation with autocomplete
- Tag persistence and suggestions
- 8 different color-coded tag themes
- Easy tag removal and editing
- Hash-prefixed tag display (#tag)

### 🎨 Theme & UI
- Dark/Light mode toggle
- Beautiful background with overlay effects
- Responsive design for all devices
- Modern UI with Shadcn components
- Smooth animations and transitions

### 📊 Advanced Filtering
- Filter by completion status (All, Pending, Completed)
- Real-time task statistics
- Smart empty state messages
- Live count updates

### 💾 Data Persistence
- Local storage integration
- No data loss on page refresh
- Automatic save functionality
- Tag history preservation

## 🛠 Setup Instructions

1. Clone the repository
   ```bash
   git clone https://github.com/sarthakg043/task-tracker-rygneco
   cd redux-todoapp
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the displayed local URL (typically [http://localhost:5173](http://localhost:5173))

5. Create an account or login to start managing your tasks!

## 🧰 Technologies Used

- **React.js** - Frontend framework
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Date-fns** - Date utility library
- **React Day Picker** - Date selection component
- **Class Variance Authority** - CSS class management
- **Clsx** - Conditional class names utility

## 🎯 Key Highlights

- **Full-Stack Feel**: Complete authentication flow with protected routes
- **Modern Architecture**: Built with latest React patterns and Redux Toolkit
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Rich Features**: Priority management, tags, filtering, and date tracking
- **User Experience**: Intuitive interface with smart suggestions and autocomplete
- **Data Persistence**: Never lose your tasks with local storage integration
- **Customizable**: Dark/light themes and personalized tag organization

## 🚀 Build for Production

```bash
npm run build
```

The optimized production build will be created in the `dist` folder, ready for deployment to any static hosting service.