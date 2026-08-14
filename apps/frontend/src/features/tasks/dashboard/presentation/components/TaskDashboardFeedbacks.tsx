import { Alert, AlertIcon, CloseButton, Stack } from '@chakra-ui/react';

export interface TaskDashboardFeedbacksProps {
  categoryErrorMessage?: string | null;
  clearDeleteTaskError?: () => void;
  deleteTaskErrorMessage?: string | null;
  taskListErrorMessage?: string | null;
  visibleTaskCount: number;
}

/** Renders the non-blocking feedback banners shown above the dashboard results area. */
export default function TaskDashboardFeedbacks({
  categoryErrorMessage = null,
  clearDeleteTaskError,
  deleteTaskErrorMessage = null,
  taskListErrorMessage = null,
  visibleTaskCount
}: TaskDashboardFeedbacksProps) {
  const shouldShowTaskListWarning =
    Boolean(taskListErrorMessage) && visibleTaskCount > 0;

  return (
    <Stack spacing={4}>
      {categoryErrorMessage ? (
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          Nao foi possivel carregar as categorias. O filtro e a selecao seguem com os
          dados disponiveis.
        </Alert>
      ) : null}

      {shouldShowTaskListWarning ? (
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          Nao foi possivel atualizar a lista. Exibindo os dados anteriores.
        </Alert>
      ) : null}

      {deleteTaskErrorMessage ? (
        <Alert alignItems="start" status="error" borderRadius="lg">
          <AlertIcon mt={1} />
          {deleteTaskErrorMessage}
          {clearDeleteTaskError ? (
            <CloseButton ml="auto" onClick={clearDeleteTaskError} />
          ) : null}
        </Alert>
      ) : null}
    </Stack>
  );
}
