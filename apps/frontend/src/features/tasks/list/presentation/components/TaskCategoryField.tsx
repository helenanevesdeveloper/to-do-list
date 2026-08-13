import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import type { TaskCategoryOption } from '../../../shared/types';

export type TaskCategoryFieldProps = {
  categoryOptions: TaskCategoryOption[];
  isDisabled?: boolean;
  onChange: (value: string) => void;
  value: string;
};

/** Renders the category select field for the dashboard toolbar. */
export default function TaskCategoryField({
  categoryOptions,
  isDisabled = false,
  onChange,
  value
}: TaskCategoryFieldProps) {
  return (
    <FormControl>
      <FormLabel htmlFor="task-category-filter">Categoria</FormLabel>
      <Select
        id="task-category-filter"
        isDisabled={isDisabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">
          {isDisabled ? 'Carregando categorias...' : 'Todas as categorias'}
        </option>
        {categoryOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
