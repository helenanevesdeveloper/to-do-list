import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode
} from 'react';
import type { TaskListItem } from '../../../shared/types';
import type { TaskShare } from '../../domain/taskShare';
import { useTaskShareAccessList } from '../hooks/useTaskShareAccessList';
import { useTaskShareComposer } from '../hooks/useTaskShareComposer';
import { useTaskShareCreateAction } from '../hooks/useTaskShareCreateAction';
import { useTaskShareListQuery } from '../hooks/useTaskShareListQuery';
import {
  useTaskShareModalController
} from '../hooks/useTaskShareModalController';
import { useTaskShareModal } from '../hooks/useTaskShareModal';
import { type ShareComposerPermission } from '../state/taskShareDraft';
import { buildTaskShareModalContextValue } from './buildTaskShareModalContextValue';

export interface TaskShareModalContextValue {
  canManageShares: boolean;
  closeTaskShareModal: () => void;
  composerEmail: string;
  composerPermission: ShareComposerPermission;
  currentUserEmail: string | null;
  errorMessage: string | null;
  isOpen: boolean;
  isLoadingShares: boolean;
  isSubmittingShare: boolean;
  openTaskShareModal: (task: TaskListItem) => void;
  removeTaskShare: (shareId: string) => void;
  retryTaskShares: () => void;
  selectedTaskId: string | null;
  selectedTaskTitle: string | null;
  setComposerEmail: (value: string) => void;
  setComposerPermission: (value: ShareComposerPermission) => void;
  shareListErrorMessage: string | null;
  shares: readonly TaskShare[];
  submitTaskShare: () => void;
}

const TaskShareModalContext = createContext<TaskShareModalContextValue | null>(null);

export interface TaskShareModalProviderProps {
  children: ReactNode;
  currentUserEmail: string | null;
}

/** Provides the dashboard share modal state, including server-loaded access lists. */
export function TaskShareModalProvider({
  children,
  currentUserEmail
}: TaskShareModalProviderProps) {
  const accessList = useTaskShareAccessList();
  const composer = useTaskShareComposer();
  const createAction = useTaskShareCreateAction();
  const modalSession = useTaskShareModal();
  const shareListQuery = useTaskShareListQuery({
    replaceShares: accessList.replaceShares
  });
  const shares = accessList.getShares(modalSession.activeTask?.taskId ?? null);
  const controller = useTaskShareModalController({
    accessList,
    composer,
    createAction,
    currentUserEmail,
    modalSession,
    shareListQuery,
    shares
  });
  const retryTaskShares = useCallback((): void => {
    const taskId = modalSession.activeTask?.taskId;

    if (!taskId) {
      return;
    }

    void shareListQuery.loadTaskShares(taskId);
  }, [modalSession.activeTask?.taskId, shareListQuery]);

  const value = useMemo<TaskShareModalContextValue>(
    () =>
      buildTaskShareModalContextValue({
        composer,
        controller,
        createAction,
        currentUserEmail,
        modalSession,
        retryTaskShares,
        shareListQuery,
        shares
      }),
    [
      controller,
      createAction.isSubmittingShare,
      composer.composerEmail,
      composer.composerPermission,
      composer.errorMessage,
      currentUserEmail,
      modalSession.activeTask,
      modalSession.isOpen,
      retryTaskShares,
      shareListQuery.errorMessage,
      shareListQuery.isLoadingShares,
      shares
    ]
  );

  return (
    <TaskShareModalContext.Provider value={value}>
      {children}
    </TaskShareModalContext.Provider>
  );
}

/** Reads the local dashboard share modal state and actions from context. */
export function useTaskShareModalContext(): TaskShareModalContextValue {
  const context = useContext(TaskShareModalContext);

  if (!context) {
    throw new Error('useTaskShareModalContext must be used within TaskShareModalProvider.');
  }

  return context;
}
