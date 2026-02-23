"use client";

import { Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { WikiNodeData } from "@/lib/store";

interface ArticleSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  nodeData: WikiNodeData | null;
}

export function ArticleSheet({
  isOpen,
  onOpenChange,
  nodeData,
}: ArticleSheetProps) {
  if (!nodeData) return null;

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
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[700px]">
        <SheetHeader>
          <SheetTitle className="flex items-start justify-between gap-4 pr-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${categoryColors[nodeData.category] || categoryColors.General}`}
                >
                  {nodeData.category}
                </Badge>
                {nodeData.lastEdited && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(nodeData.lastEdited).toLocaleDateString()}
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold">{nodeData.title}</h2>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a
                href={nodeData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Wikipedia
              </a>
            </Button>
          </SheetTitle>
        </SheetHeader>

        <Separator className="my-4" />

        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="text-base leading-relaxed">{nodeData.summary}</div>

            {nodeData.links.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Related Articles ({nodeData.links.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {nodeData.links.map((link) => (
                    <Badge
                      key={link}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("wiki-expand-from-sheet", {
                            detail: { title: link },
                          }),
                        );
                      }}
                    >
                      {link}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
