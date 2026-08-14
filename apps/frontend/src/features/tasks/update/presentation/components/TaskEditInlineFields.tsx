import { FormControl, Input, Stack } from '@chakra-ui/react';
import TaskInlineCategoryField from '../../../categories/presentation/components/TaskInlineCategoryField';
import type {
  TaskCategoryOption,
  TaskCompletionStatus
} from '../../../shared/types';
import TaskEditStatusField from './TaskEditStatusField';
import type { TaskInlineEditDraft } from '../state/taskInlineEditTypes';

export type TaskEditInlineFieldsProps = {
  categoryOptions: TaskCategoryOption[];
  draft: TaskInlineEditDraft;
  isSubmitting: boolean;
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onDescriptionChange: (value: string) => void;
  onSelectCategory: (value: string) => void;
  onStatusChange: (value: TaskCompletionStatus) => void;
  onTitleChange: (value: string) => void;
  onUpdateCategory: (categoryId: string, name: string) => Promise<TaskCategoryOption>;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
};

/** Renders only the editable fields and category selector for inline task editing. */
export default function TaskEditInlineFields({
  categoryOptions,
  draft,
  isSubmitting,
  onCreateCategory,
  onDeleteCategory,
  onDescriptionChange,
  onSelectCategory,
  onStatusChange,
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
        value={draft.categoryId}
        onSelectCategory={onSelectCategory}
        onCreateCategory={onCreateCategory}
        onDeleteCategory={onDeleteCategory}
        onUpdateCategory={onUpdateCategory}
      />

      <TaskEditStatusField
        isDisabled={isSubmitting}
        value={draft.status}
        onChange={onStatusChange}
      />
    </Stack>
  );
}
