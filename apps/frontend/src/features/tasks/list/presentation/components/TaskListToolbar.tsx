import { Stack } from '@chakra-ui/react';
import type {
  TaskCategoryOption,
  TaskListFilters,
  TaskScopeFilter,
  TaskStatusFilter
} from '../../../shared/types';
import TaskCategoryField from './TaskCategoryField';
import TaskPageSizeField from './TaskPageSizeField';
import TaskScopeField from './TaskScopeField';
import TaskStatusField from './TaskStatusField';

export type TaskListToolbarProps = {
  categoryOptions: TaskCategoryOption[];
  filters: TaskListFilters;
  isLoadingCategories?: boolean;
  onCategoryChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
  onScopeChange: (value: TaskScopeFilter) => void;
  onStatusChange: (value: TaskStatusFilter) => void;
};

/** Renders only the filter and page-size inputs for the task dashboard list. */
export default function TaskListToolbar({
  categoryOptions,
  filters,
  isLoadingCategories = false,
  onCategoryChange,
  onPageSizeChange,
  onScopeChange,
  onStatusChange,
}: TaskListToolbarProps) {
  return (
    <Stack
      direction={{ base: 'column', xl: 'row' }}
      spacing={4}
      justify="space-between"
      align={{ base: 'stretch', xl: 'end' }}
    >
      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        flex="1"
        align={{ base: 'stretch', md: 'end' }}
      >
        <TaskScopeField value={filters.scope} onChange={onScopeChange} />
        <TaskStatusField value={filters.status} onChange={onStatusChange} />
        <TaskCategoryField
          value={filters.categoryId}
          categoryOptions={categoryOptions}
          isDisabled={isLoadingCategories}
          onChange={onCategoryChange}
        />
      </Stack>

      <TaskPageSizeField value={filters.pageSize} onChange={onPageSizeChange} />
    </Stack>
  );
}
