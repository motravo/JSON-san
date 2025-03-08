# Setup Instructions

This project has been converted from a simple HTML/JS application to a React application. Here's how to set it up:

## Prerequisites

Make sure you have Node.js installed (version 14 or higher).

## Installation Steps

1. Install dependencies:

```
npm install
```

2. Start the development server:

```
npm start
```

The application will open in your browser at http://localhost:3000.

## Application Features

- Paste JSON in the text area and click "Submit" to render it as a collapsible tree
- Click on object or array nodes to expand/collapse them
- Use the "[Explode]" button to expand all children at once
- Click the "[^]" button next to values in arrays to add that value to the array item label
- Click "Reset" to return to the input form

## Comparison with Original Version

The React version maintains all the functionality of the original HTML/JS version while adding:

- Component-based architecture for better maintainability
- State management using React hooks
- Reset button to go back to input form
- Better separation of concerns between UI and logic