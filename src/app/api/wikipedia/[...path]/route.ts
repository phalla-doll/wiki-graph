import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path = [] } = await params;
  return handleRequest(request, path, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path = [] } = await params;
  return handleRequest(request, path, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path = [] } = await params;
  return handleRequest(request, path, "PUT");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path = [] } = await params;
  return handleRequest(request, path, "DELETE");
}

async function handleRequest(
  request: NextRequest,
  path: string[],
  method: string,
) {
  const pathString = path.join("/");
  const url = new URL(request.url);
  const queryParams = url.search;
  const wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/${pathString}${queryParams}`;

  try {
    const response = await fetch(wikipediaUrl, {
      method,
      headers: {
        "User-Agent": "Wiki-Graph/1.0 (https://github.com/wiki-graph/app)",
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    const data = await response.text();

    const headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type":
        response.headers.get("Content-Type") || "application/json",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    });

    return new NextResponse(data, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("Wikipedia API proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Wikipedia", details: String(error) },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
