const UNSPLASH_URL = "https://api.unsplash.com/photos/random"
const UNSPLASH_API_KEY = Deno.env.get('UNSPLASH_API_KEY')
const EXTENSION_ID = "kaeibbjbbioodhkpgclmhdhnoggcikhi";
const ALLOWED_ORIGIN = `chrome-extension://${EXTENSION_ID}`;

Deno.serve(async (req: Request) => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET");
  headers.set("Access-Control-Allow-Headers", "*");
  headers.set("Access-Control-Max-Age", "3600");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  const origin = req.headers.get("origin") ?? "";
  const extensionId = req.headers.get("x-extension-id") ?? "";

  console.log("Request Origin:", origin);
  console.log("Extension ID:", extensionId);

  if (origin !== ALLOWED_ORIGIN || extensionId !== EXTENSION_ID) {
    return new Response(
      JSON.stringify({
        message: "Forbidden: Unauthorized origin",
        origin,
        extension_id: extensionId,
      }),
      { status: 403, headers }
    );
  }

  const url = new URL(req.url);
  const orientation = url.searchParams.get("orientation") ?? "landscape";
  const query = url.searchParams.get("query") ?? "landscape";

  if (!UNSPLASH_API_KEY) {
    return new Response(
      JSON.stringify({
        message: "Bad Request: API key not set, check your environment variables",
      }),
      { status: 400, headers }
    );
  }

  const params = new URLSearchParams({
    client_id: UNSPLASH_API_KEY,
    orientation,
    query,
  });

  try {
    const unsplashRes = await fetch(`${UNSPLASH_URL}?${params}`);
    const body = await unsplashRes.text();

    if (!unsplashRes.ok) {
      return new Response(
        JSON.stringify({
          message: "Bad Request to Unsplash API",
          error: body,
        }),
        { status: 502, headers },
      );
    }

    return new Response(body, {
      status: unsplashRes.status,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Bad Gateway", error: String(err) }),
      { status: 502, headers }
    );
  }
});
