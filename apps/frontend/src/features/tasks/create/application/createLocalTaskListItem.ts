import type {
  TaskCategoryOption,
  TaskCategorySummary,
  TaskListItem
} from '../../shared/types';
import type { TaskInlineCreateInput } from '../presentation/hooks/useTaskInlineCreate';

type CreateLocalTaskListItemArgs = {
  categoryOptions: TaskCategoryOption[];
  input: TaskInlineCreateInput;
};

/** Resolves the local category summary associated with the inline create input. */
function findCategorySummary(
  categoryOptions: TaskCategoryOption[],
  categoryId: string | null
): TaskCategorySummary | null {
  if (!categoryId) {
    return null;
  }

  const category = categoryOptions.find((item) => item.id === categoryId);

  if (!category) {
    return null;
  }

  return {
    id: category.id,
    name: category.name,
    color: null
  };
}

/** Builds a local task-list item used before the frontend is wired to task creation APIs. */
export function createLocalTaskListItem({
  categoryOptions,
  input
}: CreateLocalTaskListItemArgs): TaskListItem {
  const now = new Date().toISOString();

  return {
    id: `local-task-${Date.now()}`,
    title: input.title,
    description: input.description,
    isCompleted: false,
    createdAt: now,
    updatedAt: now,
    category: findCategorySummary(categoryOptions, input.categoryId),
    sharing: {
      isOwner: true,
      permission: 'owner',
      isShared: false,
      sharedCount: 0
    }
  };
}
