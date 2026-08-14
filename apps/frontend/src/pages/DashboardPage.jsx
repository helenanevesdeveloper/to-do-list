import { Container, Stack } from '@chakra-ui/react';
import { useAuth } from '../features/auth/session/presentation/hooks/useAuth';
import { useDashboardLogout } from '../features/auth/session/presentation/hooks/useDashboardLogout';
import TaskDashboardFeedbacks from '../features/tasks/dashboard/presentation/components/TaskDashboardFeedbacks';
import TaskDashboardHeader from '../features/tasks/dashboard/presentation/components/TaskDashboardHeader';
import TaskDashboardResultsSection from '../features/tasks/dashboard/presentation/components/TaskDashboardResultsSection';
import TaskDashboardShareModalMount from '../features/tasks/dashboard/presentation/components/TaskDashboardShareModalMount';
import { useTaskDashboard } from '../features/tasks/dashboard/presentation/hooks/useTaskDashboard';
import TaskCreateInlineRow from '../features/tasks/create/presentation/components/TaskCreateInlineRow';
import TaskListControls from '../features/tasks/list/presentation/components/TaskListControls';
import { TaskShareModalProvider } from '../features/tasks/sharing/presentation/context/TaskShareModalContext';

export default function DashboardPage() {
  const { currentUserEmail, logout } = useAuth();
  const { isLoggingOut, handleLogout } = useDashboardLogout(logout);
  const {
    actions,
    categoryErrorMessage,
    categoryOptions,
    cancelTaskEdit,
    clearDeleteTaskError,
    deleteTaskErrorMessage,
    deletingTaskId,
    editingTaskId,
    errorMessage,
    handleCreateCategory,
    filters,
    handleCreateTask,
    handleTaskClick,
    handleTaskDelete,
    handleTaskUpdate,
    isLoading,
    isLoadingCategories,
    paginatedTasks,
    reloadTasks,
  } = useTaskDashboard();

  return (
    <TaskShareModalProvider
      currentUserEmail={currentUserEmail}
      reloadTasks={reloadTasks}
    >
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

          <TaskDashboardFeedbacks
            categoryErrorMessage={categoryErrorMessage}
            clearDeleteTaskError={clearDeleteTaskError}
            deleteTaskErrorMessage={deleteTaskErrorMessage}
            taskListErrorMessage={errorMessage}
            visibleTaskCount={paginatedTasks.items.length}
          />

          <TaskCreateInlineRow
            categoryOptions={categoryOptions}
            onCreateCategory={handleCreateCategory}
            onCreateTask={handleCreateTask}
          />

          <TaskDashboardResultsSection
            categoryOptions={categoryOptions}
            deletingTaskId={deletingTaskId}
            editingTaskId={editingTaskId}
            errorMessage={errorMessage}
            isLoading={isLoading}
            onCreateCategory={handleCreateCategory}
            onNextPage={actions.goToNextPage}
            onPreviousPage={actions.goToPreviousPage}
            onRetry={reloadTasks}
            onTaskCancelEdit={cancelTaskEdit}
            onTaskDelete={handleTaskDelete}
            onTaskClick={handleTaskClick}
            onTaskUpdate={handleTaskUpdate}
            page={paginatedTasks}
          />
        </Stack>

        <TaskDashboardShareModalMount />
      </Container>
    </TaskShareModalProvider>
  );
}
