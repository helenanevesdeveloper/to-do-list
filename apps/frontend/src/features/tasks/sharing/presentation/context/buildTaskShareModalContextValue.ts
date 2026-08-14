import type { TaskShare } from '../../domain/taskShare';
import type { TaskShareModalContextValue } from './TaskShareModalContext';
import type { UseTaskShareComposerResult } from '../hooks/useTaskShareComposer';
import type { UseTaskShareListQueryResult } from '../hooks/useTaskShareListQuery';
import type { UseTaskShareModalResult } from '../hooks/useTaskShareModal';
import type { UseTaskShareModalControllerResult } from '../hooks/useTaskShareModalController';

export interface BuildTaskShareModalContextValueInput {
  composer: UseTaskShareComposerResult;
  controller: UseTaskShareModalControllerResult;
  currentUserEmail: string | null;
  modalSession: UseTaskShareModalResult;
  retryTaskShares: () => void;
  shareListQuery: UseTaskShareListQueryResult;
  shares: readonly TaskShare[];
}

/** Builds the public context contract exposed by the local task-share modal provider. */
export function buildTaskShareModalContextValue({
  composer,
  controller,
  currentUserEmail,
  modalSession,
  retryTaskShares,
  shareListQuery,
  shares
}: BuildTaskShareModalContextValueInput): TaskShareModalContextValue {
  return {
    canManageShares: modalSession.activeTask?.canManageShares ?? false,
    closeTaskShareModal: controller.closeTaskShareModal,
    composerEmail: composer.composerEmail,
    composerPermission: composer.composerPermission,
    currentUserEmail,
    errorMessage: composer.errorMessage,
    isOpen: modalSession.isOpen,
    isLoadingShares: shareListQuery.isLoadingShares,
    openTaskShareModal: controller.openTaskShareModal,
    removeTaskShare: controller.removeTaskShare,
    retryTaskShares,
    selectedTaskId: modalSession.activeTask?.taskId ?? null,
    selectedTaskTitle: modalSession.activeTask?.taskTitle ?? null,
    setComposerEmail: composer.setComposerEmail,
    setComposerPermission: composer.setComposerPermission,
    shareListErrorMessage: shareListQuery.errorMessage,
    shares,
    submitTaskShare: controller.submitTaskShare
  };
}
