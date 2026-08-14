import { Box, Button, Stack, Text } from '@chakra-ui/react';
import {
  useTaskInlineCategoryFieldContext
} from '../context/TaskInlineCategoryFieldContext';

/** Renders the fixed footer action used to create a category from the current query. */
export default function TaskInlineCategoryPopoverCreateFooter() {
  const {
    categoryErrorMessage,
    createCategory,
    createLabel,
    isCreatingCategory
  } = useTaskInlineCategoryFieldContext();

  return (
    <Box borderTopWidth="1px" bg="white" px={2} py={2}>
      <Stack spacing={2}>
        <Button
          width="100%"
          justifyContent="flex-start"
          variant="ghost"
          colorScheme="blue"
          isLoading={isCreatingCategory}
          onClick={createCategory}
        >
          {createLabel}
        </Button>
        {categoryErrorMessage ? (
          <Text px={3} fontSize="sm" color="red.500">
            {categoryErrorMessage}
          </Text>
        ) : null}
      </Stack>
    </Box>
  );
}
