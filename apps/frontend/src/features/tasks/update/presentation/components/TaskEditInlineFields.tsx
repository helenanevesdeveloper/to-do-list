import { FormControl, Input, Stack } from '@chakra-ui/react';
import TaskInlineCategoryField from '../../../categories/presentation/components/TaskInlineCategoryField';
import type { TaskCategoryOption } from '../../../shared/types';
import type { TaskInlineEditDraft } from '../state/taskInlineEditTypes';

export type TaskEditInlineFieldsProps = {
  categoryOptions: TaskCategoryOption[];
  draft: TaskInlineEditDraft;
  interactionBoundaryRef: React.RefObject<HTMLDivElement | null>;
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

/** Renders only the editable fields and category selector for inline task editing. */
export default function TaskEditInlineFields({
  categoryOptions,
  draft,
  interactionBoundaryRef,
  isSubmitting,
  onCreateCategory,
  onDeleteCategory,
  onCategoryFieldOpenChange,
  onDescriptionChange,
  onSelectCategory,
  onTitleChange,
  onUpdateCategory,
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
        interactionBoundaryRef={interactionBoundaryRef}
        onOpenChange={onCategoryFieldOpenChange}
        value={draft.categoryId}
        onSelectCategory={onSelectCategory}
        onCreateCategory={onCreateCategory}
        onDeleteCategory={onDeleteCategory}
        onUpdateCategory={onUpdateCategory}
      />
    </Stack>
  );
}
