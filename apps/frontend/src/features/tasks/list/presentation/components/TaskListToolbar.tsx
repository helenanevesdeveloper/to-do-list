import { Stack } from '@chakra-ui/react';
import type {
  TaskCategoryOption,
  TaskListFilters,
  TaskScopeFilter,
  TaskStatusFilter
} from '../../../shared/types.js';
import TaskCategoryField from './TaskCategoryField.js';
import TaskPageSizeField from './TaskPageSizeField.js';
import TaskScopeField from './TaskScopeField.js';
import TaskStatusField from './TaskStatusField.js';

export type TaskListToolbarProps = {
  filters: TaskListFilters;
  categoryOptions: TaskCategoryOption[];
  onScopeChange: (value: TaskScopeFilter) => void;
  onStatusChange: (value: TaskStatusFilter) => void;
  onCategoryChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
};

/** Renders only the filter and page-size inputs for the task dashboard list. */
export default function TaskListToolbar({
  filters,
  categoryOptions,
  onScopeChange,
  onStatusChange,
  onCategoryChange,
  onPageSizeChange
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
          onChange={onCategoryChange}
        />
      </Stack>

      <TaskPageSizeField value={filters.pageSize} onChange={onPageSizeChange} />
    </Stack>
  );
}
