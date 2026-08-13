import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import type { TaskScopeFilter } from '../../../shared/types.js';

export type TaskScopeFieldProps = {
  value: TaskScopeFilter;
  onChange: (value: TaskScopeFilter) => void;
};

/** Renders the task-scope select field for the dashboard toolbar. */
export default function TaskScopeField({
  value,
  onChange
}: TaskScopeFieldProps) {
  return (
    <FormControl>
      <FormLabel htmlFor="task-scope-filter">Escopo</FormLabel>
      <Select
        id="task-scope-filter"
        value={value}
        onChange={(event) => onChange(event.target.value as TaskScopeFilter)}
      >
        <option value="owned">Minhas tarefas</option>
        <option value="shared">Compartilhadas comigo</option>
        <option value="all">Todas visíveis</option>
      </Select>
    </FormControl>
  );
}
