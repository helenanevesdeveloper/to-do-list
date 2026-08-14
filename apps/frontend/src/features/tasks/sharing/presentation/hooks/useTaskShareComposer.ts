import type { TaskSharePermission } from '../../domain/taskSharePermission';

/** State returned by the future hook that manages share creation inputs. */
export interface UseTaskShareComposerResult {
  email: string;
  permission: Exclude<TaskSharePermission, 'owner'>;
  isSubmitting: boolean;
  errorMessage: string | null;
  setEmail: (value: string) => void;
  setPermission: (value: Exclude<TaskSharePermission, 'owner'>) => void;
  submitShare: () => Promise<void>;
  resetComposer: () => void;
}

/** Placeholder hook for future task-share creation state. */
export function useTaskShareComposer(): UseTaskShareComposerResult {
  return {
    email: '',
    permission: 'reader',
    isSubmitting: false,
    errorMessage: null,
    setEmail() {},
    setPermission() {},
    async submitShare() {
      throw new Error('TODO: implement useTaskShareComposer.submitShare.');
    },
    resetComposer() {},
  };
}
