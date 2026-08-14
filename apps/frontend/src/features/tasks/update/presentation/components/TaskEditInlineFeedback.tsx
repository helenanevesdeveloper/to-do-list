import { Stack, Text } from '@chakra-ui/react';

export type TaskEditInlineFeedbackProps = {
  errorMessage: string | null;
  isSubmitting: boolean;
};

function buildTaskEditInlineHelperText(isSubmitting: boolean): string {
  if (isSubmitting) {
    return 'Salvando tarefa...';
  }

  return 'Edite os dados da tarefa e clique fora da linha para salvar.';
}

/** Renders helper and error feedback for the inline task-edit row. */
export default function TaskEditInlineFeedback({
  errorMessage,
  isSubmitting
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
      {errorMessage ? (
        <Text fontSize="sm" color="red.500">
          {errorMessage}
        </Text>
      ) : null}
    </Stack>
  );
}
