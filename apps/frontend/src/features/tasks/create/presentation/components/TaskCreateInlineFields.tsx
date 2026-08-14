import { FormControl, Input, Stack } from '@chakra-ui/react';
import TaskInlineCategoryField from '../../../categories/presentation/components/TaskInlineCategoryField';
import type { TaskCategoryOption } from '../../../shared/types';
import type { TaskInlineCreateDraft } from '../state/taskInlineCreateTypes';

export type TaskCreateInlineFieldsProps = {
  categoryOptions: TaskCategoryOption[];
  draft: TaskInlineCreateDraft;
  isSubmitting: boolean;
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onCategoryFieldOpenChange: (isOpen: boolean) => void;
  onDescriptionChange: (value: string) => void;
  onSelectCategory: (value: string) => void;
  onTitleChange: (value: string) => void;
  onUpdateCategory: (categoryId: string, name: string) => Promise<TaskCategoryOption>;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
};

/** Renders only the input fields and category selector for inline task creation. */
export default function TaskCreateInlineFields({
  categoryOptions,
  draft,
  isSubmitting,
  onCreateCategory,
  onDeleteCategory,
  onCategoryFieldOpenChange,
  onDescriptionChange,
  onSelectCategory,
  onTitleChange,
  onUpdateCategory,
  titleInputRef
}: TaskCreateInlineFieldsProps) {
  return (
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
          isDisabled={isSubmitting}
          value={draft.title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </FormControl>

      <FormControl flex={{ md: '2' }}>
        <Input
          aria-label="Descrição da tarefa"
          placeholder="Descrição opcional"
          isDisabled={isSubmitting}
          value={draft.description}
          onChange={(event) => onDescriptionChange(event.target.value)}
        />
      </FormControl>

      <TaskInlineCategoryField
        categoryOptions={categoryOptions}
        onOpenChange={onCategoryFieldOpenChange}
        value={draft.categoryId}
        onSelectCategory={onSelectCategory}
        onCreateCategory={onCreateCategory}
        onDeleteCategory={onDeleteCategory}
        onUpdateCategory={onUpdateCategory}
        showCategoryActions
      />
    </Stack>
  );
}
