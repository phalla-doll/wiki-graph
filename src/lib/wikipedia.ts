const WIKIPEDIA_API_BASE = "/api/wikipedia";

export interface WikipediaArticle {
  title: string;
  summary: string;
  url: string;
  category: string;
  links: string[];
  popularity: number;
  lastEdited: string;
}

interface WikipediaPageSummary {
  title: string;
  extract: string;
  description?: string;
  content_urls: {
    desktop: {
      page: string;
    };
  };
  thumbnail?: {
    source: string;
  };
}

interface WikipediaPageHTML {
  title: string;
  revision: number;
  last_modified: string;
  html: string;
}

export async function fetchArticleSummary(
  title: string,
): Promise<WikipediaPageSummary | null> {
  try {
    const response = await fetch(
      `${WIKIPEDIA_API_BASE}/page/summary/${encodeURIComponent(title)}`,
    );

    if (!response.ok) {
      console.error("Wikipedia summary endpoint returned error:", {
        status: response.status,
        statusText: response.statusText,
        url: `${WIKIPEDIA_API_BASE}/page/summary/${encodeURIComponent(title)}`,
      });
      return null;
    }

    const data = await response.json();
    console.log("Successfully fetched summary for:", title);
    return data;
  } catch (error) {
    console.error("Error fetching article summary:", error);
    return null;
  }
}

export async function fetchArticleHTML(
  title: string,
): Promise<WikipediaPageHTML | null> {
  try {
    const response = await fetch(
      `${WIKIPEDIA_API_BASE}/page/html/${encodeURIComponent(title)}`,
    );

    if (!response.ok) {
      console.error("Wikipedia HTML endpoint returned error:", {
        status: response.status,
        statusText: response.statusText,
        url: `${WIKIPEDIA_API_BASE}/page/html/${encodeURIComponent(title)}`,
      });
      return null;
    }

    // Get HTML as text, not JSON (HTML endpoint returns text/html)
    const htmlContent = await response.text();
    console.log(
      "Successfully fetched HTML for:",
      title,
      "Length:",
      htmlContent.length,
    );

    // Wrap in expected structure
    return {
      title,
      revision: 0,
      last_modified: new Date().toISOString(),
      html: htmlContent,
    };
  } catch (error) {
    console.error("Error fetching article HTML:", error);
    return null;
  }
}

function extractInternalLinks(html: string, maxLinks = 20): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const links: string[] = [];
  const linkElements = doc.querySelectorAll('a[href^="/wiki/"]');

  for (const link of linkElements) {
    if (links.length >= maxLinks) break;

    const href = (link as HTMLAnchorElement).getAttribute("href");
    if (href) {
      const match = href.match(/^\/wiki\/([^:#]+)$/);
      if (match) {
        const title = decodeURIComponent(match[1]);
        if (!links.includes(title)) {
          links.push(title);
        }
      }
    }
  }

  return links;
}

function extractCategory(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const categoryElement = doc.querySelector(
    ".mw-category-group a, .category a",
  );
  if (categoryElement) {
    return (categoryElement as HTMLAnchorElement).textContent || "General";
  }

  const titleElement = doc.querySelector("h1");
  const title = titleElement?.textContent || "";

  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("war") || lowerTitle.includes("battle")) {
    return "History";
  }
  if (lowerTitle.includes("science") || lowerTitle.includes("physics")) {
    return "Science";
  }
  if (lowerTitle.includes("person") || lowerTitle.includes("born")) {
    return "People";
  }
  if (lowerTitle.includes("city") || lowerTitle.includes("country")) {
    return "Geography";
  }

  return "General";
}

function parseWikipediaUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (urlObj.hostname === "en.wikipedia.org") {
      const pathParts = urlObj.pathname.split("/");
      if (pathParts[1] === "wiki" && pathParts[2]) {
        return decodeURIComponent(pathParts[2]);
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function fetchArticle(
  urlOrTitle: string,
): Promise<WikipediaArticle | null> {
  const title = urlOrTitle.startsWith("http")
    ? parseWikipediaUrl(urlOrTitle)
    : urlOrTitle;

  if (!title) {
    return null;
  }

  try {
    const [summary, html] = await Promise.all([
      fetchArticleSummary(title),
      fetchArticleHTML(title),
    ]);

    if (!summary) {
      console.error("Failed to get article summary for:", title);
      return null;
    }

    const links = html ? extractInternalLinks(html.html) : [];
    const category = html ? extractCategory(html.html) : "General";

    console.log("Article processing complete:", {
      title: summary.title,
      linksCount: links.length,
      category,
    });

    return {
      title: summary.title,
      summary: summary.extract || "",
      url: summary.content_urls.desktop.page,
      category,
      links,
      popularity: 0,
      lastEdited: html?.last_modified || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export function isValidWikipediaUrl(url: string): boolean {
  return /^https?:\/\/(?:[a-z]{2,3}\.)?wikipedia\.org\/wiki\//.test(url);
}
