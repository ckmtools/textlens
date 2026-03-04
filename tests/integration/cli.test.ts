import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(__dirname, '../..');
const CLI = path.join(ROOT, 'bin/textlens.js');
const TEST_FILE = path.join(ROOT, 'tests/fixtures/sample.txt');

beforeAll(() => {
  // Ensure build is current
  execSync('npm run build', { cwd: ROOT, stdio: 'ignore' });
  // Create test fixture
  const fixturesDir = path.join(ROOT, 'tests/fixtures');
  if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir, { recursive: true });
  fs.writeFileSync(TEST_FILE, 'The cat sat on the mat. It was a good day for everyone. The sun was shining brightly overhead.');
});

describe('CLI', () => {
  it('should analyze a file', () => {
    const output = execSync(`node ${CLI} ${TEST_FILE}`, { cwd: ROOT, encoding: 'utf-8' });
    expect(output).toContain('Flesch');
    expect(output).toContain('Grade');
  });

  it('should output JSON with --json flag', () => {
    const output = execSync(`node ${CLI} ${TEST_FILE} --json`, { cwd: ROOT, encoding: 'utf-8' });
    const parsed = JSON.parse(output);
    expect(parsed).toHaveProperty('statistics');
    expect(parsed).toHaveProperty('readability');
  });

  it('should read from stdin', () => {
    const output = execSync(`echo "Hello world. This is a test." | node ${CLI}`, { cwd: ROOT, encoding: 'utf-8', shell: '/bin/sh' });
    expect(output.length).toBeGreaterThan(0);
  });

  it('should show help', () => {
    const output = execSync(`node ${CLI} --help`, { cwd: ROOT, encoding: 'utf-8' });
    expect(output).toContain('textlens');
    expect(output).toContain('Usage');
  });

  it('should show version', () => {
    const output = execSync(`node ${CLI} --version`, { cwd: ROOT, encoding: 'utf-8' });
    expect(output.trim()).toMatch(/^textlens v\d+\.\d+\.\d+$/);
  });

  it('should error on missing file', () => {
    try {
      execSync(`node ${CLI} /nonexistent/file.txt`, { cwd: ROOT, encoding: 'utf-8', stdio: 'pipe' });
      expect.fail('Should have thrown');
    } catch (e: any) {
      expect(e.status).not.toBe(0);
    }
  });
});
