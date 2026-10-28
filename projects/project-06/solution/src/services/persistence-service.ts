import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';

const SERVICE = 'persistence';

export class PersistenceService {
  private dataDir: string;
  private documentsDir: string;
  private indexDir: string;
  private log = logger.forService(SERVICE);

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    this.documentsDir = path.join(dataDir, 'documents');
    this.indexDir = path.join(dataDir, 'index');
    this.ensureDirectories();
    this.log.info('PersistenceService initialized', { dataDir });
  }

  private ensureDirectories(): void {
    const dirs = [this.dataDir, this.documentsDir, this.indexDir];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.log.debug('Created directory', { dir });
      }
    }
  }

  /** Read a JSON file, returning null if it doesn't exist. */
  readJson<T>(relativePath: string): T | null {
    const fullPath = path.join(this.dataDir, relativePath);
    if (!fs.existsSync(fullPath)) {
      this.log.debug('File not found (returning null)', { path: relativePath });
      return null;
    }
    try {
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      this.log.debug('Read JSON file', { path: relativePath });
      return data;
    } catch (err) {
      this.log.error('Failed to parse JSON file', { path: relativePath, error: String(err) });
      return null;
    }
  }

  /** Write a JSON file atomically. */
  writeJson<T>(relativePath: string, data: T): void {
    const fullPath = path.join(this.dataDir, relativePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
    this.log.debug('Wrote JSON file', { path: relativePath, sizeBytes: Buffer.byteLength(JSON.stringify(data)) });
  }

  /** Read a text file. */
  readText(relativePath: string): string | null {
    const fullPath = path.join(this.dataDir, relativePath);
    if (!fs.existsSync(fullPath)) {
      this.log.debug('Text file not found', { path: relativePath });
      return null;
    }
    const content = fs.readFileSync(fullPath, 'utf-8');
    this.log.debug('Read text file', { path: relativePath, length: content.length });
    return content;
  }

  /** Write a text file. */
  writeText(relativePath: string, content: string): void {
    const fullPath = path.join(this.dataDir, relativePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
    this.log.debug('Wrote text file', { path: relativePath, length: content.length });
  }

  /** Copy a file into the documents directory. */
  copyFileToDocuments(sourcePath: string, filename: string): string {
    const destPath = path.join(this.documentsDir, filename);
    fs.mkdirSync(this.documentsDir, { recursive: true });
    fs.copyFileSync(sourcePath, destPath);
    this.log.info('Copied file to documents', { source: sourcePath, filename });
    return destPath;
  }

  /** Delete a file from the documents directory. */
  deleteFromDocuments(filename: string): void {
    const filePath = path.join(this.documentsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      this.log.info('Deleted document file', { filename });
    }
  }

  /** List all files in a directory. */
  listFiles(relativePath: string): string[] {
    const fullPath = path.join(this.dataDir, relativePath);
    if (!fs.existsSync(fullPath)) return [];
    return fs.readdirSync(fullPath);
  }

  /** Check if a file exists. */
  exists(relativePath: string): boolean {
    return fs.existsSync(path.join(this.dataDir, relativePath));
  }

  /** Get the data directory path. */
  getDataDir(): string {
    return this.dataDir;
  }

  /** Get the documents directory path. */
  getDocumentsDir(): string {
    return this.documentsDir;
  }

  /** Get the index directory path. */
  getIndexDir(): string {
    return this.indexDir;
  }

  /** Delete all stored data and recreate directories. */
  resetAll(): void {
    this.log.warn('Resetting all data', { dataDir: this.dataDir });
    fs.rmSync(this.dataDir, { recursive: true, force: true });
    this.ensureDirectories();
    this.log.info('Data reset complete');
  }
}
