import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  explainClasses,
  generateExample,
  optimizeClasses,
  syntaxManifest,
  validateClasses,
} from "./tools.js";

export {
  explainClasses,
  generateExample,
  optimizeClasses,
  syntaxManifest,
  validateClasses,
} from "./tools.js";

const server = new McpServer({ name: "motionwind", version: "2.0.0" });
const text = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
});

server.tool(
  "validate_motionwind",
  "Validate Motionwind classes and return diagnostics and parsed Motion output.",
  { className: z.string() },
  async ({ className }) => text(validateClasses(className)),
);

server.tool(
  "explain_motionwind",
  "Explain each Motionwind token without changing source code.",
  { className: z.string() },
  async ({ className }) => text(explainClasses(className)),
);

server.tool(
  "optimize_motionwind",
  "Canonically sort Motionwind classes and report duplicates or unknown tokens.",
  { className: z.string() },
  async ({ className }) => text(optimizeClasses(className)),
);

server.tool(
  "generate_motionwind",
  "Generate framework code from Motionwind classes.",
  {
    className: z.string(),
    tag: z.string().optional(),
    text: z.string().optional(),
    target: z.enum(["react", "vue", "javascript", "react-native"]).optional(),
  },
  async (input) => text({ code: generateExample(input) }),
);

server.resource(
  "motionwind-syntax",
  new ResourceTemplate("motionwind://syntax", { list: undefined }),
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(syntaxManifest()),
      },
    ],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
