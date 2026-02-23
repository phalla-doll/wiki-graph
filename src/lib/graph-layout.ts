import dagre from "dagre";
import type { Edge } from "reactflow";
import type { LayoutMode, WikiNode } from "./store";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export interface LayoutOptions {
  mode: LayoutMode;
  direction?: "TB" | "LR" | "BT" | "RL";
  nodeWidth?: number;
  nodeHeight?: number;
  spacing?: number;
}

export function applyForceDirectedLayout(
  nodes: WikiNode[],
  edges: Edge[],
  _options?: LayoutOptions,
): { nodes: WikiNode[]; edges: Edge[] } {
  return applyDagreLayout(nodes, edges, {
    mode: "force",
    direction: "TB",
    nodeWidth: 200,
    nodeHeight: 150,
    spacing: 100,
  });
}

export function applyRadialLayout(
  nodes: WikiNode[],
  edges: Edge[],
  options?: LayoutOptions,
): { nodes: WikiNode[]; edges: Edge[] } {
  const spacing = options?.spacing || 150;

  if (nodes.length === 0) {
    return { nodes, edges };
  }

  const _nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const adjacencies = new Map<string, string[]>();

  edges.forEach((edge) => {
    if (!adjacencies.has(edge.source)) {
      adjacencies.set(edge.source, []);
    }
    if (!adjacencies.has(edge.target)) {
      adjacencies.set(edge.target, []);
    }
    adjacencies.get(edge.source)?.push(edge.target);
    adjacencies.get(edge.target)?.push(edge.source);
  });

  const positionedNodes = new Map<string, { x: number; y: number }>();
  const visited = new Set<string>();

  const rootNode = nodes[0];
  positionedNodes.set(rootNode.id, { x: 0, y: 0 });
  visited.add(rootNode.id);

  const queue: {
    nodeId: string;
    level: number;
    parentX: number;
    parentY: number;
  }[] = [
    {
      nodeId: rootNode.id,
      level: 0,
      parentX: 0,
      parentY: 0,
    },
  ];

  const angleStep = (2 * Math.PI) / 8;

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    const neighbors = adjacencies.get(current.nodeId) || [];

    const unvisitedNeighbors = neighbors.filter((n) => !visited.has(n));

    if (unvisitedNeighbors.length === 0) continue;

    const radius = spacing * (current.level + 1);
    const startAngle = Math.random() * 2 * Math.PI;

    unvisitedNeighbors.forEach((neighborId, index) => {
      const angle = startAngle + index * angleStep;
      const x = current.parentX + Math.cos(angle) * radius;
      const y = current.parentY + Math.sin(angle) * radius;

      positionedNodes.set(neighborId, { x, y });
      visited.add(neighborId);

      queue.push({
        nodeId: neighborId,
        level: current.level + 1,
        parentX: x,
        parentY: y,
      });
    });
  }

  const laidOutNodes = nodes.map((node) => {
    const position = positionedNodes.get(node.id);
    return {
      ...node,
      position: position || { x: 0, y: 0 },
    };
  });

  return { nodes: laidOutNodes, edges };
}

export function applyDagreLayout(
  nodes: WikiNode[],
  edges: Edge[],
  options?: LayoutOptions,
): { nodes: WikiNode[]; edges: Edge[] } {
  const nodeWidth = options?.nodeWidth || 200;
  const nodeHeight = options?.nodeHeight || 150;
  const spacing = options?.spacing || 100;

  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: options?.direction || "TB",
    nodesep: spacing / 2,
    ranksep: spacing / 2,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const laidOutNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: laidOutNodes, edges };
}

export function applyLayout(
  nodes: WikiNode[],
  edges: Edge[],
  options: LayoutOptions,
): { nodes: WikiNode[]; edges: Edge[] } {
  switch (options.mode) {
    case "radial":
      return applyRadialLayout(nodes, edges, options);
    default:
      return applyDagreLayout(nodes, edges, options);
  }
}

export function centerNodes(
  nodes: WikiNode[],
  containerWidth: number,
  containerHeight: number,
): WikiNode[] {
  if (nodes.length === 0) return nodes;

  const xPositions = nodes.map((n) => n.position.x);
  const yPositions = nodes.map((n) => n.position.y);

  const minX = Math.min(...xPositions);
  const maxX = Math.max(...xPositions);
  const minY = Math.min(...yPositions);
  const maxY = Math.max(...yPositions);

  const graphWidth = maxX - minX;
  const graphHeight = maxY - minY;

  const offsetX = (containerWidth - graphWidth) / 2 - minX;
  const offsetY = (containerHeight - graphHeight) / 2 - minY;

  return nodes.map((node) => ({
    ...node,
    position: {
      x: node.position.x + offsetX,
      y: node.position.y + offsetY,
    },
  }));
}
