import { Alert, AlertIcon, Container, Stack } from '@chakra-ui/react';
import { useAuth } from '../features/auth/session/presentation/hooks/useAuth';
import { useDashboardLogout } from '../features/auth/session/presentation/hooks/useDashboardLogout';
import TaskDashboardHeader from '../features/tasks/dashboard/presentation/components/TaskDashboardHeader';
import { useTaskDashboard } from '../features/tasks/dashboard/presentation/hooks/useTaskDashboard';
import TaskCreateInlineRow from '../features/tasks/create/presentation/components/TaskCreateInlineRow';
import TaskListControls from '../features/tasks/list/presentation/components/TaskListControls';
import TaskPagination from '../features/tasks/list/presentation/components/TaskPagination';
import TaskResultsPanel from '../features/tasks/list/presentation/components/TaskResultsPanel';

export default function DashboardPage() {
  const { currentUserEmail, logout } = useAuth();
  const { isLoggingOut, handleLogout } = useDashboardLogout(logout);
  const {
    actions,
    categoryErrorMessage,
    categoryOptions,
    errorMessage,
    handleCreateCategory,
    filters,
    handleCreateTask,
    handleTaskClick,
    isLoading,
    isLoadingCategories,
    paginatedTasks,
    reloadTasks
  } = useTaskDashboard();

  return (
    <Container maxW="6xl" py={{ base: 10, md: 14 }}>
      <Stack spacing={6}>
        <TaskDashboardHeader
          title="Minhas tarefas"
          subtitle={`Sessão ativa para ${currentUserEmail ?? 'um usuário autenticado'}.`}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        <TaskListControls
          categoryOptions={categoryOptions}
          filters={filters}
          actions={actions}
          isLoadingCategories={isLoadingCategories}
        />

        {categoryErrorMessage ? (
          <Alert status="warning" borderRadius="lg">
            <AlertIcon />
            Nao foi possivel carregar as categorias. O filtro e a selecao seguem com os dados disponiveis.
          </Alert>
        ) : null}

        <TaskCreateInlineRow
          categoryOptions={categoryOptions}
          onCreateCategory={handleCreateCategory}
          onCreateTask={handleCreateTask}
        />

        {errorMessage && paginatedTasks.items.length > 0 ? (
          <Alert status="warning" borderRadius="lg">
            <AlertIcon />
            Nao foi possivel atualizar a lista. Exibindo os dados anteriores.
          </Alert>
        ) : null}

        <TaskResultsPanel
          errorMessage={errorMessage}
          items={paginatedTasks.items}
          isLoading={isLoading}
          onTaskClick={handleTaskClick}
          onRetry={reloadTasks}
        />

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
