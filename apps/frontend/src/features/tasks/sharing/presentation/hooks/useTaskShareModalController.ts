import type { TaskListItem } from '../../../shared/types';
import type { TaskShare } from '../../domain/taskShare';
import type {
  UseTaskShareAccessListResult
} from './useTaskShareAccessList';
import type {
  UseTaskShareComposerResult
} from './useTaskShareComposer';
import type {
  UseTaskShareCreateActionResult
} from './useTaskShareCreateAction';
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
  createAction: UseTaskShareCreateActionResult;
  currentUserEmail: string | null;
  modalSession: UseTaskShareModalResult;
  shareListQuery: UseTaskShareListQueryResult;
  shares: readonly TaskShare[];
}

export interface UseTaskShareModalControllerResult {
  closeTaskShareModal: () => void;
  openTaskShareModal: (task: TaskListItem) => void;
  removeTaskShare: (shareId: string) => void;
  submitTaskShare: () => Promise<void>;
}

/** Orchestrates the local-only share modal workflows from smaller state hooks. */
export function useTaskShareModalController({
  accessList,
  composer,
  createAction,
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

  async function submitTaskShare(): Promise<void> {
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

    const errorMessage = await createAction.requestTaskShareCreate({
      email: composer.composerEmail,
      permission: composer.composerPermission,
      taskId: activeTask.taskId
    });

    if (errorMessage) {
      composer.setComposerError(errorMessage);
      return;
    }

    composer.resetComposer();
    await shareListQuery.loadTaskShares(activeTask.taskId);
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
