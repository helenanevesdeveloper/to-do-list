import { Button, Stack, Text } from '@chakra-ui/react';

export type TaskEditInlineFeedbackProps = {
  errorMessage: string | null;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
};

function shouldHandleKeyboardClick(detail: number): boolean {
  return detail === 0;
}

function buildTaskEditInlineHelperText(isSubmitting: boolean): string {
  if (isSubmitting) {
    return 'Salvando tarefa...';
  }

  return 'Edite os dados da tarefa e clique em Atualizar para salvar.';
}

/** Renders helper and error feedback for the inline task-edit row. */
export default function TaskEditInlineFeedback({
  errorMessage,
  isSubmitting,
  onSubmit
}: TaskEditInlineFeedbackProps) {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={2}
      justify="space-between"
      align={{ base: 'stretch', md: 'center' }}
    >
      <Text fontSize="sm" color="gray.600">
        {buildTaskEditInlineHelperText(isSubmitting)}
      </Text>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing={2}
        align={{ base: 'stretch', md: 'center' }}
      >
        {errorMessage ? (
          <Text fontSize="sm" color="red.500">
            {errorMessage}
          </Text>
        ) : null}
        <Button
          type="button"
          alignSelf={{ base: 'stretch', md: 'center' }}
          colorScheme="blue"
          isLoading={isSubmitting}
          onMouseDown={(event) => {
            if (event.button !== 0) {
              return;
            }

            event.preventDefault();
            event.stopPropagation();
            void onSubmit();
          }}
          onClick={(event) => {
            if (!shouldHandleKeyboardClick(event.detail)) {
              return;
            }

            void onSubmit();
          }}
        >
          Atualizar
        </Button>
      </Stack>
    </Stack>
  );
}
