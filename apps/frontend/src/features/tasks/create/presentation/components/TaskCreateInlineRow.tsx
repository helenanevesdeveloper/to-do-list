import {
  Box,
  Stack
} from '@chakra-ui/react';
import type { TaskCategoryOption } from '../../../shared/types';
import { useTaskInlineCreate, type TaskInlineCreateInput } from '../hooks/useTaskInlineCreate';
import TaskCreateInlineFeedback from './TaskCreateInlineFeedback';
import TaskCreateInlineFields from './TaskCreateInlineFields';

export type TaskCreateInlineRowProps = {
  categoryOptions: TaskCategoryOption[];
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onCreateTask: (input: TaskInlineCreateInput) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onUpdateCategory: (categoryId: string, name: string) => Promise<TaskCategoryOption>;
};

/** Renders the inline task-create row that saves a local task on outside click. */
export default function TaskCreateInlineRow({
  categoryOptions,
  onCreateCategory,
  onCreateTask,
  onDeleteCategory,
  onUpdateCategory
}: TaskCreateInlineRowProps) {
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
        <TaskCreateInlineFields
          categoryOptions={categoryOptions}
          draft={draft}
          isSubmitting={isSubmitting}
          onCreateCategory={onCreateCategory}
          onDeleteCategory={onDeleteCategory}
          onCategoryFieldOpenChange={setIsCategoryFieldOpen}
          onDescriptionChange={setDescription}
          onSelectCategory={setCategoryId}
          onTitleChange={setTitle}
          onUpdateCategory={onUpdateCategory}
          titleInputRef={titleInputRef}
        />

        <TaskCreateInlineFeedback
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
        />
      </Stack>
    </Box>
  );
}
