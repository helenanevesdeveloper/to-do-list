import type { TaskCompletionStatus } from '../../../shared/types';

/** Draft state captured by the inline task-edit row before submission. */
export type TaskInlineEditDraft = {
  categoryId: string;
  description: string;
  status: TaskCompletionStatus;
  title: string;
};

/** Normalized payload used to update one task from the inline edit row. */
export type TaskInlineEditInput = {
  categoryId: string | null;
  description: string | null;
  isCompleted: boolean;
  title: string;
};
