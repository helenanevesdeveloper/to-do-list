import { Td, Text } from '@chakra-ui/react';

export interface TaskTableRowContentCellProps {
  descriptionLabel: string;
  title: string;
}

/** Renders the leading content cell with task title and truncated description. */
export default function TaskTableRowContentCell({
  descriptionLabel,
  title
}: TaskTableRowContentCellProps) {
  return (
    <Td>
      <Text fontWeight="semibold" mb={1}>
        {title}
      </Text>
      <Text fontSize="sm" color="gray.600" noOfLines={1}>
        {descriptionLabel}
      </Text>
    </Td>
  );
}
