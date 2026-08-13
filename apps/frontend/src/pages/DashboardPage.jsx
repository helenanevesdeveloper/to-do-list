import { Container } from '@chakra-ui/react';
import { useAuth } from '../features/auth/session/presentation/hooks/useAuth';
import { useDashboardLogout } from '../features/auth/session/presentation/hooks/useDashboardLogout';
import TaskDashboardHeader from '../features/tasks/presentation/components/TaskDashboardHeader.tsx';

export default function DashboardPage() {
  const { currentUserEmail, logout } = useAuth();
  const { isLoggingOut, handleLogout } = useDashboardLogout(logout);
  const handleAddTasks = () => {};

  return (
    <Container maxW="6xl" py={{ base: 10, md: 14 }}>
      <TaskDashboardHeader
        title="Minhas tarefas"
        subtitle={`Sessão ativa para ${currentUserEmail ?? 'um usuário autenticado'}.`}
        onAddTasks={handleAddTasks}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </Container>
  );
}
