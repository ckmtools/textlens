import * as fs from 'node:fs';
import * as process from 'node:process';
import { parseArgs } from './args.js';
import { formatPretty, formatJson, formatMinimal } from './format.js';
import { analyze, density, seoScore } from '../index.js';

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  if (args.version) {
    console.log('textlens v1.0.0');
    return;
  }

  // Get input text
  let text: string;
  if (args.file) {
    if (!fs.existsSync(args.file)) {
      console.error(`Error: File not found: ${args.file}`);
      process.exit(1);
    }
    text = fs.readFileSync(args.file, 'utf-8');
  } else if (!process.stdin.isTTY) {
    text = await readStdin();
  } else {
    printHelp();
    return;
  }

  if (!text.trim()) {
    console.error('Error: Empty input');
    process.exit(1);
  }

  // Run analysis
  const result = analyze(text);
  const output: any = { ...result };

  if (args.showAll || args.showSeo) {
    output.seo = seoScore(text, args.seoKeyword ? { targetKeyword: args.seoKeyword } : undefined);
  }
  if (args.showAll || args.showDensity) {
    output.density = density(text);
  }

  // Format and print
  if (args.format === 'json') {
    console.log(formatJson(output));
  } else if (args.format === 'minimal') {
    console.log(formatMinimal(result));
  } else {
    console.log(formatPretty(output, args));
  }
}

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk: string) => { data += chunk; });
    process.stdin.on('end', () => { resolve(data); });
  });
}

function printHelp(): void {
  console.log(`
textlens - Text analysis and readability toolkit

Usage:
  textlens <file>              Analyze a text file
  cat file.txt | textlens      Analyze from stdin

Options:
  --json              Output as JSON
  --format <type>     Output format: pretty (default), json, minimal
  --formula <name>    Show single readability formula
  --keywords [N]      Show top N keywords (default: 10)
  --density           Show keyword density analysis
  --sentiment         Show sentiment analysis
  --seo [keyword]     Show SEO score (optionally targeting a keyword)
  --summary [N]       Show N-sentence summary (default: 3)
  --all               Show everything
  -h, --help          Show this help
  -v, --version       Show version
`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
