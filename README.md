# Wiki Graph

**Visual node-based Wikipedia explorer**

Transform Wikipedia into an interactive knowledge graph. Explore connections between concepts spatially instead of browsing linearly.

## Overview

Traditional Wikipedia browsing is linear—you click links one at a time, following paths without seeing the bigger picture. Wiki Graph changes this by making knowledge **spatial and tangible**.

Each Wikipedia page becomes a draggable node. Internal links become clickable connections. As you explore, you build your own expanding knowledge map that reveals how concepts relate to each other.

Think of it as **Obsidian's graph view + Figma's canvas + Mind-mapping tool**, but powered by real encyclopedic knowledge.

## How It Works

1. **Paste a Wikipedia URL** – Start with any article
2. **Fetch page content** – Via Wikipedia REST API
3. **Node appears** – Contains title, summary, and extracted internal links
4. **Click a link** – Spawns a new connected node, positioned near its parent
5. **Explore spatially** – Drag, zoom, pan infinitely through your knowledge graph

## Key Features

### Smart Node Rendering
- Shows only the intro paragraph to keep nodes clean
- Hover to preview more content
- Expand to full article in side panel
- Responsive sizing based on content

### Auto Layout
- **Force-directed graph** – Physics-based positioning
- **Radial layout** – Nodes fan out from parent
- **Manual override** – Drag any node to reposition

### Link Filtering
Filter nodes and connections by:
- **Category** – People, Places, Events, Science, etc.
- **Link density** – Show only popular or rare connections
- **Custom filters** – User-defined rules

### Graph Memory
- Save exploration sessions
- Export as JSON for backup or analysis
- Shareable links for collaborative exploration

### Visual Signals
- **Node size** = Article popularity
- **Color** = Category classification
- **Edge thickness** = Link frequency between pages

## Technical Architecture

### Frontend Stack
- **Framework**: React / Next.js
- **Graph visualization**: React Flow or custom canvas
- **State management**: Zustand for graph state
- **Styling**: Tailwind CSS (optional)

### Data Layer
- **API**: Wikipedia REST API
- **Parsing**: Extract internal links from page HTML
- **Caching**: Store fetched nodes to reduce API calls
- **Persistence**: LocalStorage or backend storage

### Graph Logic

```typescript
Node {
  id: string
  title: string
  summary: string
  links: Link[]
  position: { x: number, y: number }
  category: string
  popularity: number
}

Link {
  target: string
  frequency: number
  category: string
}
```

## Why Wiki Graph?

Linear browsing shows you one path through knowledge. Wiki Graph reveals the **entire landscape**.

**Example: Exploring World War II**

With linear browsing, you might discover:
```
World War II → Atomic Bomb → Manhattan Project → Oppenheimer
```

With Wiki Graph, you simultaneously see all connections:
- How World War II links to military leaders, battles, treaties
- How the Atomic Bomb connects to physics, ethics, nuclear energy
- How Manhattan Project relates to other wartime research
- How Oppenheimer connects to philosophy, politics, other scientists

Knowledge becomes **spatial**, **visual**, and **discoverable**.

## Advanced Ideas (Cool Mode)

Future enhancements to consider:

### AI-Powered Features
- **Per-node summarization** – Condense articles to key insights
- **Semantic similarity detection** – Auto-group related concepts
- **Topic clustering** – Color-code and group nodes by theme

### Historical Exploration
- **Time-travel slider** – See how knowledge networks evolved
- **Historical snapshot** – What was known about X in 1950?
- **Chronological visualization** – Timeline-based graph views

### Enhanced Exploration
- **"Chaos Mode"** – Auto-expand popular links for serendipitous discovery
- **Pathfinding algorithms** – Shortest path between any two concepts
- **Influence mapping** – Trace impact of ideas through time

### Collaboration
- **Multiplayer sessions** – Explore together in real-time
- **Community graphs** – Popular exploration paths
- **Annotation system** – Add notes and highlights to nodes

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd wiki-graph

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to begin exploring.

## Development

The project uses Next.js App Router. Main components:
- `app/` – Application routes
- `components/` – Reusable React components
- `lib/` – Utilities and API helpers
- `stores/` – Zustand state management

## Contributing

Contributions welcome! Areas of interest:
- Graph layout algorithms
- Wikipedia API optimization
- UI/UX improvements
- Performance optimization

## License

[Your License Here]

---

Built with Next.js, Wikipedia API, and a passion for knowledge discovery.
