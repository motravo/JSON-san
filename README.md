# JSON Formatter React App

A simple React application that allows users to paste JSON data and view it in a collapsible tree structure.

## Features

- Paste and validate JSON input
- Collapsible tree view of JSON data
- Expand/collapse individual nodes
- "Explode" feature to expand all child nodes
- Add attributes to array item labels

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:

```
npm install
```

### Running the App

```
npm start
```

The app will start at http://localhost:3000 in your browser.

## Usage

1. Paste your JSON in the text area
2. Click "Submit" to display the JSON tree
3. Click on a node to expand/collapse it
4. Click "[Explode]" to expand all child nodes
5. Click "[^]" next to a value to add it to the parent array's element labels