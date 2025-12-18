# RAS Challenge Dashboard

A modern React dashboard for task allocation and vehicle communication management, built with Firebase authentication and real-time database integration.

## Features

- 🔐 **Firebase Authentication**: Email/password and Google sign-in
- 📊 **Real-time Data**: Firebase Realtime Database integration
- 🚗 **Vehicle Management**: Add, edit, and delete vehicles
- 📋 **Task Management**: Add, edit, and delete tasks
- 🗺️ **Visualization**: Interactive allocation maps and charts
- 📡 **Communication Logs**: View and filter communication events
- 📱 **Responsive Design**: Works on all screen sizes
- 🎨 **Modern UI**: shadcn/ui style components with smooth animations

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password and Google)
   - Create a Realtime Database
   - Copy `.env.example` to `.env` and fill in your Firebase credentials

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Firebase project credentials.

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Firebase Configuration

The app uses environment variables for Firebase configuration. Copy `.env.example` to `.env` and update with your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Get these values from your Firebase project settings.

## Database Structure

The app stores data under each user's UID:
```
users/
  {userId}/
    vehicles/
      {vehicleId}/
    tasks/
      {taskId}/
    commEvents/
      {eventId}/
    warnings/
```

## Usage

1. **Landing Page**: Start at the landing page to see an overview and sample data
2. **Sign up/Login**: Create an account or sign in with Google
3. **Load Configuration**: Upload a JSON config file with vehicles and tasks
4. **Add Vehicles/Tasks**: Use the sidebar or dashboard buttons
5. **View Allocations**: See automatic task assignments in the Allocation tab
6. **Visualize**: Check the map and charts for insights
7. **Communication**: Upload and view communication logs

## Features

- 🎨 **Captivating Landing Page**: Beautiful landing page with sample data and feature highlights
- 🔐 **Firebase Authentication**: Secure email/password and Google sign-in
- 📊 **Real-time Data**: Firebase Realtime Database integration
- 🚗 **Vehicle Management**: Add, edit, and delete vehicles
- 📋 **Task Management**: Add, edit, and delete tasks
- 🗺️ **Visualization**: Interactive allocation maps and charts
- 📡 **Communication Logs**: View and filter communication events
- 📱 **Responsive Design**: Works on all screen sizes
- 🎭 **Modern UI**: shadcn/ui style components with smooth animations

## Technologies

- React 18
- TypeScript
- Firebase (Auth + Realtime Database)
- Tailwind CSS
- Recharts
- Framer Motion
- React Router
- Vite

