#!/usr/bin/env node
import('../dist/cli/index.js').catch(e => { console.error(e); process.exit(1); });
