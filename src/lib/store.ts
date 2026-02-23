import { addEdge, type Connection, type Edge, type Node } from "reactflow";
import { create } from "zustand";

export interface WikiNodeData {
  title: string;
  summary: string;
  url: string;
  category: string;
  links: string[];
  popularity: number;
  lastEdited?: string;
}

export type WikiNode = Node<WikiNodeData>;

export type WikiEdge = Edge & { frequency?: number };

export type LayoutMode = "force" | "radial" | "manual";

export interface FilterState {
  categories: string[];
  linkDensity: "all" | "high" | "medium" | "low";
}

interface GraphState {
  nodes: WikiNode[];
  edges: Edge[];
  selectedNode: string | null;
  isArticleSheetOpen: boolean;
  layoutMode: LayoutMode;
  filter: FilterState;
  recentUrls: string[];
}

interface GraphActions {
  setNodes: (nodes: WikiNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: WikiNode) => void;
  addEdge: (connection: Connection) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, data: Partial<WikiNodeData>) => void;
  selectNode: (id: string | null) => void;
  setArticleSheetOpen: (open: boolean) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setFilter: (filter: Partial<FilterState>) => void;
  addRecentUrl: (url: string) => void;
  clearGraph: () => void;
  exportGraph: () => string;
  importGraph: (json: string) => void;
}

const initialState: GraphState = {
  nodes: [],
  edges: [],
  selectedNode: null,
  isArticleSheetOpen: false,
  layoutMode: "force",
  filter: {
    categories: [],
    linkDensity: "all",
  },
  recentUrls: [],
};

export const useGraphStore = create<GraphState & GraphActions>((set, get) => ({
  ...initialState,

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  addEdge: (connection) =>
    set((state) => ({
      edges: addEdge(connection, state.edges),
    })),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNode: state.selectedNode === id ? null : state.selectedNode,
    })),

  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n,
      ),
    })),

  selectNode: (id) =>
    set({ selectedNode: id, isArticleSheetOpen: id !== null }),

  setArticleSheetOpen: (open) => set({ isArticleSheetOpen: open }),

  setLayoutMode: (layoutMode) => set({ layoutMode }),

  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
    })),

  addRecentUrl: (url) =>
    set((state) => {
      const filtered = state.recentUrls.filter((u) => u !== url);
      return {
        recentUrls: [url, ...filtered].slice(0, 10),
      };
    }),

  clearGraph: () => set(initialState),

  exportGraph: () => {
    const { nodes, edges, layoutMode, filter } = get();
    return JSON.stringify(
      { nodes, edges, layoutMode, filter, version: 1 },
      null,
      2,
    );
  },

  importGraph: (json) => {
    try {
      const data = JSON.parse(json);
      if (data.nodes && data.edges) {
        set({
          nodes: data.nodes,
          edges: data.edges,
          layoutMode: data.layoutMode || "force",
          filter: data.filter || initialState.filter,
        });
      }
    } catch (error) {
      console.error("Failed to import graph:", error);
    }
  },
}));
