"use client";

import {
  Download,
  Filter,
  Layout,
  Settings2,
  Trash2,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { fileToJson, importGraphFromJson } from "@/lib/storage";
import type { LayoutMode } from "@/lib/store";

interface GraphControlsProps {
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
  onClearGraph: () => void;
  onExport: () => string;
  onImport: (json: string) => void;
  nodeCount: number;
  edgeCount: number;
}

export function GraphControls({
  layoutMode,
  onLayoutChange,
  onClearGraph,
  onExport,
  onImport,
  nodeCount,
  edgeCount,
}: GraphControlsProps) {
  const handleExport = () => {
    const json = onExport();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wiki-graph-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const json = await fileToJson(file);
          const data = importGraphFromJson(json);
          if (data) {
            onImport(json);
          }
        } catch (error) {
          console.error("Error importing file:", error);
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Graph Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="text-xs font-medium">Layout</div>
            <Select value={layoutMode} onValueChange={onLayoutChange}>
              <SelectTrigger>
                <Layout className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="force">Force-directed</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="text-xs font-medium">Data</div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onClearGraph}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Graph
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Nodes</span>
            <Badge variant="secondary">{nodeCount}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Connections</span>
            <Badge variant="secondary">{edgeCount}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
