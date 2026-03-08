import { init } from "./commands/init.js";
import { logger } from "./utils/logger.js";

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "init":
    init(process.cwd());
    break;
  case "--help":
  case "-h":
  case undefined:
    logger.title("create-motionwind");
    logger.info("Usage: npx create-motionwind init");
    logger.blank();
    logger.info("Commands:");
    logger.dim("  init    Detect project type, install deps, add config");
    logger.blank();
    break;
  default:
    logger.error(`Unknown command: ${command}`);
    logger.info("Run: npx create-motionwind --help");
    process.exit(1);
}
