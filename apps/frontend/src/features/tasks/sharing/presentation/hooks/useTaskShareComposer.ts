import { useCallback, useState } from 'react';
import type { ShareComposerPermission } from '../state/taskShareDraft';
import { TASK_SHARE_EDITOR_UNAVAILABLE_MESSAGE } from '../state/taskShareDraft';

/** State returned by the hook that owns the local share-composer inputs. */
export interface UseTaskShareComposerResult {
  clearError: () => void;
  composerEmail: string;
  composerPermission: ShareComposerPermission;
  errorMessage: string | null;
  resetComposer: () => void;
  setComposerEmail: (value: string) => void;
  setComposerError: (value: string | null) => void;
  setComposerPermission: (value: ShareComposerPermission) => void;
}

/** Owns only the local composer input state used by the dashboard share modal. */
export function useTaskShareComposer(): UseTaskShareComposerResult {
  const [composerEmail, setComposerEmailState] = useState('');
  const [composerPermission, setComposerPermissionState] =
    useState<ShareComposerPermission>('reader');
  const [errorMessage, setComposerError] = useState<string | null>(null);

  const clearError = useCallback((): void => {
    setComposerError(null);
  }, []);

  const resetComposer = useCallback((): void => {
    setComposerEmailState('');
    setComposerPermissionState('reader');
    setComposerError(null);
  }, []);

  const setComposerEmail = useCallback((value: string): void => {
    setComposerEmailState(value);
    setComposerError(null);
  }, []);

  const setComposerPermission = useCallback((value: ShareComposerPermission): void => {
    setComposerPermissionState(value);
    setComposerError(
      value === 'editor' ? TASK_SHARE_EDITOR_UNAVAILABLE_MESSAGE : null
    );
  }, []);

  return {
    clearError,
    composerEmail,
    composerPermission,
    errorMessage,
    resetComposer,
    setComposerEmail,
    setComposerError,
    setComposerPermission
  };
}
