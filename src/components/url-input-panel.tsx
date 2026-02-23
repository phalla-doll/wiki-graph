"use client";

import { Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { isValidWikipediaUrl } from "@/lib/wikipedia";

interface UrlInputPanelProps {
  onFetch: (url: string) => void;
  recentUrls: string[];
}

export function UrlInputPanel({ onFetch, recentUrls }: UrlInputPanelProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleFetch = (urlToFetch: string) => {
    if (!urlToFetch.trim()) {
      setError("Please enter a Wikipedia URL");
      return;
    }

    if (!isValidWikipediaUrl(urlToFetch)) {
      setError("Please enter a valid Wikipedia URL");
      return;
    }

    setError("");
    setUrl("");
    onFetch(urlToFetch);
  };

  return (
    <Card className="border-0 shadow-none bg-muted/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="Paste Wikipedia URL..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFetch(url);
                }
              }}
              className="bg-background"
            />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>
          {recentUrls.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Clock className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                {recentUrls.map((recentUrl) => (
                  <DropdownMenuItem
                    key={recentUrl}
                    onClick={() => handleFetch(recentUrl)}
                    className="line-clamp-1"
                  >
                    {recentUrl}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button onClick={() => handleFetch(url)}>Explore</Button>
        </div>
      </CardContent>
    </Card>
  );
}
