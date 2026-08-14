import { FormControl, Select } from '@chakra-ui/react';
import type { TaskCompletionStatus } from '../../../shared/types';

export type TaskEditStatusFieldProps = {
  isDisabled?: boolean;
  onChange: (value: TaskCompletionStatus) => void;
  value: TaskCompletionStatus;
};

/** Renders the inline-edit status selector for one task. */
export default function TaskEditStatusField({
  isDisabled = false,
  onChange,
  value
}: TaskEditStatusFieldProps) {
  return (
    <FormControl flex={{ md: '1.1' }}>
      <Select
        aria-label="Editar status da tarefa"
        isDisabled={isDisabled}
        value={value}
        onChange={(event) => onChange(event.target.value as TaskCompletionStatus)}
      >
        <option value="pending">Pendente</option>
        <option value="completed">Concluída</option>
      </Select>
    </FormControl>
  );
}
