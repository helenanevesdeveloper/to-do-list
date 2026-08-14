export interface ResolveTaskDeleteNextPageInput {
  currentPage: number;
  visibleItemCount: number;
}

/** Chooses whether the dashboard should step back one page after a deletion. */
export function resolveTaskDeleteNextPage({
  currentPage,
  visibleItemCount
}: ResolveTaskDeleteNextPageInput): number | null {
  if (currentPage <= 1 || visibleItemCount !== 1) {
    return null;
  }

  return currentPage - 1;
}
