import { Stack, Text } from '@chakra-ui/react';

export type TaskCreateInlineFeedbackProps = {
  errorMessage: string | null;
  isSubmitting: boolean;
};

function buildTaskCreateInlineHelperText(isSubmitting: boolean): string {
  if (isSubmitting) {
    return 'Salvando tarefa...';
  }

  return 'Digite os dados da tarefa e clique fora da linha para salvar.';
}

/** Renders helper and error feedback for the inline task-create row. */
export default function TaskCreateInlineFeedback({
  errorMessage,
  isSubmitting
}: TaskCreateInlineFeedbackProps) {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={2}
      justify="space-between"
      align={{ base: 'stretch', md: 'center' }}
    >
      <Text fontSize="sm" color="gray.600">
        {buildTaskCreateInlineHelperText(isSubmitting)}
      </Text>
      {errorMessage ? (
        <Text fontSize="sm" color="red.500">
          {errorMessage}
        </Text>
      ) : null}
    </Stack>
  );
}
