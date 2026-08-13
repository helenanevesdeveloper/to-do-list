import { Container, Stack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAuth } from '../features/auth/session/presentation/hooks/useAuth';
import { useDashboardLogout } from '../features/auth/session/presentation/hooks/useDashboardLogout';
import TaskDashboardHeader from '../features/tasks/dashboard/presentation/components/TaskDashboardHeader';
import TaskListControls from '../features/tasks/list/presentation/components/TaskListControls';
import TaskPagination from '../features/tasks/list/presentation/components/TaskPagination';
import TaskTable from '../features/tasks/list/presentation/components/TaskTable';
import { selectVisibleTaskListItems } from '../features/tasks/list/application/selectVisibleTaskListItems';
import { useTaskListFilters } from '../features/tasks/list/presentation/hooks/useTaskListFilters';
import {
  TASK_CATEGORY_SAMPLE_OPTIONS,
  TASK_LIST_SAMPLE_DATA
} from '../features/tasks/list/presentation/state/taskListSampleData';

export default function DashboardPage() {
  const { currentUserEmail, logout } = useAuth();
  const { isLoggingOut, handleLogout } = useDashboardLogout(logout);
  const handleAddTasks = () => {};
  const categoryOptions = TASK_CATEGORY_SAMPLE_OPTIONS;
  const { filters, actions } = useTaskListFilters();
  const paginatedTasks = selectVisibleTaskListItems({
    items: TASK_LIST_SAMPLE_DATA,
    filters
  });

  useEffect(() => {
    if (paginatedTasks.currentPage !== filters.page) {
      actions.setPage(paginatedTasks.currentPage);
    }
  }, [actions, filters.page, paginatedTasks.currentPage]);

  function handleTaskClick() {}

  return (
    <Container maxW="6xl" py={{ base: 10, md: 14 }}>
      <Stack spacing={6}>
        <TaskDashboardHeader
          title="Minhas tarefas"
          subtitle={`Sessão ativa para ${currentUserEmail ?? 'um usuário autenticado'}.`}
          onAddTasks={handleAddTasks}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        <TaskListControls
          categoryOptions={categoryOptions}
          filters={filters}
          actions={actions}
        />

        <TaskTable items={paginatedTasks.items} onTaskClick={handleTaskClick} />

        <TaskPagination
          currentPage={paginatedTasks.currentPage}
          endItem={paginatedTasks.endItem}
          hasNextPage={paginatedTasks.hasNextPage}
          hasPreviousPage={paginatedTasks.hasPreviousPage}
          onNextPage={actions.goToNextPage}
          onPreviousPage={actions.goToPreviousPage}
          startItem={paginatedTasks.startItem}
          totalItems={paginatedTasks.totalItems}
          totalPages={paginatedTasks.totalPages}
        />
      </Stack>
    </Container>
  );
}
