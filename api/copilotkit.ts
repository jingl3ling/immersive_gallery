import { AnthropicAdapter, CopilotRuntime, copilotRuntimeNodeHttpEndpoint } from "@copilotkit/runtime";

/**
 * Vercel Serverless Function for CopilotKit runtime.
 *
 * This replaces the local Express server + Vite proxy used in development.
 * Deployed at: /api/copilotkit
 */

// IMPORTANT: reuse singletons across invocations when possible
const runtime = new CopilotRuntime();
const serviceAdapter = new AnthropicAdapter({
  model: "claude-sonnet-4-20250514",
});

const handler = copilotRuntimeNodeHttpEndpoint({
  endpoint: "/api/copilotkit",
  runtime,
  serviceAdapter,
});

export const config = {
  api: {
    // CopilotKit runtime expects the raw request body/stream.
    bodyParser: false,
  },
};

export default async function copilotkitVercelHandler(req: any, res: any) {
  // Same-origin calls from the browser are expected, but set CORS defensively.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  return handler(req, res);
}

