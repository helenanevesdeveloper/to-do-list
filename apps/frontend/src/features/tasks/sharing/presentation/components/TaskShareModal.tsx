import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text
} from '@chakra-ui/react';
import { useTaskShareModalContext } from '../context/TaskShareModalContext';
import TaskShareAccessList from './TaskShareAccessList';
import TaskShareComposer from './TaskShareComposer';

/** Renders the local-only task-sharing modal before API integration. */
export default function TaskShareModal() {
  const {
    canManageShares,
    closeTaskShareModal,
    composerEmail,
    composerPermission,
    currentUserEmail,
    deletingShareId,
    errorMessage,
    isOpen,
    isLoadingShares,
    isSubmittingShare,
    removeTaskShare,
    retryTaskShares,
    selectedTaskId,
    selectedTaskTitle,
    setComposerEmail,
    setComposerPermission,
    shareListErrorMessage,
    shares,
    submitTaskShare
  } = useTaskShareModalContext();

  return (
    <Modal isCentered isOpen={isOpen} onClose={closeTaskShareModal} size="2xl">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent>
        <ModalHeader>Compartilhar tarefa</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            <TaskShareComposer
              canManageShares={canManageShares}
              email={composerEmail}
              errorMessage={errorMessage}
              isSubmitting={isSubmittingShare}
              onEmailChange={setComposerEmail}
              onPermissionChange={setComposerPermission}
              onSubmit={submitTaskShare}
              permission={composerPermission}
            />

            <Divider />

            <TaskShareAccessList
              canManageShares={canManageShares}
              currentUserEmail={currentUserEmail}
              deletingShareId={deletingShareId}
              errorMessage={shareListErrorMessage}
              isLoading={isLoadingShares}
              onRemoveShare={removeTaskShare}
              onRetry={retryTaskShares}
              shares={shares}
            />

          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
