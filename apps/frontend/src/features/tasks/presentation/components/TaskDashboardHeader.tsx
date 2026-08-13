import { Box, Button, Heading, HStack, Stack, Text } from '@chakra-ui/react';

export type TaskDashboardHeaderProps = {
  title: string;
  subtitle: string;
  onAddTasks: () => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
  addTasksLabel?: string;
  logoutLabel?: string;
};

export default function TaskDashboardHeader({
  title,
  subtitle,
  onAddTasks,
  onLogout,
  isLoggingOut = false,
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
          <Button colorScheme="blue" onClick={onAddTasks}>
            {addTasksLabel}
          </Button>
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
