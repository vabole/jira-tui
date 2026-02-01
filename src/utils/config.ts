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

export function loadConfig(): AppConfig {
  try {
    if (existsSync(CONFIG_PATH)) {
      const content = readFileSync(CONFIG_PATH, 'utf-8');
      const config = JSON.parse(content) as Partial<AppConfig>;
      logger.info(`loaded config from ${CONFIG_PATH}`);
      return { ...DEFAULT_CONFIG, ...config };
    }
  } catch (error) {
    logger.error(`failed to load config: ${error}`);
  }

  logger.info('using default config');
  return DEFAULT_CONFIG;
}
