import { Badge, Box, Stack, Text } from '@chakra-ui/react';
import type { TaskListItemDisplay } from '../mappers/buildTaskListItemDisplay';

export interface TaskTableCardContentProps {
  display: TaskListItemDisplay;
  title: string;
}

/** Renders the textual and badge content shown inside one mobile task card. */
export default function TaskTableCardContent({
  display,
  title
}: TaskTableCardContentProps) {
  return (
    <Stack flex="1" spacing={3}>
      <Box>
        <Text fontWeight="semibold" mb={1}>
          {title}
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
  );
}
