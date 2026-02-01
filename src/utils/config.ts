import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { homedir } from 'os';
import { logger } from './logger.js';

export interface AppConfig {
  boardId: string;
  projectKey: string;
}

const CONFIG_PATH = resolve(homedir(), '.jira-tui', 'config.json');

const DEFAULT_CONFIG: AppConfig = {
  boardId: '13264',
  projectKey: 'SCWI',
};

// Cache the config so we only load once
let cachedConfig: AppConfig | null = null;

export function loadConfig(): AppConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    if (existsSync(CONFIG_PATH)) {
      const content = readFileSync(CONFIG_PATH, 'utf-8');
      const config = JSON.parse(content) as Partial<AppConfig>;
      logger.info(`loaded config from ${CONFIG_PATH}`);
      cachedConfig = { ...DEFAULT_CONFIG, ...config };
      return cachedConfig;
    }
  } catch (error) {
    logger.error(`failed to load config: ${error}`);
  }

  logger.info('using default config');
  cachedConfig = DEFAULT_CONFIG;
  return cachedConfig;
}
