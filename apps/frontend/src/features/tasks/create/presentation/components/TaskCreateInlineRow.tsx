import {
  Box,
  FormControl,
  Input,
  Stack,
  Text
} from '@chakra-ui/react';
import TaskInlineCategoryField from '../../../categories/presentation/components/TaskInlineCategoryField';
import type { TaskCategoryOption } from '../../../shared/types';
import { useTaskInlineCreate, type TaskInlineCreateInput } from '../hooks/useTaskInlineCreate';

export type TaskCreateInlineRowProps = {
  categoryOptions: TaskCategoryOption[];
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onCreateTask: (input: TaskInlineCreateInput) => void;
};

/** Renders the inline task-create row that saves a local task on outside click. */
export default function TaskCreateInlineRow({
  categoryOptions,
  onCreateCategory,
  onCreateTask
}: TaskCreateInlineRowProps) {
  const {
    draft,
    errorMessage,
    rootRef,
    titleInputRef,
    setCategoryId,
    setDescription,
    setTitle
  } = useTaskInlineCreate({ onCreateTask });

  return (
    <Box
      ref={rootRef}
      borderWidth="1px"
      borderRadius="lg"
      p={{ base: 4, md: 5 }}
      bg="white"
    >
      <Stack spacing={3}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={3}
          align={{ base: 'stretch', md: 'flex-start' }}
        >
          <FormControl flex={{ md: '2' }}>
            <Input
              ref={titleInputRef}
              aria-label="Título da tarefa"
              placeholder="Título da tarefa"
              value={draft.title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FormControl>

          <FormControl flex={{ md: '2' }}>
            <Input
              aria-label="Descrição da tarefa"
              placeholder="Descrição opcional"
              value={draft.description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </FormControl>

          <TaskInlineCategoryField
            categoryOptions={categoryOptions}
            value={draft.categoryId}
            onSelectCategory={setCategoryId}
            onCreateCategory={onCreateCategory}
          />
        </Stack>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={2}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
        >
          <Text fontSize="sm" color="gray.600">
            Digite os dados da tarefa e clique fora da linha para salvar.
          </Text>
          {errorMessage ? (
            <Text fontSize="sm" color="red.500">
              {errorMessage}
            </Text>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}
