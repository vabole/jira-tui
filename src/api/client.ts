import { resolve } from 'path';
import { homedir } from 'os';
import { existsSync, readFileSync } from 'fs';
import type { JiraTask, StatusCategory } from './types.js';
import { logger } from '../utils/logger.js';

// Load .env from home directory (manually to avoid dotenv noise)
function loadEnv() {
  const envPath = resolve(homedir(), '.env');
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex);
    let value = trimmed.slice(eqIndex + 1);
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}
loadEnv();

const JIRA_URL = process.env.JIRA_URL || process.env.JIRA_HOST;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

if (!JIRA_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error('Missing Jira credentials in ~/.env');
  console.error('Required: JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN');
  process.exit(1);
}

const AUTH_HEADER = `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`;

interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status: { name: string };
    assignee: { displayName: string } | null;
    description?: string | { content: Array<{ content: Array<{ text: string }> }> };
    priority?: { name: string };
    issuetype?: { name: string };
  };
}

interface JiraSearchResponse {
  issues: JiraIssue[];
  total: number;
}

interface JiraTransition {
  id: string;
  name: string;
  to: { name: string };
}

interface JiraTransitionsResponse {
  transitions: JiraTransition[];
}

// Map Jira status names to our status categories
const STATUS_MAP: Record<string, StatusCategory> = {
  'To Do': 'TO DO',
  'Open': 'TO DO',
  'Backlog': 'TO DO',
  'Backlog - Ready for Refinement': 'TO DO',
  'Ready for Sprint': 'TO DO',
  'In Progress': 'IN PROGRESS',
  'In Development': 'IN PROGRESS',
  'Progress': 'IN PROGRESS',
  'Blocked': 'BLOCKED',
  'On Hold': 'BLOCKED',
  'In Review': 'IN REVIEW',
  'Code Review': 'IN REVIEW',
  'Review': 'IN REVIEW',
  'Reviewing': 'IN REVIEW',
  'UAT': 'IN REVIEW',
  'Analyzing': 'IN REVIEW',
  'Done': 'DONE',
  'Closed': 'DONE',
  'Resolved': 'DONE',
  'UAT Ready (Done)': 'DONE',
  'Cancelled': 'DONE',
};

function mapStatus(jiraStatus: string): StatusCategory {
  return STATUS_MAP[jiraStatus] || 'TO DO';
}

function extractDescription(desc: JiraIssue['fields']['description']): string {
  if (!desc) return '';
  if (typeof desc === 'string') return desc;
  // ADF format
  try {
    return desc.content
      ?.map((block) => block.content?.map((item) => item.text).join(''))
      .join('\n') || '';
  } catch {
    return '';
  }
}

async function jiraFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${JIRA_URL}/rest/api/3${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': AUTH_HEADER,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Jira API error: ${response.status} ${text}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetches all issues from the active sprint for a given board and project.
 * @param boardId - The Jira board ID
 * @param projectKey - The project key (e.g., "PROJ")
 * @returns Array of tasks in the active sprint
 */
export async function fetchBoardIssues(boardId: string, projectKey: string): Promise<JiraTask[]> {
  logger.info(`fetching issues for board ${boardId} project ${projectKey}`);

  // Use JQL to fetch issues from active sprint - using new /search/jql endpoint
  const jql = `project = ${projectKey} AND sprint in openSprints() ORDER BY rank ASC`;

  const data = await jiraFetch<JiraSearchResponse>(
    `/search/jql`,
    {
      method: 'POST',
      body: JSON.stringify({
        jql,
        maxResults: 100,
        fields: ['summary', 'status', 'assignee', 'description', 'priority', 'issuetype'],
      }),
    }
  );

  logger.info(`fetched ${data.issues.length} issues`);

  return data.issues.map((issue): JiraTask => ({
    key: issue.key,
    summary: issue.fields.summary,
    status: mapStatus(issue.fields.status.name),
    assignee: issue.fields.assignee?.displayName || null,
    description: extractDescription(issue.fields.description),
    priority: (issue.fields.priority?.name as JiraTask['priority']) || 'Medium',
    type: (issue.fields.issuetype?.name as JiraTask['type']) || 'Task',
  }));
}

/**
 * Fetches issues assigned to the current user in the active sprint.
 * @param projectKey - The project key (e.g., "PROJ")
 * @returns Array of tasks assigned to the current user
 */
export async function fetchMyIssues(projectKey: string): Promise<JiraTask[]> {
  logger.info(`fetching my issues for project ${projectKey}`);

  const jql = `project = ${projectKey} AND sprint in openSprints() AND assignee = currentUser() ORDER BY rank ASC`;

  const data = await jiraFetch<JiraSearchResponse>(
    `/search/jql`,
    {
      method: 'POST',
      body: JSON.stringify({
        jql,
        maxResults: 100,
        fields: ['summary', 'status', 'assignee', 'description', 'priority', 'issuetype'],
      }),
    }
  );

  logger.info(`fetched ${data.issues.length} of my issues`);

  return data.issues.map((issue): JiraTask => ({
    key: issue.key,
    summary: issue.fields.summary,
    status: mapStatus(issue.fields.status.name),
    assignee: issue.fields.assignee?.displayName || null,
    description: extractDescription(issue.fields.description),
    priority: (issue.fields.priority?.name as JiraTask['priority']) || 'Medium',
    type: (issue.fields.issuetype?.name as JiraTask['type']) || 'Task',
  }));
}

/**
 * Gets available workflow transitions for an issue.
 * @param issueKey - The issue key (e.g., "PROJ-123")
 */
export async function getTransitions(issueKey: string): Promise<JiraTransition[]> {
  const data = await jiraFetch<JiraTransitionsResponse>(`/issue/${issueKey}/transitions`);
  return data.transitions;
}

/**
 * Executes a workflow transition on an issue.
 * @param issueKey - The issue key (e.g., "PROJ-123")
 * @param transitionId - The transition ID from getTransitions()
 */
export async function transitionIssue(issueKey: string, transitionId: string): Promise<void> {
  logger.action(`transitioning ${issueKey} with transition ${transitionId}`);

  await jiraFetch(`/issue/${issueKey}/transitions`, {
    method: 'POST',
    body: JSON.stringify({
      transition: { id: transitionId },
    }),
  });

  logger.info(`transition complete for ${issueKey}`);
}

/**
 * Finds a transition ID that moves an issue to the target status category.
 * @param issueKey - The issue key (e.g., "PROJ-123")
 * @param targetStatus - The target status category
 * @returns The transition ID, or null if no valid transition exists
 */
export async function findTransitionToStatus(issueKey: string, targetStatus: StatusCategory): Promise<string | null> {
  const transitions = await getTransitions(issueKey);

  // Log available transitions for debugging
  logger.info(`available transitions for ${issueKey}: ${transitions.map(t => `${t.name} -> ${t.to.name}`).join(', ')}`);

  // Try to find a transition that leads to the target status
  for (const t of transitions) {
    const mappedStatus = mapStatus(t.to.name);
    if (mappedStatus === targetStatus) {
      return t.id;
    }
  }

  // Also check by partial name match
  const targetLower = targetStatus.toLowerCase();
  for (const t of transitions) {
    if (t.to.name.toLowerCase().includes(targetLower.replace(' ', ''))) {
      return t.id;
    }
  }

  logger.error(`no transition found for ${issueKey} to ${targetStatus}`);
  return null;
}
