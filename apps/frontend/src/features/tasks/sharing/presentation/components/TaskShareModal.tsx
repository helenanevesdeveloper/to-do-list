import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text
} from '@chakra-ui/react';

/** Props for the future task-sharing modal. */
export interface TaskShareModalProps {
  isOpen: boolean;
  taskId: string | null;
  taskTitle: string | null;
  onClose: () => void;
}

/** Renders a temporary share modal while the full sharing flow is still pending. */
export default function TaskShareModal({
  isOpen,
  taskId,
  taskTitle,
  onClose
}: TaskShareModalProps) {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent>
        <ModalHeader>Compartilhar tarefa</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={3}>
            <Text fontWeight="semibold">{taskTitle ?? 'Sem titulo'}</Text>
            <Text color="gray.600">
              O fluxo completo de compartilhamento sera implementado na proxima etapa
              do dashboard.
            </Text>
            {taskId ? (
              <Text color="gray.500" fontSize="sm">
                Tarefa selecionada: {taskId}
              </Text>
            ) : null}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
