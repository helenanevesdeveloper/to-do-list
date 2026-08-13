import type { TaskCategoryOption } from '../../../shared/types';

export type TaskInlineCategoryFieldState = {
  canCreateCategory: boolean;
  createLabel: string | null;
  filteredCategoryOptions: TaskCategoryOption[];
  normalizedQuery: string;
  selectedCategory: TaskCategoryOption | null;
  triggerLabel: string;
};

export type TaskInlineCategoryOptionItem = {
  id: string;
  isSelected: boolean;
  name: string;
};

export type TaskInlineCategoryOptionListState = {
  hasResults: boolean;
  optionItems: TaskInlineCategoryOptionItem[];
};

/** Normalizes category queries before filtering or comparing existing names. */
export function normalizeTaskInlineCategoryQuery(query: string): string {
  return query.trim().toLocaleLowerCase();
}

/** Filters category options by a case-insensitive query while preserving source order. */
export function filterTaskInlineCategoryOptions(
  categoryOptions: TaskCategoryOption[],
  query: string
): TaskCategoryOption[] {
  const normalizedQuery = normalizeTaskInlineCategoryQuery(query);

  if (!normalizedQuery) {
    return categoryOptions;
  }

  return categoryOptions.filter((categoryOption) =>
    normalizeTaskInlineCategoryQuery(categoryOption.name).includes(normalizedQuery)
  );
}

/** Builds the derived list state used by the inline category picker. */
export function buildTaskInlineCategoryFieldState(
  categoryOptions: TaskCategoryOption[],
  query: string,
  value: string
): TaskInlineCategoryFieldState {
  const selectedCategory = findSelectedTaskCategoryOption(categoryOptions, value);
  const normalizedQuery = normalizeTaskInlineCategoryQuery(query);
  const filteredCategoryOptions = filterTaskInlineCategoryOptions(
    categoryOptions,
    query
  );
  const canCreateCategory =
    normalizedQuery.length > 0 &&
    !categoryOptions.some(
      (categoryOption) =>
        normalizeTaskInlineCategoryQuery(categoryOption.name) === normalizedQuery
    );
  const createLabel = buildTaskInlineCategoryCreateActionLabel(
    canCreateCategory,
    query
  );

  return {
    canCreateCategory,
    createLabel,
    filteredCategoryOptions,
    normalizedQuery,
    selectedCategory,
    triggerLabel: selectedCategory?.name ?? 'Categoria'
  };
}

/** Resolves the currently selected category object from the available options. */
export function findSelectedTaskCategoryOption(
  categoryOptions: TaskCategoryOption[],
  value: string
): TaskCategoryOption | null {
  return (
    categoryOptions.find((categoryOption) => categoryOption.id === value) ?? null
  );
}

/** Builds the render state for the inline category suggestion list. */
export function buildTaskInlineCategoryOptionListState(args: {
  categoryOptions: TaskCategoryOption[];
  selectedCategoryId: string;
}): TaskInlineCategoryOptionListState {
  const optionItems = args.categoryOptions.map((categoryOption) => ({
    id: categoryOption.id,
    isSelected: categoryOption.id === args.selectedCategoryId,
    name: categoryOption.name
  }));

  return {
    hasResults: optionItems.length > 0,
    optionItems
  };
}

/** Resolves the footer label for creating a category from the current query. */
export function buildTaskInlineCategoryCreateActionLabel(
  canCreateCategory: boolean,
  query: string
): string | null {
  return canCreateCategory ? `Criar "${query.trim()}"` : null;
}
