import { Box, Stack } from '@chakra-ui/react';
import type { TaskCategoryOption, TaskListItem } from '../../../shared/types';
import {
  useTaskInlineEdit,
  type TaskInlineEditInput
} from '../hooks/useTaskInlineEdit';
import TaskEditInlineFeedback from './TaskEditInlineFeedback';
import TaskEditInlineFields from './TaskEditInlineFields';

export type TaskInlineEditRowProps = {
  categoryOptions: TaskCategoryOption[];
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onUpdateTask: (input: TaskInlineEditInput) => Promise<void>;
  onUpdateCategory: (categoryId: string, name: string) => Promise<TaskCategoryOption>;
  task: TaskListItem;
};

/** Renders the inline task-edit row with explicit save action. */
export default function TaskInlineEditRow({
  categoryOptions,
  onCreateCategory,
  onDeleteCategory,
  onUpdateTask,
  onUpdateCategory,
  task
}: TaskInlineEditRowProps) {
  const {
    draft,
    errorMessage,
    isSubmitting,
    titleInputRef,
    submitUpdate,
    setCategoryId,
    setDescription,
    setStatus,
    setTitle
  } = useTaskInlineEdit({
    onUpdateTask,
    task
  });

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={{ base: 4, md: 5 }}
      bg="white"
    >
      <Stack spacing={3}>
        <TaskEditInlineFields
          categoryOptions={categoryOptions}
          draft={draft}
          isSubmitting={isSubmitting}
          onCreateCategory={onCreateCategory}
          onDeleteCategory={onDeleteCategory}
          onDescriptionChange={setDescription}
          onSelectCategory={setCategoryId}
          onStatusChange={setStatus}
          onTitleChange={setTitle}
          onUpdateCategory={onUpdateCategory}
          titleInputRef={titleInputRef}
        />

        <TaskEditInlineFeedback
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          onSubmit={submitUpdate}
        />
      </Stack>
    </Box>
  );
}
