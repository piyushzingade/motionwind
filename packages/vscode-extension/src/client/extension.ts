import * as path from "path";
import { ExtensionContext } from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node.js";

let client: LanguageClient | undefined;

export function activate(context: ExtensionContext): void {
  const serverModule = context.asAbsolutePath(
    path.join("dist", "server", "server.js"),
  );

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { execArgv: ["--nolazy", "--inspect=6009"] },
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: "file", language: "typescriptreact" },
      { scheme: "file", language: "javascriptreact" },
      { scheme: "file", language: "html" },
      { scheme: "file", language: "typescript" },
      { scheme: "file", language: "javascript" },
    ],
    synchronize: {},
  };

  client = new LanguageClient(
    "motionwind",
    "Motionwind",
    serverOptions,
    clientOptions,
  );

  client.start();
}

export function deactivate(): Promise<void> | undefined {
  if (!client) return undefined;
  return client.stop();
}
