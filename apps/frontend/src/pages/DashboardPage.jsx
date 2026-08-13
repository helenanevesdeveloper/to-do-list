import { Container, Stack } from '@chakra-ui/react';
import { useAuth } from '../features/auth/session/presentation/hooks/useAuth';
import { useDashboardLogout } from '../features/auth/session/presentation/hooks/useDashboardLogout';
import TaskDashboardHeader from '../features/tasks/presentation/components/TaskDashboardHeader.tsx';
import TaskListControls from '../features/tasks/presentation/components/TaskListControls.tsx';
import { useTaskListFilters } from '../features/tasks/presentation/hooks/useTaskListFilters.ts';

export default function DashboardPage() {
  const { currentUserEmail, logout } = useAuth();
  const { isLoggingOut, handleLogout } = useDashboardLogout(logout);
  const handleAddTasks = () => {};
  const categoryOptions = [];
  const { filters, actions } = useTaskListFilters();

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
      </Stack>
    </Container>
  );
}
