import { Box, Center, Stack, Text } from '@chakra-ui/react';
import type { TaskListItem } from '../../../shared/types.js';
import TaskTableDesktop from './TaskTableDesktop.js';
import TaskTableMobileList from './TaskTableMobileList.js';

export type TaskTableProps = {
  items: TaskListItem[];
  onTaskClick: (task: TaskListItem) => void;
};

/** Renders the task results area with desktop table, mobile cards, and empty state. */
export default function TaskTable({ items, onTaskClick }: TaskTableProps) {
  if (items.length === 0) {
    return (
      <Center borderWidth="1px" borderRadius="lg" p={{ base: 8, md: 10 }}>
        <Stack spacing={2} textAlign="center" maxW="md">
          <Text fontWeight="semibold">Nenhuma tarefa encontrada</Text>
          <Text color="gray.600">
            Ajuste os filtros atuais ou crie uma nova tarefa para começar a listar resultados.
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <TaskTableDesktop items={items} onTaskClick={onTaskClick} />
      <Box p={{ base: 4, md: 0 }}>
        <TaskTableMobileList items={items} onTaskClick={onTaskClick} />
      </Box>
    </Box>
  );
}
