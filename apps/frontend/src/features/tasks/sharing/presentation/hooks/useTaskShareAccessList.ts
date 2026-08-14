import type { TaskShare } from '../../domain/taskShare';

/** State returned by the future hook that manages visible task shares. */
export interface UseTaskShareAccessListResult {
  shares: readonly TaskShare[];
  isLoading: boolean;
  errorMessage: string | null;
  reloadShares: () => Promise<void>;
}

/** Placeholder hook for future task-share list loading. */
export function useTaskShareAccessList(): UseTaskShareAccessListResult {
  return {
    shares: [],
    isLoading: false,
    errorMessage: null,
    async reloadShares() {
      throw new Error('TODO: implement useTaskShareAccessList.reloadShares.');
    },
  };
}
