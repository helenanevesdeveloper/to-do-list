import { Badge, Box, Stack, Text } from '@chakra-ui/react';
import type { TaskListItem } from '../../../shared/types';
import { buildTaskListItemDisplay } from '../mappers/buildTaskListItemDisplay';

export type TaskTableCardProps = {
  task: TaskListItem;
  onClick: (task: TaskListItem) => void;
};

/** Renders a single mobile card inside the task results list. */
export default function TaskTableCard({ task, onClick }: TaskTableCardProps) {
  const display = buildTaskListItemDisplay(task);

  return (
    <Box
      as="button"
      type="button"
      textAlign="left"
      width="full"
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      onClick={() => onClick(task)}
    >
      <Stack spacing={3}>
        <Box>
          <Text fontWeight="semibold" mb={1}>
            {task.title}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {display.descriptionLabel}
          </Text>
        </Box>

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Badge colorScheme={display.statusColorScheme}>{display.statusLabel}</Badge>
          <Badge colorScheme="purple">{display.categoryLabel}</Badge>
        </Stack>

        <Text fontSize="sm" color="gray.600">
          {display.sharingLabel}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Criada em {display.createdAtLabel}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Atualizada em {display.updatedAtLabel}
        </Text>
      </Stack>
    </Box>
  );
}
