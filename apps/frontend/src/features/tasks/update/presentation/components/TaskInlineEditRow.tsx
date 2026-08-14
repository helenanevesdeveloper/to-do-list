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
  onCancel: () => void;
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onUpdateTask: (input: TaskInlineEditInput) => Promise<void>;
  task: TaskListItem;
};

/** Renders the inline task-edit row that saves on outside click. */
export default function TaskInlineEditRow({
  categoryOptions,
  onCancel,
  onCreateCategory,
  onUpdateTask,
  task
}: TaskInlineEditRowProps) {
  const {
    draft,
    errorMessage,
    isSubmitting,
    rootRef,
    titleInputRef,
    setIsCategoryFieldOpen,
    setCategoryId,
    setDescription,
    setTitle
  } = useTaskInlineEdit({
    onCancel,
    onUpdateTask,
    task
  });

  return (
    <Box
      ref={rootRef}
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
          onCategoryFieldOpenChange={setIsCategoryFieldOpen}
          onDescriptionChange={setDescription}
          onSelectCategory={setCategoryId}
          onTitleChange={setTitle}
          titleInputRef={titleInputRef}
        />

        <TaskEditInlineFeedback
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
        />
      </Stack>
    </Box>
  );
}
