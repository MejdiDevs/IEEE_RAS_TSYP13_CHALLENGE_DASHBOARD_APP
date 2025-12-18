# RAS Challenge Dashboard - Application Description

## Overview

A comprehensive React-based fleet management dashboard for autonomous vehicle task allocation and real-time communication monitoring. The application provides intelligent task assignment algorithms, real-time data visualization, and communication log analysis for managing fleets of autonomous vehicles.

## Core Functionality

### Vehicle-Task Allocation System

The application implements a **greedy allocation algorithm** that assigns tasks to vehicles based on:
- **Cost computation**: Calculates assignment scores considering:
  - Euclidean distance between vehicle and task locations
  - Vehicle capabilities matching task requirements
  - Vehicle remaining capacity vs task demand
  - Time window constraints (arrival time penalties)
  - Task priority multipliers
- **Greedy assignment**: Iteratively assigns tasks to vehicles with highest cost scores until all feasible tasks are allocated
- **Route optimization**: Computes optimal route lengths for each vehicle based on assigned tasks

### Data Models

**Vehicle Model:**
- `id` (string): Unique vehicle identifier
- `capacity` (number): Weight/load capacity
- `energy_capacity` (number): Energy/battery capacity
- `location` ([number, number]): [longitude, latitude] coordinates
- `speed` (number): Movement speed
- `vehicle_type` ('delivery' | 'reconnaissance' | 'strike'): Primary vehicle type
- `capabilities` (string[]): Array of task types the vehicle can perform
- `remaining_capacity` (number): Calculated remaining capacity after assignments

**Task Model:**
- `id` (string): Unique task identifier
- `location` ([number, number]): [longitude, latitude] coordinates
- `demand` (number): Required capacity/weight
- `time_window` ([number, number]): [start_time, end_time] for task completion
- `priority` (number): Priority level (1-5, higher is more important)
- `task_type` (string): Type of task ('delivery', 'reconnaissance', etc.)
- `service_time` (number, optional): Time required to complete task
- `estimated_energy` (number, optional): Energy consumption estimate
- `required_uavs` (number, optional): Number of vehicles needed

**Communication Event Model:**
- `type`: 'mesh_message' | 'vehicle_status'
- `sim_time`: Simulation timestamp
- For mesh_message: `from`, `to`, `message` (with `message_type`: 'FORWARD_ANNOUNCEMENT' | 'WINNER_DECISION')
- For vehicle_status: `agent`, `battery`, `current_edge`, `next_edge`, `current_task`, `assigned_tasks[]`

## Technical Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom color palette
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Authentication**: Firebase Auth (Email/Password + Google Sign-in)
- **Database**: Firebase Realtime Database
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Key Features

### 1. Dashboard Views

**Data Tab:**
- Tables displaying all vehicles and tasks with full details
- Edit/delete functionality for vehicles and tasks
- Responsive table layouts

**Allocation Tab:**
- Allocation results table showing:
  - Vehicle assignments
  - Remaining capacity per vehicle
  - Route distances
- Cost matrix table showing computed costs for all vehicle-task pairs

**Visualization Tab:**
- Interactive SVG map showing:
  - Vehicle positions (triangular markers)
  - Task locations (square markers)
  - Route lines connecting vehicles to assigned tasks
  - Color-coded by vehicle
  - Focus filter to highlight specific vehicles

**Dashboards Tab:**
- Bar chart: Tasks per vehicle
- Bar chart: Route distance per vehicle
- Bar chart: Task priority distribution

**Vehicle Alerts Tab:**
- Alerts for:
  - Overloaded vehicles (High severity)
  - Heavily loaded vehicles >80% capacity (Medium severity)
  - Idle vehicles with no tasks (Low severity)

**Unallocated Tasks Tab:**
- Table of tasks that couldn't be assigned (capacity/time constraints)

**Notifications Tab:**
- Task notifications sorted by time window
- Urgency levels based on priority (High/Medium/Low)

### 2. Communication Log Viewer

- **Task Announcements Table**: Shows FORWARD_ANNOUNCEMENT messages with time, from/to, task details, pickup/delivery edges, weight
- **Winner Decisions Table**: Shows WINNER_DECISION messages with winner, best bid, best holder
- **Vehicle Status Table**: Shows real-time vehicle status with battery, current/next edge, assigned tasks
- **Vehicle Filter**: Dropdown to filter all tables by specific vehicle

### 3. Data Management

- **File Upload**: JSON config files for vehicles/tasks (normalizes and validates data)
- **File Upload**: JSON communication log files
- **Data Download**: Export current scenario (vehicles + tasks) as JSON
- **CRUD Operations**: Add, edit, delete vehicles and tasks
- **Real-time Sync**: All data synced to Firebase Realtime Database per user

### 4. Configuration Normalization

The app includes a `normalizeConfig` function that:
- Validates vehicle data and sets defaults (capacity: 0, location: [0,0], speed: 5.0, etc.)
- Filters out tasks with type 'strike' (not allowed)
- Sets default values for missing task properties
- Returns warnings for removed/invalid entries

## Firebase Integration

### Authentication
- Email/password authentication
- Google Sign-in
- Protected routes requiring authentication
- User session management

### Realtime Database Structure
```
users/
  {userId}/
    vehicles/
      {vehicleId}/ {vehicle data}
    tasks/
      {taskId}/ {task data}
    commEvents/
      {eventId}/ {event data}
    warnings/
      {index}/ {warning string}
```

### Data Context
- Real-time listeners for vehicles, tasks, commEvents, warnings
- CRUD operations with Firebase
- Automatic data sync across sessions

## UI/UX Design

### Color Palette
- Primary Purple: `#57135C`
- Dark Purple: `#530E3F`
- Dark Blue: `#172A86`
- Blue: `#023EAC`
- Light Blue: `#085FD2`

### Design Principles
- **Dark theme** with gradient backgrounds
- **Glass morphism effects**: Backdrop blur with translucent backgrounds
- **Gradient text**: Multi-color gradients on headings
- **Smooth animations**: Framer Motion for transitions and interactions
- **Responsive design**: Mobile-first, works on all screen sizes
- **Modern UI components**: shadcn/ui style components
- **Floating popups**: Modal dialogs for add/edit forms with:
  - Blurred background overlay
  - Smooth enter/exit animations
  - Clean, modern styling

### Landing Page
The landing page should be **creative, dynamic, and futuristic** - avoiding blocky, AI-generated layouts. It should feel natural and organic with:
- Animated gradient backgrounds
- Smooth, flowing animations
- Natural spacing and typography
- Engaging visual elements
- Professional yet approachable design

## Key Algorithms

### Euclidean Distance
```typescript
distance = sqrt((x1-x2)² + (y1-y2)²)
```

### Cost Computation
```typescript
baseScore = 1000 / (1 + distance)
finalCost = baseScore × priority × capabilityBonus × capacityPenalty × timePenalty
// Returns -Infinity if vehicle can't handle task
```

### Route Length Calculation
- Sorts assigned tasks by distance from vehicle
- Calculates cumulative distance along route
- Returns total route length per vehicle

### Alert Generation
- Checks vehicle remaining capacity vs assigned demand
- Flags overloaded vehicles
- Warns about high utilization (>80%)
- Identifies idle vehicles

## Component Structure

- **Pages**: Dashboard, Communication, Landing, Login
- **Components**:
  - Forms: VehicleForm, TaskForm (modal popups)
  - Dashboard: AllocationMap, Charts, DataTables, AllocationTable, AlertsAndNotifications
  - Communication: CommLog
  - Layout: Sidebar
  - Auth: Login
  - UI: Button, Input, Label, Card, Dialog, Select, Tabs
- **Contexts**: AuthContext, DataContext
- **Lib**: allocation.ts (algorithms), normalize.ts (data processing), firebase.ts (config)

## Environment Configuration

Uses `.env` file for Firebase configuration:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Key Implementation Details

1. **Allocation Algorithm**: Runs on every vehicles/tasks data change, recalculates assignments
2. **Real-time Updates**: Firebase listeners update UI automatically
3. **Data Validation**: Normalization ensures data integrity
4. **Error Handling**: Toast notifications for user feedback
5. **Responsive Tables**: Horizontal scroll on mobile
6. **Interactive Maps**: SVG-based with coordinate scaling
7. **Chart Integration**: Recharts for all visualizations
8. **Modal Forms**: Framer Motion animations for smooth UX

## File Structure

```
src/
  components/
    ui/          # Reusable UI components
    Auth/        # Authentication components
    Dashboard/   # Dashboard-specific components
    Communication/ # Communication log components
    Layout/      # Layout components (Sidebar)
  contexts/      # React contexts (Auth, Data)
  lib/           # Utilities (allocation, normalize, firebase)
  pages/         # Page components
  types/         # TypeScript type definitions
```

This application provides a complete solution for managing autonomous vehicle fleets with intelligent task allocation, real-time monitoring, and comprehensive analytics.

