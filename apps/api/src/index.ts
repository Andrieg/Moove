// CRITICAL: Load .env FIRST, before any AWS SDK imports
// This must be at the very top to ensure process.env is populated
// before any module that reads AWS_REGION is initialized
import "dotenv/config";

import logger from "./utils/logger";
import helmet from "fastify-helmet";
import cors from "fastify-cors";
import jwt from "fastify-jwt";
import createServer from "./server";
import routes from "./routes";
import authenticate from "./utils/authentication";

console.log("[BOOT] index.ts loaded");

const server = createServer();

server.addHook("onError", (_, __, error, done) => {
  if (process.env.NODE_ENV === "production") {
    logger.error(error);
  }
  done();
});

server.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  (req, body, done) => {
    try {
      const newBody = {
        raw: body,
        parsed: JSON.parse(body as string),
      };
      done(null, newBody);
    } catch (error: any) {
      logger.error("[parser]", error);
      error.statusCode = 400;
      done(error, undefined);
    }
  }
);

const start = async () => {
  try {
    console.log("[BOOT] register helmet");
    server.register(helmet as any);
    console.log("[BOOT] registered helmet");

    console.log("[BOOT] register cors");
    server.register(cors as any, {
      origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost", /\.moove\.fit$/],
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTION"],
      credentials: true,
    });
    console.log("[BOOT] registered cors");

    console.log("[BOOT] register jwt");
    server.register(jwt as any, { secret: process.env.SECRET || "SECRET" });
    console.log("[BOOT] registered jwt");

    console.log("[BOOT] register authenticate");
    server.register(authenticate as any);
    console.log("[BOOT] registered authenticate");

    console.log("[BOOT] register routes");
    server.register(routes as any);
    console.log("[BOOT] registered routes");

    console.log("[BOOT] awaiting server.ready()");
    await server.ready();
    console.log("[BOOT] server.ready() complete");

    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    console.log("[BOOT] starting server on PORT", PORT);

    await server.listen({ port: PORT, host: "0.0.0.0" });

    console.log(`✅ API ready at http://localhost:${PORT}`);
  } catch (err) {
    console.error(err);
    logger.error(err as any);
    process.exit(1);
  }
};

start();
