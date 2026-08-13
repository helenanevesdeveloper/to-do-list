import type {
  TaskInlineCreateDraft,
  TaskInlineCreateInput
} from './taskInlineCreateTypes';

export type TaskInlineCreateAttemptResult =
  | { type: 'ignore' }
  | { type: 'invalid'; errorMessage: string }
  | { type: 'create'; input: TaskInlineCreateInput };

/** Shared empty state for the inline task-create row. */
export const EMPTY_TASK_INLINE_CREATE_DRAFT: TaskInlineCreateDraft = {
  categoryId: '',
  description: '',
  title: ''
};

/** Returns true when the inline create row contains any meaningful user input. */
export function hasTaskInlineCreateValue(
  draft: TaskInlineCreateDraft
): boolean {
  return (
    draft.title.trim() !== '' ||
    draft.description.trim() !== '' ||
    draft.categoryId.trim() !== ''
  );
}

/** Returns the validation error message for the current inline create draft. */
export function validateTaskInlineCreateDraft(
  draft: TaskInlineCreateDraft
): string | null {
  if (hasTaskInlineCreateValue(draft) && draft.title.trim() === '') {
    return 'O título é obrigatório para salvar a tarefa.';
  }

  return null;
}

/** Converts raw inline form state into the payload used to create a local task. */
export function normalizeTaskInlineCreateDraft(
  draft: TaskInlineCreateDraft
): TaskInlineCreateInput {
  const normalizedDescription = draft.description.trim();
  const normalizedCategoryId = draft.categoryId.trim();

  return {
    categoryId: normalizedCategoryId || null,
    description: normalizedDescription || null,
    title: draft.title.trim()
  };
}

/** Resolves what should happen when the user leaves the inline create row. */
export function resolveTaskInlineCreateAttempt(
  draft: TaskInlineCreateDraft
): TaskInlineCreateAttemptResult {
  if (!hasTaskInlineCreateValue(draft)) {
    return { type: 'ignore' };
  }

  const validationError = validateTaskInlineCreateDraft(draft);

  if (validationError) {
    return {
      type: 'invalid',
      errorMessage: validationError
    };
  }

  return {
    type: 'create',
    input: normalizeTaskInlineCreateDraft(draft)
  };
}
