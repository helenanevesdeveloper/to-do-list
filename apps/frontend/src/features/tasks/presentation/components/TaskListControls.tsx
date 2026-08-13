import { Box, Stack } from '@chakra-ui/react';
import type { TaskCategoryOption, TaskListFilters } from '../../shared/types.js';
import type { TaskListFilterActions } from '../hooks/useTaskListFilters.js';
import { buildActiveTaskFilterChips } from '../mappers/buildActiveTaskFilterChips.js';
import ActiveTaskFilters from './ActiveTaskFilters.js';
import TaskListToolbar from './TaskListToolbar.js';

export type TaskListControlsProps = {
  categoryOptions: TaskCategoryOption[];
  filters: TaskListFilters;
  actions: TaskListFilterActions;
};

/** Composes task-list controls while keeping the page shell free of filter wiring. */
export default function TaskListControls({
  categoryOptions,
  filters,
  actions
}: TaskListControlsProps) {
  const activeFilterChips = buildActiveTaskFilterChips({
    filters,
    categoryOptions,
    onClearScope: actions.resetScope,
    onClearStatus: actions.resetStatus,
    onClearCategory: actions.resetCategory
  });

  return (
    <Box borderWidth="1px" borderRadius="lg" p={{ base: 5, md: 6 }}>
      <Stack spacing={5}>
        <TaskListToolbar
          filters={filters}
          categoryOptions={categoryOptions}
          onScopeChange={actions.setScope}
          onStatusChange={actions.setStatus}
          onCategoryChange={actions.setCategoryId}
          onPageSizeChange={actions.setPageSize}
        />

        <ActiveTaskFilters
          chips={activeFilterChips}
          onClearAll={actions.resetAll}
        />
      </Stack>
    </Box>
  );
}
