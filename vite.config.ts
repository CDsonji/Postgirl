import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    {
      name: "local-proxy",
      configureServer(server) {
        server.middlewares.use("/proxy", async (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
          }

          try {
            let body = "";

            req.on("data", (chunk) => {
              body += chunk;
            });

            req.on("end", async () => {
              try {
                const parsed = JSON.parse(body);
                const { url, method, headers, body: requestBody } = parsed;

                if (!url) {
                  res.statusCode = 400;
                  res.setHeader("Content-Type", "application/json");
                  res.end(
                    JSON.stringify({ error: "Missing 'url' in request body" })
                  );
                  return;
                }

                const proxyResponse = await fetch(url, {
                  method: method || "GET",
                  headers: headers || {},
                  body: requestBody || undefined,
                });

                const text = await proxyResponse.text();
                const responseHeaders = Object.fromEntries(
                  proxyResponse.headers.entries()
                );

                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    status: proxyResponse.status,
                    statusText: proxyResponse.statusText,
                    headers: responseHeaders,
                    body: text,
                  })
                );
              } catch (error) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error:
                      error instanceof Error
                        ? error.message
                        : "Unknown server error",
                  })
                );
              }
            });
          } catch (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error:
                  error instanceof Error
                    ? error.message
                    : "Unknown server error",
              })
            );
          }
        });
      },
    },
  ],
});
