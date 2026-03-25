# Project Tracker UI

A fully custom-built frontend application for managing project tasks across multiple views. This project was developed as part of a technical assessment to demonstrate advanced frontend engineering skills, including performance optimization, state management, and complex UI interactions — all without relying on external UI or drag-and-drop libraries.

---

## Overview

The application provides three different ways to visualize and interact with the same dataset:

* Kanban Board for workflow management
* List View for structured data and bulk actions
* Timeline (Gantt View) for time-based planning

All views are synchronized through a shared global state, ensuring seamless transitions without data re-fetching.

---

## Key Features

### 1. Multi-View Architecture

The same dataset is rendered across three independent views:

* Kanban View: Tasks grouped by status with drag-and-drop support
* List View: Sortable table with virtual scrolling for performance
* Timeline View: Date-based visualization of tasks across a monthly scale

Switching between views is instantaneous, as all data is managed centrally.

---

### 2. Custom Drag-and-Drop System

A fully manual drag-and-drop system was implemented using pointer events, without any third-party libraries.

* Tasks can be moved across columns
* A floating preview follows the cursor
* A placeholder maintains layout stability
* Invalid drops trigger a smooth snap-back behavior

This required careful handling of pointer states, drop validation, and UI feedback.

---

### 3. Virtual Scrolling (Performance Optimization)

To efficiently handle large datasets (500+ tasks), virtual scrolling was implemented from scratch.

* Only visible rows are rendered in the DOM
* Off-screen elements are replaced with calculated spacing
* Scroll position is preserved accurately

This significantly improves performance and prevents UI lag.

---

### 4. Timeline (Gantt View)

Tasks are visualized along a horizontal time axis representing the selected month.

* Start and due dates are mapped to pixel positions
* Tasks render as horizontal bars
* Tasks without a start date are shown as single-day markers
* A vertical line indicates the current day
* Supports dynamic month navigation

---

### 5. Filters with URL Synchronization

Users can filter tasks by:

* Status
* Priority
* Assignee

Filters are:

* Applied instantly
* Synced with the URL as query parameters
* Restored on page reload or navigation

This makes the application state shareable and bookmarkable.

---

### 6. Simulated Real-Time Collaboration

A lightweight simulation of collaborative activity was implemented:

* Multiple virtual users are generated
* Users randomly move across tasks at intervals
* Active users are shown as avatars on task cards
* A presence bar displays how many users are viewing the board

---

## Tech Stack

* React (TypeScript) – Component-based architecture with type safety
* Zustand – Lightweight global state management
* Tailwind CSS – Utility-first styling
* Vite – Fast development and build tooling

---

## Setup Instructions

```bash
npm install
npm run dev
```

---

## Challenges Faced & Solutions

### 1. Implementing Drag-and-Drop Without Libraries

Challenge:
Handling drag interactions manually while ensuring smooth UI updates and correct state transitions was complex.

Solution:
Pointer events were used to track drag movement. A global drag state was maintained using Zustand, and a floating overlay was rendered to follow the cursor. A placeholder element was introduced to prevent layout shifts during dragging.

---

### 2. Preventing Layout Shift During Drag

Challenge:
Removing a dragged element from the DOM caused surrounding elements to collapse.

Solution:
A placeholder with the same height as the dragged card was rendered in its original position. This preserved the layout and improved user experience.

---

### 3. Virtual Scrolling Without External Libraries

Challenge:
Rendering hundreds of rows caused performance issues and lag.

Solution:
Only visible rows were rendered by calculating start and end indices based on scroll position. The total height was preserved using a container, and rows were positioned absolutely to maintain correct alignment.

---

### 4. Synchronizing Filters with URL

Challenge:
Ensuring filters persisted across reloads and navigation.

Solution:
Query parameters were used to store filter state. On initial load, the application parses the URL and restores filters. Any filter change updates the URL automatically.

---

### 5. Timeline Date Mapping

Challenge:
Accurately converting dates into visual positions on a timeline.

Solution:
Each day was mapped to a fixed pixel width. Task positions were calculated using date differences, and edge cases (like missing start dates or cross-month spans) were handled explicitly.

---

### 6. Managing Shared State Across Views

Challenge:
Keeping all views in sync without redundant data fetching.

Solution:
A centralized Zustand store was used to manage tasks and UI state. This ensured consistency across Kanban, List, and Timeline views.

---

## Performance Considerations

* Virtual scrolling ensures smooth rendering for large datasets
* Minimal re-renders through scoped state updates
* Efficient DOM usage by rendering only necessary elements

---

## Future Improvements

* Add animations for smoother transitions
* Improve accessibility (keyboard navigation, ARIA roles)
* Integrate real-time backend using WebSockets
* Enhance mobile responsiveness

---

## Conclusion

This project demonstrates the ability to build complex, high-performance frontend systems from scratch without relying on external UI or interaction libraries. It focuses on clean architecture, efficient rendering, and precise control over user interactions.

---

## Live Demo

(Deploy link here)

---
"# Project-Tracker" 
