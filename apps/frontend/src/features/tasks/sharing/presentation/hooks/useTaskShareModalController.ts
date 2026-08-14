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
  UseTaskShareDeleteActionResult
} from './useTaskShareDeleteAction';
import type {
  UseTaskShareModalResult
} from './useTaskShareModal';
import { readManageableTaskShareModal } from '../state/readManageableTaskShareModal';
import { readTaskShareOwnerEmail } from '../state/readTaskShareOwnerEmail';
import { validateTaskShareSubmission } from '../state/validateTaskShareSubmission';
import type { UseTaskShareListQueryResult } from './useTaskShareListQuery';

export interface UseTaskShareModalControllerInput {
  composer: UseTaskShareComposerResult;
  createAction: UseTaskShareCreateActionResult;
  currentUserEmail: string | null;
  deleteAction: UseTaskShareDeleteActionResult;
  modalSession: UseTaskShareModalResult;
  reloadTasks: () => void;
  shareListQuery: UseTaskShareListQueryResult;
  shares: readonly TaskShare[];
}

export interface UseTaskShareModalControllerResult {
  closeTaskShareModal: () => void;
  openTaskShareModal: (task: TaskListItem) => void;
  removeTaskShare: (shareId: string) => Promise<void>;
  submitTaskShare: () => Promise<void>;
}

/** Orchestrates the local-only share modal workflows from smaller state hooks. */
export function useTaskShareModalController({
  composer,
  createAction,
  currentUserEmail,
  deleteAction,
  modalSession,
  reloadTasks,
  shareListQuery,
  shares
}: UseTaskShareModalControllerInput): UseTaskShareModalControllerResult {
  function openTaskShareModal(task: TaskListItem): void {
    modalSession.openModal(task, currentUserEmail);
    composer.resetComposer();
    void shareListQuery.loadTaskShares(task.id);
  }

  function closeTaskShareModal(): void {
    const shouldReloadTasks = modalSession.closeModal();
    composer.resetComposer();
    shareListQuery.resetError();

    if (shouldReloadTasks) {
      reloadTasks();
    }
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
    modalSession.markTaskListForReload();
  }

  async function removeTaskShare(shareId: string): Promise<void> {
    const activeTask = modalSession.activeTask;

    if (!activeTask) {
      return;
    }

    const errorMessage = await deleteAction.requestTaskShareDelete({
      shareId,
      taskId: activeTask.taskId
    });

    if (errorMessage) {
      composer.setComposerError(errorMessage);
      return;
    }

    await shareListQuery.loadTaskShares(activeTask.taskId);
    modalSession.markTaskListForReload();
    composer.clearError();
  }

  return {
    closeTaskShareModal,
    openTaskShareModal,
    removeTaskShare,
    submitTaskShare
  };
}
