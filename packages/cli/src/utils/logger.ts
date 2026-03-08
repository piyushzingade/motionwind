const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";

export const logger = {
  info(msg: string) {
    console.log(`${BLUE}info${RESET}  ${msg}`);
  },
  success(msg: string) {
    console.log(`${GREEN}${BOLD}✓${RESET} ${msg}`);
  },
  warn(msg: string) {
    console.log(`${YELLOW}warn${RESET}  ${msg}`);
  },
  error(msg: string) {
    console.error(`${RED}error${RESET} ${msg}`);
  },
  step(msg: string) {
    console.log(`${CYAN}→${RESET} ${msg}`);
  },
  dim(msg: string) {
    console.log(`${DIM}${msg}${RESET}`);
  },
  blank() {
    console.log();
  },
  title(msg: string) {
    console.log(`\n${BOLD}${msg}${RESET}\n`);
  },
};
