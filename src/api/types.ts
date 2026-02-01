export type StatusCategory = 'TO DO' | 'IN PROGRESS' | 'BLOCKED' | 'IN REVIEW' | 'DONE';

export interface JiraTask {
  key: string;
  summary: string;
  status: StatusCategory;
  assignee: string | null;
  description: string;
  priority: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';
  type: 'Bug' | 'Story' | 'Task' | 'Sub-task';
}

export const COLUMNS: StatusCategory[] = [
  'TO DO',
  'IN PROGRESS',
  'BLOCKED',
  'IN REVIEW',
  'DONE',
];

export const STATUS_SHORT_KEYS: Record<string, StatusCategory> = {
  t: 'TO DO',
  i: 'IN PROGRESS',
  b: 'BLOCKED',
  v: 'IN REVIEW',
  d: 'DONE',
};
