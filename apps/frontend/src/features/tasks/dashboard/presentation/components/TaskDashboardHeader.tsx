import { Box, Button, Heading, HStack, Stack, Text } from '@chakra-ui/react';

export type TaskDashboardHeaderProps = {
  title: string;
  subtitle: string;
  onLogout: () => void;
  isLoggingOut?: boolean;
  onAddTasks?: () => void;
  addTasksLabel?: string;
  logoutLabel?: string;
};

/** Renders the top dashboard header with primary task and logout actions. */
export default function TaskDashboardHeader({
  title,
  subtitle,
  onLogout,
  isLoggingOut = false,
  onAddTasks,
  addTasksLabel = 'Adicionar tarefas',
  logoutLabel = 'Logout'
}: TaskDashboardHeaderProps) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={{ base: 6, md: 8 }}>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing={6}
        justify="space-between"
        align={{ base: 'stretch', md: 'center' }}
      >
        <Box>
          <Heading size="lg" mb={2}>
            {title}
          </Heading>
          <Text color="gray.600">{subtitle}</Text>
        </Box>

        <HStack spacing={3} alignSelf={{ base: 'stretch', md: 'center' }}>
          {onAddTasks ? (
            <Button colorScheme="blue" onClick={onAddTasks}>
              {addTasksLabel}
            </Button>
          ) : null}
          <Button
            colorScheme="red"
            variant="outline"
            isLoading={isLoggingOut}
            onClick={onLogout}
          >
            {logoutLabel}
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}
