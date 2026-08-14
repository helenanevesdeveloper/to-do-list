/** View-state contract for task deletion from the dashboard list. */
export interface TaskDeleteState {
  deletingTaskId: string | null;
  errorMessage: string | null;
}

/** Initial placeholder state for future task-deletion flows. */
export const initialTaskDeleteState: TaskDeleteState = {
  deletingTaskId: null,
  errorMessage: null,
};
