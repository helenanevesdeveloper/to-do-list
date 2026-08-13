import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import type { TaskCategoryOption } from '../../../shared/types';

export type TaskCategoryFieldProps = {
  value: string;
  categoryOptions: TaskCategoryOption[];
  onChange: (value: string) => void;
};

/** Renders the category select field for the dashboard toolbar. */
export default function TaskCategoryField({
  value,
  categoryOptions,
  onChange
}: TaskCategoryFieldProps) {
  return (
    <FormControl>
      <FormLabel htmlFor="task-category-filter">Categoria</FormLabel>
      <Select
        id="task-category-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Todas as categorias</option>
        {categoryOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
