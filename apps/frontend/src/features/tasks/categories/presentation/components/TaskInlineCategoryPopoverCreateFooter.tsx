import { Box, Button, Stack, Text } from '@chakra-ui/react';

export type TaskInlineCategoryPopoverCreateFooterProps = {
  createLabel: string;
  errorMessage?: string | null;
  isLoading?: boolean;
  onCreateCategory: () => Promise<void>;
};

/** Renders the fixed footer action used to create a category from the current query. */
export default function TaskInlineCategoryPopoverCreateFooter({
  createLabel,
  errorMessage = null,
  isLoading = false,
  onCreateCategory
}: TaskInlineCategoryPopoverCreateFooterProps) {
  return (
    <Box borderTopWidth="1px" bg="white" px={2} py={2}>
      <Stack spacing={2}>
        <Button
          width="100%"
          justifyContent="flex-start"
          variant="ghost"
          colorScheme="blue"
          isLoading={isLoading}
          onClick={onCreateCategory}
        >
          {createLabel}
        </Button>
        {errorMessage ? (
          <Text px={3} fontSize="sm" color="red.500">
            {errorMessage}
          </Text>
        ) : null}
      </Stack>
    </Box>
  );
}
