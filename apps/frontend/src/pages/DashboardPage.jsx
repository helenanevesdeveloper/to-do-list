import { Container, Stack } from '@chakra-ui/react';
import { useAuth } from '../features/auth/session/presentation/hooks/useAuth';
import { useDashboardLogout } from '../features/auth/session/presentation/hooks/useDashboardLogout';
import TaskDashboardHeader from '../features/tasks/dashboard/presentation/components/TaskDashboardHeader.js';
import TaskListControls from '../features/tasks/list/presentation/components/TaskListControls.js';
import TaskTable from '../features/tasks/list/presentation/components/TaskTable.js';
import { selectVisibleTaskListItems } from '../features/tasks/list/application/selectVisibleTaskListItems.js';
import { useTaskListFilters } from '../features/tasks/list/presentation/hooks/useTaskListFilters.js';
import {
  TASK_CATEGORY_SAMPLE_OPTIONS,
  TASK_LIST_SAMPLE_DATA
} from '../features/tasks/list/presentation/state/taskListSampleData.js';

export default function DashboardPage() {
  const { currentUserEmail, logout } = useAuth();
  const { isLoggingOut, handleLogout } = useDashboardLogout(logout);
  const handleAddTasks = () => {};
  const categoryOptions = TASK_CATEGORY_SAMPLE_OPTIONS;
  const { filters, actions } = useTaskListFilters();
  const visibleTasks = selectVisibleTaskListItems({
    items: TASK_LIST_SAMPLE_DATA,
    filters
  });

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

        <TaskTable items={visibleTasks} onTaskClick={handleTaskClick} />
      </Stack>
    </Container>
  );
}
