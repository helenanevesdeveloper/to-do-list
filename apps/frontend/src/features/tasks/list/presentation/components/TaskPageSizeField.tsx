import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { TASK_PAGE_SIZE_OPTIONS } from '../../../shared/types.js';

export type TaskPageSizeFieldProps = {
  value: number;
  onChange: (value: number) => void;
};

/** Renders the page-size select field for the dashboard toolbar. */
export default function TaskPageSizeField({
  value,
  onChange
}: TaskPageSizeFieldProps) {
  return (
    <FormControl maxW={{ base: 'full', xl: '180px' }}>
      <FormLabel htmlFor="task-page-size">Itens por página</FormLabel>
      <Select
        id="task-page-size"
        value={String(value)}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {TASK_PAGE_SIZE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
