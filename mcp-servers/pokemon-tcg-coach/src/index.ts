import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { CARD_SEARCH_TOOL, handleCardSearch } from "./tools/card-search.js";
import {
  COLLECTION_IMPORT_TOOL,
  handleCollectionImport,
  COLLECTION_VIEW_TOOL,
  handleCollectionView,
  COLLECTION_REMOVE_TOOL,
  handleCollectionRemove,
} from "./tools/collection.js";
import {
  DECK_SAVE_TOOL,
  handleDeckSave,
  DECK_LIST_TOOL,
  handleDeckList,
  DECK_GET_TOOL,
  handleDeckGet,
  DECK_DELETE_TOOL,
  handleDeckDelete,
  DECK_DIFF_TOOL,
  handleDeckDiff,
} from "./tools/deck.js";

// All 9 tool definitions with their JSON Schema input schemas
const ALL_TOOLS = [
  CARD_SEARCH_TOOL,
  COLLECTION_IMPORT_TOOL,
  COLLECTION_VIEW_TOOL,
  COLLECTION_REMOVE_TOOL,
  DECK_SAVE_TOOL,
  DECK_LIST_TOOL,
  DECK_GET_TOOL,
  DECK_DELETE_TOOL,
  DECK_DIFF_TOOL,
];

async function main() {
  const server = new Server(
    { name: "pokemon-tcg-coach", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  // List all registered tools
  server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: ALL_TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  }));

  // Dispatch tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    switch (name) {
      case CARD_SEARCH_TOOL.name: {
        const result = await handleCardSearch(
          args as Parameters<typeof handleCardSearch>[0]
        );
        return { content: result.content };
      }

      case COLLECTION_IMPORT_TOOL.name: {
        const text = await handleCollectionImport(args as { text: string });
        return { content: [{ type: "text" as const, text }] };
      }

      case COLLECTION_VIEW_TOOL.name: {
        const text = await handleCollectionView(
          args as Parameters<typeof handleCollectionView>[0]
        );
        return { content: [{ type: "text" as const, text }] };
      }

      case COLLECTION_REMOVE_TOOL.name: {
        const text = await handleCollectionRemove(args as { text: string });
        return { content: [{ type: "text" as const, text }] };
      }

      case DECK_SAVE_TOOL.name: {
        const text = await handleDeckSave(
          args as { name: string; decklist: string }
        );
        return { content: [{ type: "text" as const, text }] };
      }

      case DECK_LIST_TOOL.name: {
        const text = await handleDeckList(args as Record<string, never>);
        return { content: [{ type: "text" as const, text }] };
      }

      case DECK_GET_TOOL.name: {
        const text = await handleDeckGet(args as { name: string });
        return { content: [{ type: "text" as const, text }] };
      }

      case DECK_DELETE_TOOL.name: {
        const text = await handleDeckDelete(args as { name: string });
        return { content: [{ type: "text" as const, text }] };
      }

      case DECK_DIFF_TOOL.name: {
        const text = await handleDeckDiff(
          args as Parameters<typeof handleDeckDiff>[0]
        );
        return { content: [{ type: "text" as const, text }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
