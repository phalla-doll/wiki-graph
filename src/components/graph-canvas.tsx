"use client";

import { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  addEdge,
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  MiniMap,
  type NodeChange,
  type NodeTypes,
  type OnEdgesChange,
  type OnNodesChange,
  type ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import type { Node } from "reactflow";
import type { LayoutMode, WikiNodeData } from "@/lib/store";
import { WikiNode as WikiNodeComponent } from "./wiki-node";

interface WikiNode extends Node<WikiNodeData> {}

const nodeTypes: NodeTypes = {
  wiki: WikiNodeComponent,
};

interface GraphCanvasProps {
  initialNodes: WikiNode[];
  initialEdges: Edge[];
  layoutMode: LayoutMode;
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onConnect?: (connection: Connection) => void;
  onNodeClick?: (node: WikiNode) => void;
}

export function GraphCanvas({
  initialNodes,
  initialEdges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
}: GraphCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const handleConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      onConnect?.(params);
    },
    [setEdges, onConnect],
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: WikiNode) => {
      onNodeClick?.(node);
    },
    [onNodeClick],
  );

  const handleNodesChangeInternal = useCallback(
    (changes: NodeChange[]) => {
      onNodesChangeInternal(changes);
      onNodesChange?.(changes);
    },
    [onNodesChangeInternal, onNodesChange],
  );

  const handleEdgesChangeInternal = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChangeInternal(changes);
      onEdgesChange?.(changes);
    },
    [onEdgesChangeInternal, onEdgesChange],
  );

  const onInit = useCallback((reactFlowInstance: ReactFlowInstance) => {
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
    }, 100);
  }, []);

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChangeInternal}
        onEdgesChange={handleEdgesChangeInternal}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitViewOptions={{ padding: 0.2, includeHiddenNodes: false }}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as WikiNodeData;
            const colors: Record<string, string> = {
              Science: "#3b82f6",
              History: "#f59e0b",
              People: "#8b5cf6",
              Geography: "#10b981",
              General: "#6b7280",
            };
            return colors[data.category] || colors.General;
          }}
          className="!bg-background !border-border"
        />
      </ReactFlow>
    </div>
  );
}
