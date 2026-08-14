import type { TaskListItem } from '../../../shared/types';
import type {
  TaskInlineEditDraft,
  TaskInlineEditInput
} from './taskInlineEditTypes';

export type TaskInlineEditAttemptResult =
  | { type: 'ignore' }
  | { type: 'invalid'; errorMessage: string }
  | { type: 'update'; input: TaskInlineEditInput };

/** Builds the initial inline edit draft from one task list item. */
export function buildTaskInlineEditDraft(
  task: TaskListItem
): TaskInlineEditDraft {
  return {
    categoryId: task.category?.id ?? '',
    description: task.description ?? '',
    title: task.title
  };
}

/** Returns the validation error message for the current inline edit draft. */
export function validateTaskInlineEditDraft(
  draft: TaskInlineEditDraft
): string | null {
  if (draft.title.trim() === '') {
    return 'O titulo e obrigatorio para salvar a tarefa.';
  }

  return null;
}

/** Converts raw inline edit state into the payload used to update one task. */
export function normalizeTaskInlineEditDraft(
  draft: TaskInlineEditDraft
): TaskInlineEditInput {
  const normalizedDescription = draft.description.trim();
  const normalizedCategoryId = draft.categoryId.trim();

  return {
    categoryId: normalizedCategoryId || null,
    description: normalizedDescription || null,
    title: draft.title.trim()
  };
}

function haveTaskInlineEditInputsChanged(
  initialDraft: TaskInlineEditDraft,
  draft: TaskInlineEditDraft
): boolean {
  const initialInput = normalizeTaskInlineEditDraft(initialDraft);
  const input = normalizeTaskInlineEditDraft(draft);

  return (
    initialInput.title !== input.title ||
    initialInput.description !== input.description ||
    initialInput.categoryId !== input.categoryId
  );
}

/** Resolves what should happen when the user leaves the inline edit row. */
export function resolveTaskInlineEditAttempt(args: {
  draft: TaskInlineEditDraft;
  initialDraft: TaskInlineEditDraft;
}): TaskInlineEditAttemptResult {
  if (!haveTaskInlineEditInputsChanged(args.initialDraft, args.draft)) {
    return { type: 'ignore' };
  }

  const validationError = validateTaskInlineEditDraft(args.draft);

  if (validationError) {
    return {
      type: 'invalid',
      errorMessage: validationError
    };
  }

  return {
    type: 'update',
    input: normalizeTaskInlineEditDraft(args.draft)
  };
}
