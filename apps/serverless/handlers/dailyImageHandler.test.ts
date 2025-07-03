import { Hono } from "hono";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

// Test that the handler returns 403 when the extension id header does not match
Deno.test("returns 403 for invalid extension id", async () => {
  // Ensure API key is present so the check does not fail earlier
  Deno.env.set("UNSPLASH_API_KEY", "dummy");

  const { dailyImageHandler } = await import("./dailyImageHandler.ts?test=invalid_id");

  const app = new Hono();
  app.get("/api/daily-image", dailyImageHandler);

  const res = await app.request("/api/daily-image", {
    headers: {
      "x-extension-id": "wrong-id",
    },
  });

  assertEquals(res.status, 403);
});

// Test that the handler returns 400 when the Unsplash API key is missing
Deno.test("returns 400 when API key is missing", async () => {
  Deno.env.delete("UNSPLASH_API_KEY");

  const { EXTENSION_ID } = await import("../constants.ts");
  const { dailyImageHandler } = await import("./dailyImageHandler.ts?test=missing_key");

  const app = new Hono();
  app.get("/api/daily-image", dailyImageHandler);

  const res = await app.request("/api/daily-image", {
    headers: {
      "x-extension-id": EXTENSION_ID,
    },
  });

  assertEquals(res.status, 400);
});

