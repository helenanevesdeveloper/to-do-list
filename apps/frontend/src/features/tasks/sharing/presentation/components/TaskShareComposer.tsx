import type { TaskSharePermission } from '../../domain/taskSharePermission';

/** Props for the future share-composer row shown at the top of the modal. */
export interface TaskShareComposerProps {
  email: string;
  permission: Exclude<TaskSharePermission, 'owner'>;
  canManageShares: boolean;
}

/** Placeholder composer component for future task-sharing flows. */
export default function TaskShareComposer(
  _props: TaskShareComposerProps,
): null {
  return null;
}
