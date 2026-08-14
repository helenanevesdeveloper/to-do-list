import {
  createContext,
  useContext,
  useMemo,
  type ReactNode
} from 'react';
import type { TaskListItem } from '../../../shared/types';
import type { TaskShare } from '../../domain/taskShare';
import { useTaskShareAccessList } from '../hooks/useTaskShareAccessList';
import { useTaskShareComposer } from '../hooks/useTaskShareComposer';
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
  openTaskShareModal: (task: TaskListItem) => void;
  removeTaskShare: (shareId: string) => void;
  selectedTaskId: string | null;
  selectedTaskTitle: string | null;
  setComposerEmail: (value: string) => void;
  setComposerPermission: (value: ShareComposerPermission) => void;
  shares: readonly TaskShare[];
  submitTaskShare: () => void;
}

const TaskShareModalContext = createContext<TaskShareModalContextValue | null>(null);

export interface TaskShareModalProviderProps {
  children: ReactNode;
  currentUserEmail: string | null;
}

/** Provides the local-only dashboard share modal state before API integration. */
export function TaskShareModalProvider({
  children,
  currentUserEmail
}: TaskShareModalProviderProps) {
  const accessList = useTaskShareAccessList();
  const composer = useTaskShareComposer();
  const modalSession = useTaskShareModal();
  const shares = accessList.getShares(modalSession.activeTask?.taskId ?? null);
  const controller = useTaskShareModalController({
    accessList,
    composer,
    currentUserEmail,
    modalSession,
    shares
  });

  const value = useMemo<TaskShareModalContextValue>(
    () =>
      buildTaskShareModalContextValue({
        composer,
        controller,
        currentUserEmail,
        modalSession,
        shares
      }),
    [
      controller,
      composer.composerEmail,
      composer.composerPermission,
      composer.errorMessage,
      currentUserEmail,
      modalSession.activeTask,
      modalSession.isOpen,
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
