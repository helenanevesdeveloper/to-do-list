import type { TaskListItem } from '../../../shared/types';
import type { TaskShare } from '../../domain/taskShare';
import type {
  UseTaskShareAccessListResult
} from './useTaskShareAccessList';
import type {
  UseTaskShareComposerResult
} from './useTaskShareComposer';
import type {
  UseTaskShareModalResult
} from './useTaskShareModal';
import { createLocalTaskShare } from '../state/createLocalTaskShare';
import { readManageableTaskShareModal } from '../state/readManageableTaskShareModal';
import { readTaskShareOwnerEmail } from '../state/readTaskShareOwnerEmail';
import { validateTaskShareSubmission } from '../state/validateTaskShareSubmission';
import type { UseTaskShareListQueryResult } from './useTaskShareListQuery';

export interface UseTaskShareModalControllerInput {
  accessList: UseTaskShareAccessListResult;
  composer: UseTaskShareComposerResult;
  currentUserEmail: string | null;
  modalSession: UseTaskShareModalResult;
  shareListQuery: UseTaskShareListQueryResult;
  shares: readonly TaskShare[];
}

export interface UseTaskShareModalControllerResult {
  closeTaskShareModal: () => void;
  openTaskShareModal: (task: TaskListItem) => void;
  removeTaskShare: (shareId: string) => void;
  submitTaskShare: () => void;
}

/** Orchestrates the local-only share modal workflows from smaller state hooks. */
export function useTaskShareModalController({
  accessList,
  composer,
  currentUserEmail,
  modalSession,
  shareListQuery,
  shares
}: UseTaskShareModalControllerInput): UseTaskShareModalControllerResult {
  function openTaskShareModal(task: TaskListItem): void {
    modalSession.openModal(task, currentUserEmail);
    composer.resetComposer();
    void shareListQuery.loadTaskShares(task.id);
  }

  function closeTaskShareModal(): void {
    modalSession.closeModal();
    composer.resetComposer();
    shareListQuery.resetError();
  }

  function submitTaskShare(): void {
    const activeTask = readManageableTaskShareModal(modalSession.activeTask);

    if (!activeTask) {
      return;
    }

    const validationMessage = validateTaskShareSubmission({
      email: composer.composerEmail,
      ownerEmail: readTaskShareOwnerEmail({
        fallbackOwnerEmail: activeTask.ownerEmail,
        shares
      }),
      permission: composer.composerPermission,
      shares
    });

    if (validationMessage) {
      composer.setComposerError(validationMessage);
      return;
    }

    accessList.addShare(
      activeTask.taskId,
      createLocalTaskShare({
        email: composer.composerEmail,
        permission: composer.composerPermission,
        taskId: activeTask.taskId
      })
    );
    composer.resetComposer();
  }

  function removeTaskShare(shareId: string): void {
    const activeTask = readManageableTaskShareModal(modalSession.activeTask);

    if (!activeTask) {
      return;
    }

    accessList.removeShare(activeTask.taskId, shareId);
    composer.clearError();
  }

  return {
    closeTaskShareModal,
    openTaskShareModal,
    removeTaskShare,
    submitTaskShare
  };
}
