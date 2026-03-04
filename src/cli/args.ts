export interface ParsedArgs {
  file?: string;
  json: boolean;
  format: 'pretty' | 'json' | 'minimal';
  formula?: string;
  showKeywords: boolean;
  keywordsN: number;
  showDensity: boolean;
  showSentiment: boolean;
  showSeo: boolean;
  seoKeyword?: string;
  showSummary: boolean;
  summaryN: number;
  showAll: boolean;
  help: boolean;
  version: boolean;
}

function isFlag(arg: string): boolean {
  return arg.startsWith('-');
}

function isNumeric(arg: string): boolean {
  return /^\d+$/.test(arg);
}

export function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {
    json: false,
    format: 'pretty',
    showKeywords: false,
    keywordsN: 10,
    showDensity: false,
    showSentiment: false,
    showSeo: false,
    showSummary: false,
    summaryN: 3,
    showAll: false,
    help: false,
    version: false,
  };

  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--version' || arg === '-v') {
      args.version = true;
    } else if (arg === '--json') {
      args.json = true;
      args.format = 'json';
    } else if (arg === '--format') {
      i++;
      const val = argv[i];
      if (val === 'json' || val === 'pretty' || val === 'minimal') {
        args.format = val;
        if (val === 'json') args.json = true;
      }
    } else if (arg === '--formula') {
      i++;
      if (i < argv.length) {
        args.formula = argv[i];
      }
    } else if (arg === '--keywords') {
      args.showKeywords = true;
      if (i + 1 < argv.length && isNumeric(argv[i + 1])) {
        i++;
        args.keywordsN = parseInt(argv[i], 10);
      }
    } else if (arg === '--density') {
      args.showDensity = true;
    } else if (arg === '--sentiment') {
      args.showSentiment = true;
    } else if (arg === '--seo') {
      args.showSeo = true;
      if (i + 1 < argv.length && !isFlag(argv[i + 1])) {
        i++;
        args.seoKeyword = argv[i];
      }
    } else if (arg === '--summary') {
      args.showSummary = true;
      if (i + 1 < argv.length && isNumeric(argv[i + 1])) {
        i++;
        args.summaryN = parseInt(argv[i], 10);
      }
    } else if (arg === '--all') {
      args.showAll = true;
    } else if (!isFlag(arg) && !args.file) {
      args.file = arg;
    }
    // Unknown flags: ignore silently

    i++;
  }

  return args;
}
