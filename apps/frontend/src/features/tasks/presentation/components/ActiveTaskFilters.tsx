import {
  Button,
  HStack,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import type { ActiveTaskFilterChip } from '../mappers/buildActiveTaskFilterChips.js';

export type ActiveTaskFiltersProps = {
  chips: ActiveTaskFilterChip[];
  onClearAll: () => void;
};

/** Renders only the active-filter chips and the clear-all action. */
export default function ActiveTaskFilters({
  chips,
  onClearAll
}: ActiveTaskFiltersProps) {
  const hasActiveFilters = chips.length > 0;

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={3}
      justify="space-between"
      align={{ base: 'stretch', md: 'center' }}
    >
      <Stack spacing={2}>
        <Text fontSize="sm" fontWeight="medium" color="gray.700">
          Filtros ativos
        </Text>

        {hasActiveFilters ? (
          <Wrap spacing={3}>
            {chips.map((chip) => (
              <WrapItem key={chip.id}>
                <Tag size="lg" borderRadius="full" colorScheme={chip.colorScheme}>
                  <TagLabel>{chip.label}</TagLabel>
                  <TagCloseButton onClick={chip.onClear} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        ) : (
          <Text fontSize="sm" color="gray.500">
            Nenhum filtro adicional aplicado.
          </Text>
        )}
      </Stack>

      {hasActiveFilters ? (
        <HStack justify={{ base: 'flex-start', md: 'flex-end' }}>
          <Button variant="ghost" onClick={onClearAll}>
            Limpar filtros
          </Button>
        </HStack>
      ) : null}
    </Stack>
  );
}
