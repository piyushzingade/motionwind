# motionwind-mcp v2

MCP tools generated from Motionwind's shared syntax registry.

```json
{
  "mcpServers": {
    "motionwind": {
      "command": "npx",
      "args": ["-y", "motionwind-mcp@2"]
    }
  }
}
```

Tools:

- `validate_motionwind` returns unknown tokens, duplicates, diagnostics, and
  parsed output.
- `explain_motionwind` explains each token.
- `optimize_motionwind` sorts classes and reports problems.
- `generate_motionwind` produces React, Vue, JavaScript, or React Native code.

The `motionwind://syntax` resource exposes the machine-readable definition
registry used by the parser and developer tools.

MIT
