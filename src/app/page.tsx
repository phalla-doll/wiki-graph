"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { ArticleSheet } from "@/components/article-sheet";
import { GraphCanvas } from "@/components/graph-canvas";
import { GraphControls } from "@/components/graph-controls";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UrlInputPanel } from "@/components/url-input-panel";
import { applyLayout } from "@/lib/graph-layout";
import {
  loadGraphFromStorage,
  loadRecentUrls,
  saveGraphToStorage,
  saveRecentUrls,
} from "@/lib/storage";
import type { LayoutMode, WikiNode, WikiNodeData } from "@/lib/store";
import { useGraphStore } from "@/lib/store";
import { fetchArticle } from "@/lib/wikipedia";

export default function Home() {
  const {
    nodes,
    edges,
    selectedNode,
    isArticleSheetOpen,
    layoutMode,
    recentUrls,
    setNodes,
    setEdges,
    addNode,
    removeNode,
    selectNode,
    setArticleSheetOpen,
    setLayoutMode,
    addRecentUrl,
    clearGraph,
    exportGraph,
    importGraph,
    filter,
  } = useGraphStore();

  const [_isLoading, setIsLoading] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect only runs once on mount
  useEffect(() => {
    const savedGraph = loadGraphFromStorage();
    if (savedGraph) {
      setNodes(savedGraph.nodes);
      setEdges(savedGraph.edges);
    }

    const savedRecentUrls = loadRecentUrls();
    savedRecentUrls.forEach((url) => {
      addRecentUrl(url);
    });

    const handleExpandNode = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail) {
        handleSpawnChildNode(event.detail.parentId, event.detail.title);
      }
    };

    const handleDeleteNode = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail) {
        removeNode(event.detail.id);
      }
    };

    const handleSelectNode = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail) {
        const node = nodes.find((n) => n.id === event.detail.id);
        if (node) {
          selectNode(node.id);
        }
      }
    };

    const handleExpandFromSheet = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail) {
        const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(event.detail.title)}`;
        handleFetchArticle(url);
      }
    };

    window.addEventListener("wiki-expand-node", handleExpandNode);
    window.addEventListener("wiki-delete-node", handleDeleteNode);
    window.addEventListener("wiki-select-node", handleSelectNode);
    window.addEventListener("wiki-expand-from-sheet", handleExpandFromSheet);

    return () => {
      window.removeEventListener("wiki-expand-node", handleExpandNode);
      window.removeEventListener("wiki-delete-node", handleDeleteNode);
      window.removeEventListener("wiki-select-node", handleSelectNode);
      window.removeEventListener(
        "wiki-expand-from-sheet",
        handleExpandFromSheet,
      );
    };
  }, []);

  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const graphData = {
        nodes,
        edges,
        layoutMode,
        filter,
        version: 1,
      };
      saveGraphToStorage(graphData);
      saveRecentUrls(recentUrls);
    }
  }, [nodes, edges, layoutMode, recentUrls, filter]);

  const handleFetchArticle = useCallback(
    async (url: string) => {
      setIsLoading(true);
      try {
        const article = await fetchArticle(url);

        if (!article) {
          toast.error("Failed to fetch article");
          return;
        }

        const existingNode = nodes.find((n) => n.data.title === article.title);

        if (existingNode) {
          toast.error("Article already exists in graph");
          return;
        }

        const newNodeId = `node-${Date.now()}`;
        const newNode = {
          id: newNodeId,
          type: "wiki",
          position: { x: 0, y: 0 },
          data: article,
        };

        const newNodes = [...nodes, newNode];

        if (nodes.length > 0) {
          const { nodes: laidOutNodes, edges: laidOutEdges } = applyLayout(
            newNodes,
            edges,
            {
              mode: layoutMode,
              direction: "TB",
              nodeWidth: 280,
              nodeHeight: 300,
              spacing: 100,
            },
          );

          setNodes(laidOutNodes);
          setEdges(laidOutEdges);
        } else {
          setNodes([newNode]);
        }

        addRecentUrl(url);
        toast.success(`Added: ${article.title}`);
      } catch (error) {
        toast.error("Failed to fetch article");
        console.error("Error fetching article:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [nodes, edges, layoutMode, addRecentUrl, setNodes, setEdges],
  );

  const handleSpawnChildNode = useCallback(
    async (parentId: string, title: string) => {
      const parentNode = nodes.find((n) => n.id === parentId);
      if (!parentNode) {
        return;
      }

      setIsLoading(true);
      try {
        const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
        const article = await fetchArticle(url);

        if (!article) {
          toast.error("Failed to fetch article");
          return;
        }

        const existingNode = nodes.find((n) => n.data.title === article.title);

        if (existingNode) {
          const edgeExists = edges.find(
            (e) => e.source === parentId && e.target === existingNode.id,
          );

          if (!edgeExists) {
            setEdges([
              ...edges,
              {
                id: `edge-${parentId}-${existingNode.id}`,
                source: parentId,
                target: existingNode.id,
                type: "smoothstep",
              },
            ]);
          }
          return;
        }

        const newNodeId = `node-${Date.now()}`;
        const newNode = {
          id: newNodeId,
          type: "wiki",
          position: {
            x: parentNode.position.x + 300 + Math.random() * 100,
            y: parentNode.position.y + Math.random() * 200,
          },
          data: article,
        };

        addNode(newNode);

        const newEdge = {
          id: `edge-${parentId}-${newNodeId}`,
          source: parentId,
          target: newNodeId,
          type: "smoothstep",
        };

        setEdges([...edges, newEdge]);

        toast.success(`Added: ${article.title}`);
      } catch (error) {
        toast.error("Failed to fetch article");
        console.error("Error spawning child node:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [nodes, edges, addNode, setEdges],
  );

  const handleNodeClick = useCallback(
    (node: WikiNode) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const handleLayoutChange = useCallback(
    (mode: LayoutMode) => {
      setLayoutMode(mode);

      if (nodes.length > 0) {
        const { nodes: laidOutNodes, edges: laidOutEdges } = applyLayout(
          nodes,
          edges,
          {
            mode,
            direction: "TB",
            nodeWidth: 280,
            nodeHeight: 300,
            spacing: 100,
          },
        );

        setNodes(laidOutNodes);
        setEdges(laidOutEdges);
      }
    },
    [nodes, edges, setLayoutMode, setNodes, setEdges],
  );

  const handleClearGraph = useCallback(() => {
    clearGraph();
    toast.success("Graph cleared");
  }, [clearGraph]);

  const handleExport = useCallback(() => {
    return exportGraph();
  }, [exportGraph]);

  const handleImport = useCallback(
    (json: string) => {
      importGraph(json);
      toast.success("Graph imported");
    },
    [importGraph],
  );

  const selectedNodeData: WikiNodeData | null = selectedNode
    ? (nodes.find((n) => n.id === selectedNode)?.data ?? null)
    : null;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset">
        <GraphControls
          layoutMode={layoutMode}
          onLayoutChange={handleLayoutChange}
          onClearGraph={handleClearGraph}
          onExport={handleExport}
          onImport={handleImport}
          nodeCount={nodes.length}
          edgeCount={edges.length}
        />
      </AppSidebar>
      <SidebarInset>
        <SiteHeader title="Wiki Graph" />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <UrlInputPanel onFetch={handleFetchArticle} recentUrls={recentUrls} />
          <div className="flex-1 min-h-[600px] rounded-xl border overflow-hidden">
            <GraphCanvas
              initialNodes={nodes}
              initialEdges={edges}
              layoutMode={layoutMode}
              onNodeClick={handleNodeClick}
            />
          </div>
        </main>
      </SidebarInset>
      <ArticleSheet
        isOpen={isArticleSheetOpen}
        onOpenChange={setArticleSheetOpen}
        nodeData={selectedNodeData}
      />
    </SidebarProvider>
  );
}
