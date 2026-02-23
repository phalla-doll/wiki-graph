import type { Edge, Node } from "reactflow";
import type { FilterState } from "@/lib/store";

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
  layoutMode: string;
  filter: FilterState;
  version: number;
}

const STORAGE_KEY = "wiki-graph-data";
const RECENT_URLS_KEY = "wiki-graph-recent-urls";

export function saveGraphToStorage(data: GraphData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving graph to storage:", error);
  }
}

export function loadGraphFromStorage(): GraphData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading graph from storage:", error);
  }
  return null;
}

export function clearGraphFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing graph from storage:", error);
  }
}

export function saveRecentUrls(urls: string[]): void {
  try {
    localStorage.setItem(RECENT_URLS_KEY, JSON.stringify(urls));
  } catch (error) {
    console.error("Error saving recent URLs:", error);
  }
}

export function loadRecentUrls(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_URLS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading recent URLs:", error);
  }
  return [];
}

export function exportGraphAsJson(data: GraphData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wiki-graph-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importGraphFromJson(json: string): GraphData | null {
  try {
    const data = JSON.parse(json);
    if (data.nodes && data.edges) {
      return data;
    }
  } catch (error) {
    console.error("Error importing graph from JSON:", error);
  }
  return null;
}

export function fileToJson(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}
