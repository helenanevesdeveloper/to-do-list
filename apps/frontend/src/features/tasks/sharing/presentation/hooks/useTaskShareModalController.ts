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
import { TASK_SHARE_EDITOR_UNAVAILABLE_MESSAGE } from '../state/taskShareDraft';
import { validateTaskShareDraft } from '../state/validateTaskShareDraft';

export interface UseTaskShareModalControllerInput {
  accessList: UseTaskShareAccessListResult;
  composer: UseTaskShareComposerResult;
  currentUserEmail: string | null;
  modalSession: UseTaskShareModalResult;
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
  shares
}: UseTaskShareModalControllerInput): UseTaskShareModalControllerResult {
  function openTaskShareModal(task: TaskListItem): void {
    accessList.ensureTaskShares(task, currentUserEmail);
    modalSession.openModal(task, currentUserEmail);
    composer.resetComposer();
  }

  function closeTaskShareModal(): void {
    modalSession.closeModal();
    composer.resetComposer();
  }

  function submitTaskShare(): void {
    const activeTask = modalSession.activeTask;

    if (!activeTask || !activeTask.canManageShares) {
      return;
    }

    if (composer.composerPermission === 'editor') {
      composer.setComposerError(TASK_SHARE_EDITOR_UNAVAILABLE_MESSAGE);
      return;
    }

    const validationMessage = validateTaskShareDraft({
      email: composer.composerEmail,
      ownerEmail: activeTask.ownerEmail,
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
    const activeTask = modalSession.activeTask;

    if (!activeTask || !activeTask.canManageShares) {
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
