import { FormControl, Input, Stack } from '@chakra-ui/react';
import TaskInlineCategoryField from '../../../categories/presentation/components/TaskInlineCategoryField';
import type { TaskCategoryOption } from '../../../shared/types';
import type { TaskInlineEditDraft } from '../state/taskInlineEditTypes';

export type TaskEditInlineFieldsProps = {
  categoryOptions: TaskCategoryOption[];
  draft: TaskInlineEditDraft;
  isSubmitting: boolean;
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onCategoryFieldOpenChange: (isOpen: boolean) => void;
  onDescriptionChange: (value: string) => void;
  onSelectCategory: (value: string) => void;
  onTitleChange: (value: string) => void;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
};

/** Renders only the editable fields and category selector for inline task editing. */
export default function TaskEditInlineFields({
  categoryOptions,
  draft,
  isSubmitting,
  onCreateCategory,
  onCategoryFieldOpenChange,
  onDescriptionChange,
  onSelectCategory,
  onTitleChange,
  titleInputRef
}: TaskEditInlineFieldsProps) {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={3}
      align={{ base: 'stretch', md: 'flex-start' }}
    >
      <FormControl flex={{ md: '2' }}>
        <Input
          ref={titleInputRef}
          aria-label="Editar titulo da tarefa"
          placeholder="Titulo da tarefa"
          isDisabled={isSubmitting}
          value={draft.title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </FormControl>

      <FormControl flex={{ md: '2' }}>
        <Input
          aria-label="Editar descricao da tarefa"
          placeholder="Descricao opcional"
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
      />
    </Stack>
  );
}
