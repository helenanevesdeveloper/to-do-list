/** Draft state captured by the inline task-create row before submission. */
export type TaskInlineCreateDraft = {
  categoryId: string;
  description: string;
  title: string;
};

/** Normalized payload used to submit one task from the inline create row. */
export type TaskInlineCreateInput = {
  categoryId: string | null;
  description: string | null;
  title: string;
};
