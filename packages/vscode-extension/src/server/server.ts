import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
  DidChangeConfigurationNotification,
  CompletionParams,
  HoverParams,
  DocumentColorParams,
  ColorPresentationParams,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { handleCompletion } from "./completionProvider.js";
import { handleHover } from "./hoverProvider.js";
import { computeDiagnostics } from "./diagnosticProvider.js";
import { handleDocumentColors, handleColorPresentation } from "./colorProvider.js";

// Create connection using IPC
const connection = createConnection(ProposedFeatures.all);

// Document manager
const documents = new TextDocuments(TextDocument);

// Settings
interface MotionwindSettings {
  enable: boolean;
  validate: boolean;
  classAttributes: string[];
}

const defaultSettings: MotionwindSettings = {
  enable: true,
  validate: true,
  classAttributes: ["className", "class"],
};

let globalSettings: MotionwindSettings = defaultSettings;

connection.onInitialize((_params: InitializeParams): InitializeResult => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        triggerCharacters: [" ", ":", "-", '"', "'", "`"],
        resolveProvider: false,
      },
      hoverProvider: true,
      colorProvider: true,
    },
  };
});

connection.onInitialized(() => {
  connection.client.register(DidChangeConfigurationNotification.type, undefined);
});

connection.onDidChangeConfiguration((change) => {
  const settings = (change.settings?.motionwind ?? {}) as Partial<MotionwindSettings>;
  globalSettings = { ...defaultSettings, ...settings };

  // Revalidate all open documents
  documents.all().forEach(validateDocument);
});

// Completion
connection.onCompletion((params: CompletionParams) => {
  if (!globalSettings.enable) return null;
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;
  return handleCompletion(params, document, globalSettings.classAttributes);
});

// Hover
connection.onHover((params: HoverParams) => {
  if (!globalSettings.enable) return null;
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;
  return handleHover(params, document, globalSettings.classAttributes);
});

// Document colors
connection.onDocumentColor((params: DocumentColorParams) => {
  if (!globalSettings.enable) return [];
  const document = documents.get(params.textDocument.uri);
  if (!document) return [];
  return handleDocumentColors(params, document, globalSettings.classAttributes);
});

// Color presentations
connection.onColorPresentation((params: ColorPresentationParams) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return [];
  return handleColorPresentation(params, document);
});

// Diagnostics
function validateDocument(document: TextDocument): void {
  if (!globalSettings.enable || !globalSettings.validate) {
    connection.sendDiagnostics({ uri: document.uri, diagnostics: [] });
    return;
  }

  const diagnostics = computeDiagnostics(document, globalSettings.classAttributes);
  connection.sendDiagnostics({ uri: document.uri, diagnostics });
}

documents.onDidChangeContent((change) => {
  validateDocument(change.document);
});

documents.onDidClose((event) => {
  connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
});

// Wire up documents to the connection
documents.listen(connection);

// Start listening
connection.listen();
