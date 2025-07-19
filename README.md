# Learning Path Visualization

A React application with D3.js integration for visualizing learner progress through connected learning paths.

## Features

- **Interactive Learning Path Graph**: Visualize how a learner progresses through a series of connected topics
- **Dynamic Node States**: Each node represents a topic with different statuses (Completed, In Progress, Not Started)
- **Color-Coded Progress**: Visual feedback with green (completed), yellow (in progress), and gray (not started) nodes
- **Interactive Tooltips**: Hover over nodes to see detailed information including topic title, status, and score
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## Technologies Used

- **React** - Modern functional components with hooks
- **D3.js** - Powerful data visualization and DOM manipulation
- **Vite** - Fast build tooling and development server
- **CSS3** - Modern styling with gradients and animations

## Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── LearningPathVisualization.jsx  # Main visualization component
├── LearningPathVisualization.css  # Component styles
├── App.jsx                        # Root component
├── App.css                        # App styles
├── index.css                      # Global styles
└── main.jsx                       # Entry point
```

## Learning Path Data Structure

The visualization uses a sample dataset with 8 interconnected topics representing a mathematics learning path:

- Math Basics → Algebra Fundamentals → Linear Equations
- Algebra Fundamentals → Functions → Graphing Functions
- Linear Equations & Functions → Quadratic Equations
- Graphing Functions & Quadratic Equations → Calculus Introduction → Derivatives

Each node contains:
- `title`: Topic name
- `status`: Current progress state
- `score`: Achievement score (0-100)
- `x`, `y`: Position coordinates for layout


