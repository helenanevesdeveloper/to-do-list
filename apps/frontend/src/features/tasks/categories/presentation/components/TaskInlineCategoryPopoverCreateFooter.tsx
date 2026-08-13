import { Box, Button } from '@chakra-ui/react';

export type TaskInlineCategoryPopoverCreateFooterProps = {
  createLabel: string;
  onCreateCategory: () => void;
};

/** Renders the fixed footer action used to create a category from the current query. */
export default function TaskInlineCategoryPopoverCreateFooter({
  createLabel,
  onCreateCategory
}: TaskInlineCategoryPopoverCreateFooterProps) {
  return (
    <Box borderTopWidth="1px" bg="white" px={2} py={2}>
      <Button
        width="100%"
        justifyContent="flex-start"
        variant="ghost"
        colorScheme="blue"
        onClick={onCreateCategory}
      >
        {createLabel}
      </Button>
    </Box>
  );
}
