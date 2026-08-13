import {
  DEFAULT_TASK_LIST_FILTERS,
  type TaskCategoryOption,
  type TaskListFilters
} from '../../shared/types.js';

export type ActiveTaskFilterChip = {
  id: 'scope' | 'status' | 'category';
  label: string;
  colorScheme: 'blue' | 'green' | 'orange';
  onClear: () => void;
};

export type BuildActiveTaskFilterChipsArgs = {
  filters: TaskListFilters;
  categoryOptions: TaskCategoryOption[];
  onClearScope: () => void;
  onClearStatus: () => void;
  onClearCategory: () => void;
};

/** Resolves the visible category label for filter chips and summaries. */
function resolveCategoryLabel(
  categoryId: string,
  categoryOptions: TaskCategoryOption[]
): string {
  if (!categoryId) {
    return '';
  }

  return categoryOptions.find((option) => option.id === categoryId)?.name ?? categoryId;
}

/** Builds the render-ready chip list for the active task filters section. */
export function buildActiveTaskFilterChips({
  filters,
  categoryOptions,
  onClearScope,
  onClearStatus,
  onClearCategory
}: BuildActiveTaskFilterChipsArgs): ActiveTaskFilterChip[] {
  const chips: ActiveTaskFilterChip[] = [];

  if (filters.scope !== DEFAULT_TASK_LIST_FILTERS.scope) {
    chips.push({
      id: 'scope',
      label:
        filters.scope === 'shared'
          ? 'Escopo: Compartilhadas comigo'
          : 'Escopo: Todas visíveis',
      colorScheme: 'blue',
      onClear: onClearScope
    });
  }

  if (filters.status !== DEFAULT_TASK_LIST_FILTERS.status) {
    chips.push({
      id: 'status',
      label:
        filters.status === 'pending'
          ? 'Status: Pendentes'
          : 'Status: Concluídas',
      colorScheme: 'green',
      onClear: onClearStatus
    });
  }

  if (filters.categoryId) {
    chips.push({
      id: 'category',
      label: `Categoria: ${resolveCategoryLabel(filters.categoryId, categoryOptions)}`,
      colorScheme: 'orange',
      onClear: onClearCategory
    });
  }

  return chips;
}
