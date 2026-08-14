import { Box, Text } from '@chakra-ui/react';
import {
  useTaskInlineCategoryFieldContext
} from '../context/TaskInlineCategoryFieldContext';
import TaskInlineCategoryOptionList from './TaskInlineCategoryOptionList';

/** Renders the popover heading plus the scrollable list of existing categories. */
export default function TaskInlineCategoryPopoverListSection() {
  useTaskInlineCategoryFieldContext();

  return (
    <>
      <Box px={4} pt={3} pb={2}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.600">
          Selecione uma opcao ou crie uma
        </Text>
      </Box>

      <Box maxH="240px" overflowY="auto" px={2} pb={2}>
        <TaskInlineCategoryOptionList />
      </Box>
    </>
  );
}
