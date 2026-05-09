import type { NextRequest } from "next/server";

const BACKEND_ORIGIN =
  process.env.BACKEND_API_URL ?? "http://46.225.27.182:8000";

async function forwardRequest(
  request: NextRequest,
  path: string[],
) {
  const targetUrl = new URL(
    `/${path.join("/")}${request.nextUrl.search}`,
    BACKEND_ORIGIN,
  );

  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await request.text() : undefined;

  const upstreamResponse = await fetch(targetUrl.toString(), {
    method,
    headers: {
      "Content-Type": request.headers.get("content-type") ?? "application/json",
      Authorization: request.headers.get("authorization") ?? "",
    },
    body,
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: {
      "Content-Type":
        upstreamResponse.headers.get("content-type") ?? "application/json",
    },
  });
}

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}
