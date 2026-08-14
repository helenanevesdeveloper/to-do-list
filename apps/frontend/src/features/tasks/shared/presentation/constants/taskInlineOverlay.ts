/** Shared DOM marker used by inline task rows to treat floating overlays as internal UI. */
export const TASK_INLINE_OVERLAY_ATTRIBUTE = 'data-task-inline-overlay';

/** CSS selector that matches any floating overlay owned by an inline task row. */
export const TASK_INLINE_OVERLAY_SELECTOR =
  `[${TASK_INLINE_OVERLAY_ATTRIBUTE}]`;
