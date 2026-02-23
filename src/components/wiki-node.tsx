import { ExternalLink, MoreVertical, Plus, Trash2 } from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import type { WikiNodeData } from "@/lib/store";

export function WikiNode({ data, id }: NodeProps<WikiNodeData>) {
  const handleExpand = (link: string) => {
    window.dispatchEvent(
      new CustomEvent("wiki-expand-node", {
        detail: { parentId: id, title: link },
      }),
    );
  };

  const handleDelete = () => {
    window.dispatchEvent(
      new CustomEvent("wiki-delete-node", {
        detail: { id },
      }),
    );
  };

  const handleSelect = () => {
    window.dispatchEvent(
      new CustomEvent("wiki-select-node", {
        detail: { id },
      }),
    );
  };

  const categoryColors: Record<string, string> = {
    Science: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    History:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    People:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Geography:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    General: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return (
    <>
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <Card
        className="w-64 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleSelect}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-semibold line-clamp-2">
              {data.title}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in Wikipedia
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${categoryColors[data.category] || categoryColors.General}`}
          >
            {data.category}
          </Badge>
        </CardHeader>
        <Separator />
        <CardContent className="pt-3">
          <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
            {data.summary}
          </p>
          {data.links.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                Related:
              </div>
              <div className="flex flex-wrap gap-1">
                {data.links.slice(0, 4).map((link) => (
                  <Button
                    key={link}
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpand(link);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    <span className="line-clamp-1 max-w-[80px]">{link}</span>
                  </Button>
                ))}
                {data.links.length > 4 && (
                  <Badge variant="secondary" className="h-6 text-xs">
                    +{data.links.length - 4}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
    </>
  );
}
