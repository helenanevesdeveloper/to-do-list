import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import type { TaskStatusFilter } from '../../../shared/types';

export type TaskStatusFieldProps = {
  value: TaskStatusFilter;
  onChange: (value: TaskStatusFilter) => void;
};

/** Renders the completion-status select field for the dashboard toolbar. */
export default function TaskStatusField({
  value,
  onChange
}: TaskStatusFieldProps) {
  return (
    <FormControl>
      <FormLabel htmlFor="task-status-filter">Status</FormLabel>
      <Select
        id="task-status-filter"
        value={value}
        onChange={(event) => onChange(event.target.value as TaskStatusFilter)}
      >
        <option value="all">Todas</option>
        <option value="pending">Pendentes</option>
        <option value="completed">Concluídas</option>
      </Select>
    </FormControl>
  );
}
