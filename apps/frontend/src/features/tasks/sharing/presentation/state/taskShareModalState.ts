import type { TaskShare } from '../../domain/taskShare';
import type { TaskSharePermission } from '../../domain/taskSharePermission';

/** View-state contract for the future task-sharing modal. */
export interface TaskShareModalState {
  isOpen: boolean;
  taskId: string | null;
  taskTitle: string | null;
  email: string;
  permission: Exclude<TaskSharePermission, 'owner'>;
  shares: readonly TaskShare[];
  isLoadingShares: boolean;
  isSubmittingShare: boolean;
  errorMessage: string | null;
}

/** Initial placeholder state for future task-sharing flows. */
export const initialTaskShareModalState: TaskShareModalState = {
  isOpen: false,
  taskId: null,
  taskTitle: null,
  email: '',
  permission: 'reader',
  shares: [],
  isLoadingShares: false,
  isSubmittingShare: false,
  errorMessage: null,
};
