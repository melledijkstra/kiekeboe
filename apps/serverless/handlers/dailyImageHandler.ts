import { Context } from "hono";
import { ALLOWED_ORIGIN, EXTENSION_ID, UNSPLASH_URL } from "../constants.ts";

const UNSPLASH_API_KEY = Deno.env.get('UNSPLASH_API_KEY')

export async function dailyImageHandler(c: Context): Promise<Response> {
  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", "application/json");

  const origin = c.req.header("origin") ?? "";
  const extensionId = c.req.header("x-extension-id") ?? "";

  console.log("Request Origin:", origin);
  console.log("Extension ID:", extensionId);
  
  if (origin !== ALLOWED_ORIGIN || extensionId !== EXTENSION_ID) {
    return c.json({
      message: "Forbidden: Unauthorized origin",
      origin,
      extension_id: extensionId,
    }, 403);
  }

  const url = new URL(c.req.url);
  const orientation = url.searchParams.get("orientation") ?? "landscape";
  const query = url.searchParams.get("query") ?? "landscape";

  console.log("Orientation:", orientation);
  console.log("Query:", query);

  if (!UNSPLASH_API_KEY) {
    return c.json({
      message: "Bad Request: API key not set, check your environment variables",
    }, 400);
  }

  const params = new URLSearchParams({
    client_id: UNSPLASH_API_KEY,
    orientation,
    query,
  });

  try {
    return await fetch(`${UNSPLASH_URL}?${params}`);
  } catch (err) {
    return c.json(
      { message: "Bad Gateway", error: String(err) },
      { status: 502, headers: responseHeaders }
    );
  }
}
