/**
 * Design tokens for Jira TUI
 *
 * Inspired by Claude Code's terminal aesthetic:
 * - Minimal borders (horizontal lines, not boxes)
 * - Restrained color palette (grays + single accent)
 * - Elegant Unicode symbols
 * - Visual hierarchy through weight/color, not borders
 */

// Colors - restrained palette with single accent color
export const COLORS = {
  // Primary text hierarchy
  text: 'white',
  textDim: 'gray',
  textMuted: 'dim', // for hints, secondary info

  // Accent - cyan only, used sparingly for emphasis
  accent: 'cyan',

  // Status colors - functional, muted
  status: {
    todo: 'gray',
    inProgress: 'blue',
    blocked: 'red',
    inReview: 'yellow',
    done: 'green',
  },

  // Selection state
  selected: 'cyan',

  // Borders and dividers
  border: 'gray',
  borderActive: 'cyan',
} as const;

// Unicode symbols for consistent UI elements
export const SYMBOLS = {
  selector: '❯', // Selected item indicator
  separator: '─', // Horizontal line character
  bullet: '•', // List items
  arrow: '→', // Navigation hints
  thinking: '∴', // Loading/processing state
  block: '⏺', // Content blocks
} as const;

// Type exports for type-safe usage
export type StatusColor = keyof typeof COLORS.status;
export type Symbol = keyof typeof SYMBOLS;

/**
 * Creates a horizontal line of specified width
 * Use for visual separation between sections
 */
export function horizontalLine(width: number): string {
  return SYMBOLS.separator.repeat(width);
}
