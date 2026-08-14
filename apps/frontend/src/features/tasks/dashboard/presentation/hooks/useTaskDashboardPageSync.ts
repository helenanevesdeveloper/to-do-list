import { useEffect } from 'react';

export interface UseTaskDashboardPageSyncInput {
  currentPage: number;
  filtersPage: number;
  setPage: (value: number) => void;
}

/** Keeps the filter page aligned with the effective page returned by the list query. */
export function useTaskDashboardPageSync({
  currentPage,
  filtersPage,
  setPage
}: UseTaskDashboardPageSyncInput): void {
  useEffect(() => {
    if (currentPage !== filtersPage) {
      setPage(currentPage);
    }
  }, [currentPage, filtersPage, setPage]);
}
